// types/categories.ts

export const PUBLIC_DOCUMENT_CATEGORIES = [
  "NDCs",
  "NAPs",
  "LTS",
  "ESG",
  "SDGs",
  "IPCC",
  "IPBES",
  "EIAs",
  "GHG",
  "Biodiversity",
  "ParisAgreement",
  "GreenTaxonomies",
  "Executive",
  "Legislative",
  "Reports",
  "UNFCCC",
] as const

export type PublicDocumentCategory = typeof PUBLIC_DOCUMENT_CATEGORIES[number]

// Mapeo de nombres para mostrar
export const CATEGORY_LABELS: Record<PublicDocumentCategory, string> = {
  NDCs: "Nationally Determined Contributions",
  NAPs: "National Adaptation Plans",
  LTS: "Long-Term Strategies",
  ESG: "Environmental, Social & Governance",
  SDGs: "Sustainable Development Goals",
  IPCC: "IPCC Reports",
  IPBES: "IPBES Assessments",
  EIAs: "Environmental Impact Assessments",
  GHG: "Greenhouse Gases",
  Biodiversity: "Biodiversity",
  ParisAgreement: "Paris Agreement",
  GreenTaxonomies: "Green Taxonomies",
  Executive: "Executive Documents",
  Legislative: "Legislation",
  Reports: "General Reports",
  UNFCCC: "UNFCCC Framework",
}

  