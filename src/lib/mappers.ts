import { Package } from 'lucide-react'
import type { Database } from '@/integrations/supabase/database.types'
import type { Agency, Ata, AtaDetail, AtaSituacao, AtaType, AtaWithRelations, Brand, Category, Partner, User, UserRole } from '@/types'
import { placeholderAvatar, placeholderImage } from '@/constants/images'
import { CATEGORY_ICON_OPTIONS } from '@/constants/categoryIcons'
import { calcularSituacaoAta } from '@/utils/ataStatus'
import { supabase } from '@/integrations/supabase/client'

/** Converts a bigint id coming back from PostgREST (number) into the string id the frontend types expect everywhere. */
export function toId(id: number | string): string {
  return String(id)
}

/** Converts a frontend string id back into the bigint the database expects. Throws on anything non-numeric. */
export function toDbId(id: string): number {
  const parsed = Number(id)
  if (!Number.isFinite(parsed)) throw new Error(`Id inválido: "${id}".`)
  return parsed
}

export function publicAssetUrl(bucket: string, path: string | null | undefined): string | undefined {
  if (!path) return undefined
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

/** Reverses publicAssetUrl: given whatever a form's UploadPreview holds, returns the bare storage
 * path to persist, or null if it isn't a Supabase Storage URL for this bucket (e.g. an unset
 * placeholder) — the mapper already re-derives a placeholder locally when the path is null. */
export function extractStoragePath(bucket: string, value: string | null | undefined): string | null {
  if (!value) return null
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = value.indexOf(marker)
  return index === -1 ? null : value.slice(index + marker.length)
}

// ---------------------------------------------------------------------------
// User / role
// ---------------------------------------------------------------------------

type DbUserRole = Database['public']['Enums']['user_role']
type DbUserStatus = Database['public']['Enums']['user_status']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']

const DB_ROLE_TO_UI: Record<DbUserRole, UserRole> = {
  user: 'usuario',
  manager: 'gestor',
  admin: 'administrador',
}

const UI_ROLE_TO_DB: Record<'usuario' | 'gestor' | 'administrador', DbUserRole> = {
  usuario: 'user',
  gestor: 'manager',
  administrador: 'admin',
}

export function mapDbRoleToUi(role: DbUserRole): UserRole {
  return DB_ROLE_TO_UI[role]
}

export function mapUiRoleToDb(role: UserRole): DbUserRole {
  if (role === 'visitante') throw new Error('Papel "visitante" não é um papel de usuário válido no banco.')
  return UI_ROLE_TO_DB[role]
}

export function mapProfileToUser(row: ProfileRow): User {
  return {
    id: toId(row.id),
    authUserId: row.auth_user_id,
    nome: row.name,
    email: row.email,
    telefone: row.phone ?? undefined,
    orgaoPublico: row.public_agency_name,
    role: mapDbRoleToUi(row.role),
    status: row.status,
    avatarUrl: publicAssetUrl('avatars', row.avatar_path) ?? placeholderAvatar(row.name),
    ativo: row.status === 'active',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function statusLabel(status: DbUserStatus): string {
  switch (status) {
    case 'active':
      return 'Ativo'
    case 'blocked':
      return 'Bloqueado'
    case 'inactive':
    default:
      return 'Inativo'
  }
}

// ---------------------------------------------------------------------------
// Taxonomy: categories, ata types, brands
// ---------------------------------------------------------------------------

type CategoryRow = Database['public']['Tables']['categories']['Row']
type AtaTypeRow = Database['public']['Tables']['ata_types']['Row']
type BrandRow = Database['public']['Tables']['brands']['Row']

export function mapCategory(row: CategoryRow): Category {
  const option = row.icon ? CATEGORY_ICON_OPTIONS.find((item) => item.id === row.icon) : undefined
  return {
    id: toId(row.id),
    nome: row.name,
    slug: row.slug,
    icon: option?.icon ?? Package,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapAtaType(row: AtaTypeRow): AtaType {
  return {
    id: toId(row.id),
    nome: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapBrand(row: BrandRow): Brand {
  return {
    id: toId(row.id),
    nome: row.name,
  }
}

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------

interface PartnerRowLike {
  id: number | null
  trade_name: string | null
  legal_name?: string | null
  cnpj?: string | null
  contact_name?: string | null
  description?: string | null
  state?: string | null
  city?: string | null
  street?: string | null
  number?: string | null
  district?: string | null
  cep?: string | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  website?: string | null
  logo_path?: string | null
  created_at?: string | null
  updated_at?: string | null
}

function composeAddress(street?: string | null, number?: string | null, district?: string | null): string {
  const line = [street, number].filter(Boolean).join(', ')
  return [line, district].filter(Boolean).join(', ')
}

export function mapPartner(row: PartnerRowLike): Partner {
  const id = row.id ?? 0
  return {
    id: toId(id),
    nomeFantasia: row.trade_name ?? '',
    razaoSocial: row.legal_name ?? '',
    cnpj: row.cnpj ?? '',
    logoUrl: publicAssetUrl('partner-logos', row.logo_path) ?? placeholderImage(`parceiro-${id}`, 200, 200),
    contato: row.contact_name ?? '',
    descricao: row.description ?? '',
    estado: row.state ?? '',
    cidade: row.city ?? '',
    endereco: composeAddress(row.street, row.number, row.district),
    cep: row.cep ?? '',
    telefone: row.phone ?? '',
    whatsapp: row.whatsapp ?? '',
    email: row.email ?? '',
    website: row.website ?? undefined,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? row.created_at ?? '',
  }
}

// ---------------------------------------------------------------------------
// Agencies
// ---------------------------------------------------------------------------

interface AgencyRowLike {
  id: number | null
  name: string | null
  acronym?: string | null
  government_sphere?: string | null
  logo_path?: string | null
  state?: string | null
  city?: string | null
  created_at?: string | null
  updated_at?: string | null
}

const VALID_SPHERES: Agency['esfera'][] = ['Distrital', 'Empresa Estatal', 'Estadual', 'Federal', 'Municipal', 'Sistema S']

export function mapAgency(row: AgencyRowLike): Agency {
  const id = row.id ?? 0
  const esfera = VALID_SPHERES.find((sphere) => sphere === row.government_sphere) ?? 'Federal'
  return {
    id: toId(id),
    nome: row.name ?? '',
    sigla: row.acronym ?? '',
    logoUrl: publicAssetUrl('agency-logos', row.logo_path) ?? placeholderImage(`orgao-${id}`, 200, 200),
    esfera,
    estado: row.state ?? '',
    cidade: row.city ?? '',
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? row.created_at ?? '',
  }
}

// ---------------------------------------------------------------------------
// Atas
// ---------------------------------------------------------------------------

type AtaRow = Database['public']['Tables']['atas']['Row']

export function mapAta(row: AtaRow): Ata {
  return {
    id: toId(row.id),
    slug: row.slug,
    descricao: row.description,
    marcaId: row.brand_id !== null ? toId(row.brand_id) : '',
    categoriaId: toId(row.category_id),
    tipoId: toId(row.ata_type_id),
    orgaoId: toId(row.agency_id),
    partnerId: toId(row.partner_id),
    numeroAta: row.reference_number ?? '',
    numeroProcesso: row.process_number ?? '',
    imagemUrl: publicAssetUrl('ata-images', row.image_path) ?? placeholderImage(row.slug, 640, 480),
    dataVigenciaInicio: row.start_date,
    dataVigenciaFim: row.expiration_date,
    quantidade: row.registered_quantity !== null ? Number(row.registered_quantity) : 0,
    unidadeMedida: row.unit ?? 'unidade',
    valorUnitario: Number(row.unit_price),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** Row shape returned by `atas` selects embedding relation names for the admin panel (staff-only). */
export interface AdminAtaRow extends AtaRow {
  categories: { name: string } | null
  ata_types: { name: string } | null
  brands: { name: string } | null
  agencies: { name: string; logo_path: string | null } | null
  partners: { trade_name: string } | null
}

export const ADMIN_ATA_RELATIONS_SELECT =
  '*, categories(name), ata_types(name), brands(name), agencies(name, logo_path), partners(trade_name)'

export function mapAdminAtaWithRelations(row: AdminAtaRow): AtaWithRelations {
  return {
    ...mapAta(row),
    marcaNome: row.brands?.name ?? 'Não informado',
    categoriaNome: row.categories?.name ?? 'Não informado',
    tipoNome: row.ata_types?.name ?? 'Não informado',
    orgaoNome: row.agencies?.name ?? 'Não informado',
    orgaoLogoUrl: publicAssetUrl('agency-logos', row.agencies?.logo_path) ?? '',
    partnerNome: row.partners?.trade_name ?? 'Não informado',
    situacao: calcularSituacaoAta(row.expiration_date),
  }
}

function mapDbSituation(situation: string | null): AtaSituacao {
  switch (situation) {
    case 'expired':
      return 'vencida'
    case 'expiring':
      return 'proxima_vencimento'
    default:
      return 'vigente'
  }
}

/** Row shape shared by search_public_atas RPC results and public_atas view rows (the view's columns are all nullable). */
export interface SearchAtaRow {
  id: number | null
  slug: string | null
  title: string | null
  description: string | null
  category_name: string | null
  ata_type_name: string | null
  brand_name: string | null
  agency_name: string | null
  partner_id: number | null
  partner_trade_name: string | null
  partner_logo_path: string | null
  partner_city: string | null
  partner_state: string | null
  start_date: string | null
  expiration_date: string | null
  registered_quantity: number | null
  unit: string | null
  unit_price: number | null
  image_path: string | null
  situation: string | null
}

export function mapSearchAtaRow(row: SearchAtaRow): AtaWithRelations {
  const slug = row.slug ?? ''
  return {
    id: toId(row.id ?? 0),
    slug,
    descricao: row.title || row.description || '',
    marcaId: '',
    categoriaId: '',
    tipoId: '',
    orgaoId: '',
    partnerId: toId(row.partner_id ?? 0),
    numeroAta: '',
    numeroProcesso: '',
    imagemUrl: publicAssetUrl('ata-images', row.image_path) ?? placeholderImage(slug, 640, 480),
    dataVigenciaInicio: row.start_date ?? '',
    dataVigenciaFim: row.expiration_date ?? '',
    quantidade: row.registered_quantity !== null ? Number(row.registered_quantity) : 0,
    unidadeMedida: row.unit ?? 'unidade',
    valorUnitario: Number(row.unit_price ?? 0),
    createdAt: '',
    updatedAt: '',
    marcaNome: row.brand_name ?? 'Não informado',
    categoriaNome: row.category_name ?? 'Não informado',
    tipoNome: row.ata_type_name ?? 'Não informado',
    orgaoNome: row.agency_name ?? 'Não informado',
    orgaoLogoUrl: '',
    partnerNome: row.partner_trade_name ?? 'Não informado',
    situacao: mapDbSituation(row.situation),
  }
}

/** Row shape returned by the get_ata_details(slug) RPC. */
export interface AtaDetailRow {
  id: number
  slug: string
  title: string
  description: string
  reference_number: string | null
  process_number: string | null
  category_id: number
  category_name: string | null
  ata_type_id: number
  ata_type_name: string | null
  brand_id: number | null
  brand_name: string | null
  agency_id: number
  agency_name: string | null
  agency_logo_path: string | null
  partner_id: number
  partner_trade_name: string | null
  partner_contact_name: string | null
  partner_email: string | null
  partner_phone: string | null
  partner_whatsapp: string | null
  partner_website: string | null
  partner_logo_path: string | null
  partner_city: string | null
  partner_state: string | null
  start_date: string
  expiration_date: string
  registered_quantity: number | null
  unit: string | null
  unit_price: number
  image_path: string | null
  document_path: string | null
  created_at: string
  updated_at: string
  situation: string | null
  partner_details_visible: boolean
}

export function mapAtaDetail(row: AtaDetailRow): AtaDetail {
  return {
    id: toId(row.id),
    slug: row.slug,
    descricao: row.title || row.description,
    marcaId: row.brand_id !== null ? toId(row.brand_id) : '',
    categoriaId: toId(row.category_id),
    tipoId: toId(row.ata_type_id),
    orgaoId: toId(row.agency_id),
    partnerId: toId(row.partner_id),
    numeroAta: row.reference_number ?? '',
    numeroProcesso: row.process_number ?? '',
    imagemUrl: publicAssetUrl('ata-images', row.image_path) ?? placeholderImage(row.slug, 640, 480),
    dataVigenciaInicio: row.start_date,
    dataVigenciaFim: row.expiration_date,
    quantidade: row.registered_quantity !== null ? Number(row.registered_quantity) : 0,
    unidadeMedida: row.unit ?? 'unidade',
    valorUnitario: Number(row.unit_price),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    marcaNome: row.brand_name ?? 'Não informado',
    categoriaNome: row.category_name ?? 'Não informado',
    tipoNome: row.ata_type_name ?? 'Não informado',
    orgaoNome: row.agency_name ?? 'Não informado',
    orgaoLogoUrl: publicAssetUrl('agency-logos', row.agency_logo_path) ?? '',
    partnerNome: row.partner_trade_name ?? 'Não informado',
    situacao: mapDbSituation(row.situation),
    documentoUrl: publicAssetUrl('ata-documents', row.document_path),
    partnerVisible: row.partner_details_visible,
    partnerLogoUrl: publicAssetUrl('partner-logos', row.partner_logo_path) ?? placeholderImage(`parceiro-${row.partner_id}`, 200, 200),
    partnerCidade: row.partner_city ?? '',
    partnerEstado: row.partner_state ?? '',
    partnerContato: row.partner_contact_name ?? '',
    partnerTelefone: row.partner_phone ?? '',
    partnerWhatsapp: row.partner_whatsapp ?? '',
    partnerEmail: row.partner_email ?? '',
    partnerWebsite: row.partner_website ?? undefined,
  }
}
