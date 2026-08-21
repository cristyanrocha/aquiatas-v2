// Supabase Edge Function: admin-users
//
// Single secure entry point for every user-management mutation the admin
// panel needs (create, update name/role, activate/deactivate, delete,
// change email, trigger a password reset). It never trusts the caller's
// claimed role: it re-derives the caller's profile from the database using
// the service role key, which never reaches the browser.
//
// Actions (POST body: { action, ...payload }):
//   create          { name, email, phone?, public_agency_name, role }
//   update          { profile_id, name?, phone?, public_agency_name?, role? }
//   set_status      { profile_id, status }        // 'active' | 'inactive' | 'blocked'
//   update_email    { profile_id, email }
//   delete          { profile_id }
//   reset_password  { profile_id }

import { createClient } from "npm:@supabase/supabase-js@2";

const ROLES = ["user", "manager", "admin"] as const;
type Role = (typeof ROLES)[number];

const STATUSES = ["active", "inactive", "blocked"] as const;
type Status = (typeof STATUSES)[number];

interface Profile {
  id: number;
  auth_user_id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ success: false, error: "Método não suportado." }, 405);
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ success: false, error: "Sessão não encontrada. Faça login novamente." }, 401);
  }

  // Identifies the caller from their own JWT (validated by Supabase Auth).
  const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  // Privileged client for every write and every cross-user read. The
  // service role key lives only in this server-side environment.
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: authData, error: authError } = await callerClient.auth.getUser();
  if (authError || !authData?.user) {
    return json({ success: false, error: "Sessão inválida ou expirada." }, 401);
  }

  const { data: callerProfile, error: callerError } = await admin
    .from("profiles")
    .select("id, auth_user_id, name, email, role, status")
    .eq("auth_user_id", authData.user.id)
    .maybeSingle();

  if (callerError) {
    console.error("admin-users: failed to load caller profile", callerError);
    return json({ success: false, error: "Não foi possível validar seu perfil." }, 500);
  }

  if (!callerProfile || callerProfile.status !== "active" || !["admin", "manager"].includes(callerProfile.role)) {
    return json({ success: false, error: "Você não tem permissão para gerenciar usuários." }, 403);
  }

  const caller = callerProfile as Profile;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ success: false, error: "Requisição inválida." }, 400);
  }

  const action = String(body.action ?? "");

  try {
    switch (action) {
      case "create":
        return await handleCreate(admin, caller, body);
      case "update":
        return await handleUpdate(admin, caller, body);
      case "set_status":
        return await handleSetStatus(admin, caller, body);
      case "update_email":
        return await handleUpdateEmail(admin, caller, body);
      case "delete":
        return await handleDelete(admin, caller, body);
      case "reset_password":
        return await handleResetPassword(admin, caller, body);
      default:
        return json({ success: false, error: "Ação desconhecida." }, 400);
    }
  } catch (err) {
    console.error(`admin-users: unhandled error in action "${action}"`, err);
    return json({ success: false, error: "Erro inesperado ao processar a solicitação." }, 500);
  }
});

// deno-lint-ignore no-explicit-any
async function loadTarget(admin: any, profileId: number): Promise<Profile | null> {
  const { data, error } = await admin
    .from("profiles")
    .select("id, auth_user_id, name, email, role, status")
    .eq("id", profileId)
    .maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}

// deno-lint-ignore no-explicit-any
async function countOtherActiveAdmins(admin: any, excludingProfileId: number): Promise<number> {
  const { count, error } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "admin")
    .eq("status", "active")
    .neq("id", excludingProfileId);
  if (error) {
    console.error("admin-users: failed to count admins", error);
    return 1; // fail closed: assume there IS another admin so we don't accidentally allow removing the last one
  }
  return count ?? 0;
}

