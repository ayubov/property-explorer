export type FundaListObject = {
  Id?: string
  Adres?: string
  Woonplaats?: string
  Koopprijs?: number | null
  FotoLarge?: string | null
  FotoMedium?: string | null
  AantalKamers?: number | null
  Woonoppervlakte?: number | null
  AangebodenSindsTekst?: string | null
}

export type FundaPaging = {
  AantalPaginas?: number
  HuidigePagina?: number
}

export type FundaListResponse = {
  Objects?: FundaListObject[]
  Paging?: FundaPaging | null
}

export enum FundaImageSize {
  Large = 7,
  Medium = 6,
  Small = 4
}

export enum FundaMediaCategory {
  Photo = 1,
  FloorPlan = 2
}

export enum FundaContentType {
  Image = 1
}

export type FundaMediaItem = {
  Category?: FundaImageSize
  Url?: string
}

export type FundaMedia = {
  Categorie?: FundaMediaCategory
  ContentType?: FundaContentType
  MediaItems?: FundaMediaItem[]
}

export type FundaEnergyLabel = {
  Label?: string | null
}

export type FundaDetail = {
  InternalId?: string
  Adres?: string
  Plaats?: string
  Koopprijs?: number | null
  HoofdFoto?: string | null
  AantalKamers?: number | null
  WoonOppervlakte?: number | null
  AangebodenSindsTekst?: string | null
  VolledigeOmschrijving?: string | null
  PerceelOppervlakte?: number | null
  Energielabel?: FundaEnergyLabel | null
  Makelaar?: string | null
  Media?: FundaMedia[]
  WGS84_X?: number | null
  WGS84_Y?: number | null
}
