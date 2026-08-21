export type AtaSituacao = 'vigente' | 'proxima_vencimento' | 'vencida'

export interface Ata {
  id: string
  slug: string
  descricao: string
  marcaId: string
  categoriaId: string
  tipoId: string
  orgaoId: string
  partnerId: string
  numeroAta: string
  numeroProcesso: string
  imagemUrl: string
  dataVigenciaInicio: string
  dataVigenciaFim: string
  quantidade: number
  unidadeMedida: string
  valorUnitario: number
  createdAt: string
  updatedAt: string
}

export interface AtaWithRelations extends Ata {
  marcaNome: string
  categoriaNome: string
  tipoNome: string
  orgaoNome: string
  orgaoLogoUrl: string
  partnerNome: string
  situacao: AtaSituacao
}

/** Result of get_ata_details(slug): an ata plus partner contact info, server-gated by RLS/is_active_user(). */
export interface AtaDetail extends AtaWithRelations {
  documentoUrl?: string
  partnerVisible: boolean
  partnerLogoUrl: string
  partnerCidade: string
  partnerEstado: string
  partnerContato: string
  partnerTelefone: string
  partnerWhatsapp: string
  partnerEmail: string
  partnerWebsite?: string
}