// deno-lint-ignore no-explicit-any
async function handleCreate(admin: any, caller: Profile, body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : undefined;
  const publicAgencyName = String(body.public_agency_name ?? "").trim();
  const requestedRole = String(body.role ?? "user") as Role;

  if (!name) return json({ success: false, error: "Informe o nome do usuário." }, 400);
  if (!isValidEmail(email)) return json({ success: false, error: "Informe um e-mail válido." }, 400);
  if (!publicAgencyName) {
    return json({ success: false, error: "Informe o órgão público ao qual você está vinculado." }, 400);
  }
  if (!ROLES.includes(requestedRole)) return json({ success: false, error: "Papel inválido." }, 400);

  if (caller.role === "manager" && requestedRole !== "user") {
    return json({ success: false, error: "Gestores só podem criar usuários com papel Usuário." }, 403);
  }

  const { data: created, error: createError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { name, phone, public_agency_name: publicAgencyName },
  });

  if (createError) {
    const msg = /already.*registered|already exists/i.test(createError.message ?? "")
      ? "Já existe um usuário cadastrado com este e-mail."
      : "Não foi possível criar o usuário.";
    return json({ success: false, error: msg }, 400);
  }

  const newAuthUserId = created.user?.id;
  if (!newAuthUserId) {
    return json({ success: false, error: "Usuário criado, mas não foi possível localizar o registro." }, 500);
  }

  // handle_new_user already created a profile with role='user'; promote it
  // now if the requester asked for manager/admin (admin only).
  if (requestedRole !== "user") {
    const { error: promoteError } = await admin
      .from("profiles")
      .update({ role: requestedRole })
      .eq("auth_user_id", newAuthUserId);

    if (promoteError) {
      console.error("admin-users: failed to set requested role on new user", promoteError);
      return json({ success: false, error: "Usuário criado, mas houve falha ao definir o papel solicitado." }, 500);
    }
  }

  return json({ success: true, data: { email, role: requestedRole } });
}

// deno-lint-ignore no-explicit-any
async function handleUpdate(admin: any, caller: Profile, body: Record<string, unknown>) {
  const profileId = Number(body.profile_id);
  if (!profileId) return json({ success: false, error: "Usuário não informado." }, 400);

  const target = await loadTarget(admin, profileId);
  if (!target) return json({ success: false, error: "Usuário não encontrado." }, 404);

  if (target.id === caller.id && body.role !== undefined && body.role !== caller.role) {
    return json({ success: false, error: "Você não pode alterar o seu próprio papel." }, 403);
  }

  if (caller.role === "manager" && target.role !== "user") {
    return json({ success: false, error: "Gestores só podem editar usuários com papel Usuário." }, 403);
  }

  const update: Record<string, unknown> = {};

  if (typeof body.name === "string" && body.name.trim()) {
    update.name = body.name.trim();
  }
  if (typeof body.phone === "string") {
    update.phone = body.phone.trim() || null;
  }
  if (typeof body.public_agency_name === "string") {
    const publicAgencyName = body.public_agency_name.trim();
    if (!publicAgencyName) {
      return json({ success: false, error: "Informe o órgão público ao qual você está vinculado." }, 400);
    }
    update.public_agency_name = publicAgencyName;
  }

  if (body.role !== undefined) {
    const newRole = String(body.role) as Role;
    if (!ROLES.includes(newRole)) return json({ success: false, error: "Papel inválido." }, 400);
    if (caller.role === "manager" && newRole !== "user") {
      return json({ success: false, error: "Gestores não podem promover usuários." }, 403);
    }
    if (target.role === "admin" && newRole !== "admin") {
      const others = await countOtherActiveAdmins(admin, target.id);
      if (others === 0) {
        return json({ success: false, error: "Não é possível remover o último administrador." }, 403);
      }
    }
    update.role = newRole;
  }

  if (Object.keys(update).length === 0) {
    return json({ success: false, error: "Nenhuma alteração informada." }, 400);
  }

  const { error } = await admin.from("profiles").update(update).eq("id", profileId);
  if (error) {
    console.error("admin-users: update failed", error);
    return json({ success: false, error: "Não foi possível atualizar o usuário." }, 500);
  }

  return json({ success: true });
}

