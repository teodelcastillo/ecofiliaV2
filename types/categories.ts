// types/categories.ts

export const PUBLIC_DOCUMENT_CATEGORIES = [
    "NDCs",
    "NAPs",
    "LTS",
    "ESG",
    "IPCC",
    "IPBES",
    "EIAs",
    "Executive",
    "Legislative",
    "Reports",
    "UNFCCC",
    "SDGs",
  ] as const
  
  export type PublicDocumentCategory = typeof PUBLIC_DOCUMENT_CATEGORIES[number]
  