// types.ts

export interface FormData {
  general: {
    name: string
    country: string
    sector: string
    size: string
    hasPlan: "yes" | "no"
  }
  footprint: {
    electricity: string
    fuel: string
    employees: string
    travel: string
  }
  priorities: {
    emissions: boolean
    circularity: boolean
    adaptation: boolean
    compliance: boolean
    esg: boolean
  }
}

export const initialFormData: FormData = {
  general: {
    name: "",
    country: "",
    sector: "",
    size: "",
    hasPlan: "no",
  },
  footprint: {
    electricity: "",
    fuel: "",
    employees: "",
    travel: "",
  },
  priorities: {
    emissions: false,
    circularity: false,
    adaptation: false,
    compliance: false,
    esg: false,
  },
}