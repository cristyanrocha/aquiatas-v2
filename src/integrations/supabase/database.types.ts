// Auto-generated from the live Supabase schema.
// Regenerate with: supabase gen types typescript --project-id <project-id>
// Do not hand-edit -- adapt src/services/* instead.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          acronym: string | null
          cep: string | null
          city: string | null
          cnpj: string | null
          complement: string | null
          created_at: string
          created_by: number | null
          district: string | null
          email: string | null
          government_sphere: string | null
          id: number
          logo_path: string | null
          name: string
          number: string | null
          phone: string | null
          publication_status: Database["public"]["Enums"]["publication_status"]
          state: string | null
          status: Database["public"]["Enums"]["agency_status"]
          street: string | null
          updated_at: string
          updated_by: number | null
          website: string | null
        }
        Insert: {
          acronym?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          complement?: string | null
          created_at?: string
          created_by?: number | null
          district?: string | null
          email?: string | null
          government_sphere?: string | null
          id?: never
          logo_path?: string | null
          name: string
          number?: string | null
          phone?: string | null
          publication_status?: Database["public"]["Enums"]["publication_status"]
          state?: string | null
          status?: Database["public"]["Enums"]["agency_status"]
          street?: string | null
          updated_at?: string
          updated_by?: number | null
          website?: string | null
        }
        Update: {
          acronym?: string | null
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          complement?: string | null
          created_at?: string
          created_by?: number | null
          district?: string | null
          email?: string | null
          government_sphere?: string | null
          id?: never
          logo_path?: string | null
          name?: string
          number?: string | null
          phone?: string | null
          publication_status?: Database["public"]["Enums"]["publication_status"]
          state?: string | null
          status?: Database["public"]["Enums"]["agency_status"]
          street?: string | null
          updated_at?: string
          updated_by?: number | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agencies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agencies_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ata_images: {
        Row: {
          alt_text: string | null
          ata_id: number
          created_at: string
          display_order: number
          id: number
          is_cover: boolean
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          ata_id: number
          created_at?: string
          display_order?: number
          id?: never
          is_cover?: boolean
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          ata_id?: number
          created_at?: string
          display_order?: number
          id?: never
          is_cover?: boolean
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "ata_images_ata_id_fkey"
            columns: ["ata_id"]
            isOneToOne: false
            referencedRelation: "atas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ata_images_ata_id_fkey"
            columns: ["ata_id"]
            isOneToOne: false
            referencedRelation: "authenticated_atas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ata_images_ata_id_fkey"
            columns: ["ata_id"]
            isOneToOne: false
            referencedRelation: "public_atas"
            referencedColumns: ["id"]
          },
        ]
      }
      ata_types: {
        Row: {
          created_at: string
          created_by: number | null
          description: string | null
          id: number
          is_active: boolean
          name: string
          slug: string
          updated_at: string
          updated_by: number | null
        }
        Insert: {
          created_at?: string
          created_by?: number | null
          description?: string | null
          id?: never
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
          updated_by?: number | null
        }
        Update: {
          created_at?: string
          created_by?: number | null
          description?: string | null
          id?: never
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
          updated_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ata_types_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ata_types_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      atas: {
        Row: {
          agency_id: number
          ata_type_id: number
          available_quantity: number | null
          bidding_number: string | null
          brand_id: number | null
          category_id: number
          created_at: string
          created_by: number | null
          description: string
          document_path: string | null
          expiration_date: string
          id: number
          image_path: string | null
          is_featured: boolean
          partner_id: number
          process_number: string | null
          publication_status: Database["public"]["Enums"]["publication_status"]
          reference_number: string | null
          registered_quantity: number | null
          slug: string
          start_date: string
          title: string
          total_registered_value: number | null
          unit: string | null
          unit_price: number
          updated_at: string
          updated_by: number | null
          views_count: number
        }
        Insert: {
          agency_id: number
          ata_type_id: number
          available_quantity?: number | null
          bidding_number?: string | null
          brand_id?: number | null
          category_id: number
          created_at?: string
          created_by?: number | null
          description: string
          document_path?: string | null
          expiration_date: string
          id?: never
          image_path?: string | null
          is_featured?: boolean
          partner_id: number
          process_number?: string | null
          publication_status?: Database["public"]["Enums"]["publication_status"]
          reference_number?: string | null
          registered_quantity?: number | null
          slug: string
          start_date: string
          title: string
          total_registered_value?: number | null
          unit?: string | null
          unit_price: number
          updated_at?: string
          updated_by?: number | null
          views_count?: number
        }
        Update: {
          agency_id?: number
          ata_type_id?: number
          available_quantity?: number | null
          bidding_number?: string | null
          brand_id?: number | null
          category_id?: number
          created_at?: string
          created_by?: number | null
          description?: string
          document_path?: string | null
          expiration_date?: string
          id?: never
          image_path?: string | null
          is_featured?: boolean
          partner_id?: number
          process_number?: string | null
          publication_status?: Database["public"]["Enums"]["publication_status"]
          reference_number?: string | null
          registered_quantity?: number | null
          slug?: string
          start_date?: string
          title?: string
          total_registered_value?: number | null
          unit?: string | null
          unit_price?: number
          updated_at?: string
          updated_by?: number | null
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "atas_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "public_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_ata_type_id_fkey"
            columns: ["ata_type_id"]
            isOneToOne: false
            referencedRelation: "ata_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "authenticated_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "public_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_profile_id: number | null
          created_at: string
          entity_id: number | null
          entity_type: string
          id: number
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_profile_id?: number | null
          created_at?: string
          entity_id?: number | null
          entity_type: string
          id?: never
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_profile_id?: number | null
          created_at?: string
          entity_id?: number | null
          entity_type?: string
          id?: never
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          created_by: number | null
          id: number
          is_active: boolean
          logo_path: string | null
          name: string
          slug: string
          updated_at: string
          updated_by: number | null
        }
        Insert: {
          created_at?: string
          created_by?: number | null
          id?: never
          is_active?: boolean
          logo_path?: string | null
          name: string
          slug: string
          updated_at?: string
          updated_by?: number | null
        }
        Update: {
          created_at?: string
          created_by?: number | null
          id?: never
          is_active?: boolean
          logo_path?: string | null
          name?: string
          slug?: string
          updated_at?: string
          updated_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brands_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          created_by: number | null
          description: string | null
          display_order: number
          icon: string | null
          id: number
          is_active: boolean
          is_featured: boolean
          name: string
          slug: string
          updated_at: string
          updated_by: number | null
        }
        Insert: {
          created_at?: string
          created_by?: number | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: never
          is_active?: boolean
          is_featured?: boolean
          name: string
          slug: string
          updated_at?: string
          updated_by?: number | null
        }
        Update: {
          created_at?: string
          created_by?: number | null
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: never
          is_active?: boolean
          is_featured?: boolean
          name?: string
          slug?: string
          updated_at?: string
          updated_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          answered_at: string | null
          answered_by: number | null
          created_at: string
          email: string
          id: number
          message: string
          name: string
          phone: string | null
          status: string
          subject: string
          updated_at: string
          user_id: number | null
        }
        Insert: {
          answered_at?: string | null
          answered_by?: number | null
          created_at?: string
          email: string
          id?: never
          message: string
          name: string
          phone?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id?: number | null
        }
        Update: {
          answered_at?: string | null
          answered_by?: number | null
          created_at?: string
          email?: string
          id?: never
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_answered_by_fkey"
            columns: ["answered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          consent_at: string
          created_at: string
          email: string
          id: number
          name: string | null
          source: string | null
          status: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          consent_at?: string
          created_at?: string
          email: string
          id?: never
          name?: string | null
          source?: string | null
          status?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          consent_at?: string
          created_at?: string
          email?: string
          id?: never
          name?: string | null
          source?: string | null
          status?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          cep: string | null
          city: string | null
          cnpj: string
          complement: string | null
          contact_name: string | null
          created_at: string
          created_by: number | null
          description: string | null
          district: string | null
          email: string | null
          id: number
          legal_name: string
          logo_path: string | null
          number: string | null
          phone: string | null
          publication_status: Database["public"]["Enums"]["publication_status"]
          state: string | null
          state_registration: string | null
          status: Database["public"]["Enums"]["partner_status"]
          street: string | null
          trade_name: string
          updated_at: string
          updated_by: number | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          cep?: string | null
          city?: string | null
          cnpj: string
          complement?: string | null
          contact_name?: string | null
          created_at?: string
          created_by?: number | null
          description?: string | null
          district?: string | null
          email?: string | null
          id?: never
          legal_name: string
          logo_path?: string | null
          number?: string | null
          phone?: string | null
          publication_status?: Database["public"]["Enums"]["publication_status"]
          state?: string | null
          state_registration?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          street?: string | null
          trade_name: string
          updated_at?: string
          updated_by?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          cep?: string | null
          city?: string | null
          cnpj?: string
          complement?: string | null
          contact_name?: string | null
          created_at?: string
          created_by?: number | null
          description?: string | null
          district?: string | null
          email?: string | null
          id?: never
          legal_name?: string
          logo_path?: string | null
          number?: string | null
          phone?: string | null
          publication_status?: Database["public"]["Enums"]["publication_status"]
          state?: string | null
          state_registration?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          street?: string | null
          trade_name?: string
          updated_at?: string
          updated_by?: number | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          billing_type: string
          created_at: string
          description: string | null
          display_order: number
          id: number
          is_active: boolean
          is_featured: boolean
          item_limit: number | null
          name: string
          price: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          billing_type: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: never
          is_active?: boolean
          is_featured?: boolean
          item_limit?: number | null
          name: string
          price?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          billing_type?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: never
          is_active?: boolean
          is_featured?: boolean
          item_limit?: number | null
          name?: string
          price?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auth_user_id: string
          avatar_path: string | null
          created_at: string
          email: string
          email_verified: boolean
          id: number
          last_sign_in_at: string | null
          name: string
          phone: string | null
          public_agency_name: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          avatar_path?: string | null
          created_at?: string
          email: string
          email_verified?: boolean
          id?: never
          last_sign_in_at?: string | null
          name: string
          phone?: string | null
          public_agency_name: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          avatar_path?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean
          id?: never
          last_sign_in_at?: string | null
          name?: string
          phone?: string | null
          public_agency_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          ends_at: string | null
          external_reference: string | null
          id: number
          item_limit: number | null
          partner_id: number
          plan_id: number
          starts_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          external_reference?: string | null
          id?: never
          item_limit?: number | null
          partner_id: number
          plan_id: number
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          external_reference?: string | null
          id?: never
          item_limit?: number | null
          partner_id?: number
          plan_id?: number
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "authenticated_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "public_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      authenticated_atas: {
        Row: {
          agency_id: number | null
          agency_logo_path: string | null
          agency_name: string | null
          ata_type_id: number | null
          ata_type_name: string | null
          available_quantity: number | null
          bidding_number: string | null
          brand_id: number | null
          brand_name: string | null
          category_id: number | null
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          description: string | null
          document_path: string | null
          expiration_date: string | null
          id: number | null
          image_path: string | null
          is_featured: boolean | null
          partner_city: string | null
          partner_cnpj: string | null
          partner_contact_name: string | null
          partner_email: string | null
          partner_id: number | null
          partner_legal_name: string | null
          partner_logo_path: string | null
          partner_phone: string | null
          partner_state: string | null
          partner_trade_name: string | null
          partner_website: string | null
          partner_whatsapp: string | null
          process_number: string | null
          reference_number: string | null
          registered_quantity: number | null
          situation: string | null
          slug: string | null
          start_date: string | null
          title: string | null
          total_registered_value: number | null
          unit: string | null
          unit_price: number | null
          updated_at: string | null
          views_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "atas_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "public_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_ata_type_id_fkey"
            columns: ["ata_type_id"]
            isOneToOne: false
            referencedRelation: "ata_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "authenticated_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "public_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      authenticated_partners: {
        Row: {
          cep: string | null
          city: string | null
          cnpj: string | null
          complement: string | null
          contact_name: string | null
          created_at: string | null
          description: string | null
          district: string | null
          email: string | null
          id: number | null
          legal_name: string | null
          logo_path: string | null
          number: string | null
          phone: string | null
          publication_status:
            | Database["public"]["Enums"]["publication_status"]
            | null
          state: string | null
          state_registration: string | null
          status: Database["public"]["Enums"]["partner_status"] | null
          street: string | null
          trade_name: string | null
          updated_at: string | null
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          complement?: string | null
          contact_name?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          email?: string | null
          id?: number | null
          legal_name?: string | null
          logo_path?: string | null
          number?: string | null
          phone?: string | null
          publication_status?:
            | Database["public"]["Enums"]["publication_status"]
            | null
          state?: string | null
          state_registration?: string | null
          status?: Database["public"]["Enums"]["partner_status"] | null
          street?: string | null
          trade_name?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          complement?: string | null
          contact_name?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          email?: string | null
          id?: number | null
          legal_name?: string | null
          logo_path?: string | null
          number?: string | null
          phone?: string | null
          publication_status?:
            | Database["public"]["Enums"]["publication_status"]
            | null
          state?: string | null
          state_registration?: string | null
          status?: Database["public"]["Enums"]["partner_status"] | null
          street?: string | null
          trade_name?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      public_agencies: {
        Row: {
          acronym: string | null
          city: string | null
          government_sphere: string | null
          id: number | null
          logo_path: string | null
          name: string | null
          state: string | null
        }
        Insert: {
          acronym?: string | null
          city?: string | null
          government_sphere?: string | null
          id?: number | null
          logo_path?: string | null
          name?: string | null
          state?: string | null
        }
        Update: {
          acronym?: string | null
          city?: string | null
          government_sphere?: string | null
          id?: number | null
          logo_path?: string | null
          name?: string | null
          state?: string | null
        }
        Relationships: []
      }
      public_atas: {
        Row: {
          agency_id: number | null
          agency_logo_path: string | null
          agency_name: string | null
          ata_type_id: number | null
          ata_type_name: string | null
          available_quantity: number | null
          bidding_number: string | null
          brand_id: number | null
          brand_name: string | null
          category_id: number | null
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          description: string | null
          expiration_date: string | null
          id: number | null
          image_path: string | null
          is_featured: boolean | null
          partner_city: string | null
          partner_id: number | null
          partner_logo_path: string | null
          partner_state: string | null
          partner_trade_name: string | null
          process_number: string | null
          reference_number: string | null
          registered_quantity: number | null
          situation: string | null
          slug: string | null
          start_date: string | null
          title: string | null
          total_registered_value: number | null
          unit: string | null
          unit_price: number | null
          updated_at: string | null
          views_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "atas_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "public_agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_ata_type_id_fkey"
            columns: ["ata_type_id"]
            isOneToOne: false
            referencedRelation: "ata_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "authenticated_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atas_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "public_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      public_partners: {
        Row: {
          city: string | null
          description: string | null
          id: number | null
          logo_path: string | null
          state: string | null
          trade_name: string | null
        }
        Insert: {
          city?: string | null
          description?: string | null
          id?: number | null
          logo_path?: string | null
          state?: string | null
          trade_name?: string | null
        }
        Update: {
          city?: string | null
          description?: string | null
          id?: number | null
          logo_path?: string | null
          state?: string | null
          trade_name?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_ata_situation: {
        Args: { p_expiration_date: string; p_expiring_soon_days?: number }
        Returns: string
      }
      current_profile_id: { Args: never; Returns: number }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      current_user_status: {
        Args: never
        Returns: Database["public"]["Enums"]["user_status"]
      }
      get_ata_details: {
        Args: { p_slug: string }
        Returns: {
          agency_id: number
          agency_logo_path: string
          agency_name: string
          ata_type_id: number
          ata_type_name: string
          available_quantity: number
          bidding_number: string
          brand_id: number
          brand_name: string
          category_id: number
          category_name: string
          category_slug: string
          created_at: string
          description: string
          document_path: string
          expiration_date: string
          id: number
          image_path: string
          is_featured: boolean
          partner_city: string
          partner_cnpj: string
          partner_contact_name: string
          partner_details_visible: boolean
          partner_email: string
          partner_id: number
          partner_legal_name: string
          partner_logo_path: string
          partner_phone: string
          partner_state: string
          partner_trade_name: string
          partner_website: string
          partner_whatsapp: string
          process_number: string
          reference_number: string
          registered_quantity: number
          situation: string
          slug: string
          start_date: string
          title: string
          total_registered_value: number
          unit: string
          unit_price: number
          updated_at: string
          views_count: number
        }[]
      }
      get_dashboard_summary: { Args: never; Returns: Json }
      increment_ata_view: { Args: { p_ata_id: number }; Returns: undefined }
      is_active_user: { Args: never; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_manager_or_admin: { Args: never; Returns: boolean }
      only_digits: { Args: { input: string }; Returns: string }
      search_public_atas: {
        Args: {
          p_ata_type_ids?: number[]
          p_brand_ids?: number[]
          p_category_ids?: number[]
          p_page?: number
          p_page_size?: number
          p_search?: string
          p_situation?: string
          p_sort?: string
        }
        Returns: {
          agency_id: number
          agency_name: string
          ata_type_id: number
          ata_type_name: string
          available_quantity: number
          brand_id: number
          brand_name: string
          category_id: number
          category_name: string
          description: string
          expiration_date: string
          id: number
          image_path: string
          partner_city: string
          partner_id: number
          partner_logo_path: string
          partner_state: string
          partner_trade_name: string
          registered_quantity: number
          situation: string
          slug: string
          start_date: string
          title: string
          total_count: number
          unit: string
          unit_price: number
        }[]
      }
      slugify: { Args: { input: string }; Returns: string }
      subscribe_newsletter: {
        Args: { p_email: string; p_name?: string; p_source?: string }
        Returns: undefined
      }
      unsubscribe_newsletter: { Args: { p_email: string }; Returns: undefined }
      write_audit_log: {
        Args: {
          p_action: string
          p_entity_id: number
          p_entity_type: string
          p_new_data: Json
          p_old_data: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      agency_status: "active" | "inactive"
      partner_status: "active" | "inactive"
      publication_status: "draft" | "published" | "archived"
      user_role: "user" | "manager" | "admin"
      user_status: "active" | "inactive" | "blocked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agency_status: ["active", "inactive"],
      partner_status: ["active", "inactive"],
      publication_status: ["draft", "published", "archived"],
      user_role: ["user", "manager", "admin"],
      user_status: ["active", "inactive", "blocked"],
    },
  },
} as const
