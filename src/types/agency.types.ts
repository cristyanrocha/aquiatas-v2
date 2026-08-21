export interface Agency {
  id: string
  nome: string
  sigla: string
  logoUrl: string
  esfera: 'Distrital' | 'Empresa Estatal' | 'Estadual' | 'Federal' | 'Municipal' | 'Sistema S'
  estado: string
  cidade: string
  createdAt: string
  updatedAt: string
}