// deno-lint-ignore no-explicit-any
async function handleSetStatus(admin: any, caller: Profile, body: Record<string, unknown>) {
  const profileId = Number(body.profile_id);
  const status = String(body.status ?? "") as Status;
  if (!profileId) return json({ success: false, error: "Usuário não informado." }, 400);
  if (!STATUSES.includes(status)) return json({ success: false, error: "Status inválido." }, 400);

  const target = await loadTarget(admin, profileId);
  if (!target) return json({ success: false, error: "Usuário não encontrado." }, 404);

  if (target.id === caller.id) {
    return json({ success: false, error: "Você não pode alterar o status da própria conta." }, 403);
  }

  if (caller.role === "manager" && target.role !== "user") {
    return json({ success: false, error: "Gestores só podem ativar ou desativar usuários com papel Usuário." }, 403);
  }

  if (target.role === "admin" && status !== "active") {
    const others = await countOtherActiveAdmins(admin, target.id);
    if (others === 0) {
      return json({ success: false, error: "Não é possível desativar o último administrador." }, 403);
    }
  }

  const { error } = await admin.from("profiles").update({ status }).eq("id", profileId);
  if (error) {
    console.error("admin-users: set_status failed", error);
    return json({ success: false, error: "Não foi possível alterar o status do usuário." }, 500);
  }

  return json({ success: true });
}

// deno-lint-ignore no-explicit-any
async function handleUpdateEmail(admin: any, caller: Profile, body: Record<string, unknown>) {
  const profileId = Number(body.profile_id);
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!profileId) return json({ success: false, error: "Usuário não informado." }, 400);
  if (!isValidEmail(email)) return json({ success: false, error: "Informe um e-mail válido." }, 400);

  const target = await loadTarget(admin, profileId);
  if (!target) return json({ success: false, error: "Usuário não encontrado." }, 404);

  if (caller.role === "manager" && target.role !== "user") {
    return json({ success: false, error: "Gestores só podem editar usuários com papel Usuário." }, 403);
  }

  const { error } = await admin.auth.admin.updateUserById(target.auth_user_id, { email });
  if (error) {
    const msg = /already.*registered|already exists/i.test(error.message ?? "")
      ? "Já existe um usuário cadastrado com este e-mail."
      : "Não foi possível alterar o e-mail do usuário.";
    return json({ success: false, error: msg }, 400);
  }

  // auth.users trigger (on_auth_user_updated) syncs profiles.email once the change lands.
  return json({ success: true });
}

// deno-lint-ignore no-explicit-any
async function handleDelete(admin: any, caller: Profile, body: Record<string, unknown>) {
  const profileId = Number(body.profile_id);
  if (!profileId) return json({ success: false, error: "Usuário não informado." }, 400);

  const target = await loadTarget(admin, profileId);
  if (!target) return json({ success: false, error: "Usuário não encontrado." }, 404);

  if (target.id === caller.id) {
    return json({ success: false, error: "Você não pode excluir a própria conta." }, 403);
  }

  if (caller.role === "manager" && target.role !== "user") {
    return json({ success: false, error: "Gestores só podem excluir usuários com papel Usuário." }, 403);
  }

  if (target.role === "admin") {
    const others = await countOtherActiveAdmins(admin, target.id);
    if (others === 0) {
      return json({ success: false, error: "Não é possível excluir o último administrador." }, 403);
    }
  }

  const { error } = await admin.auth.admin.deleteUser(target.auth_user_id);
  if (error) {
    console.error("admin-users: delete failed", error);
    return json({ success: false, error: "Não foi possível excluir o usuário." }, 500);
  }

  return json({ success: true });
}

// deno-lint-ignore no-explicit-any
async function handleResetPassword(admin: any, caller: Profile, body: Record<string, unknown>) {
  const profileId = Number(body.profile_id);
  if (!profileId) return json({ success: false, error: "Usuário não informado." }, 400);

  const target = await loadTarget(admin, profileId);
  if (!target) return json({ success: false, error: "Usuário não encontrado." }, 404);

  if (caller.role === "manager" && target.role !== "user") {
    return json({ success: false, error: "Gestores só podem redefinir a senha de usuários com papel Usuário." }, 403);
  }

  const { error } = await admin.auth.resetPasswordForEmail(target.email);
  if (error) {
    console.error("admin-users: reset_password failed", error);
    return json({ success: false, error: "Não foi possível iniciar a redefinição de senha." }, 500);
  }

  return json({ success: true });
}
