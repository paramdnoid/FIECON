export const COMPANY = {
  name: "FIECON",
  fullName: "FIECON Germany Co. KG",
  subtitle: "for International Consulting Industries",
  legalName: "Fiegler Consulting KG",
  website: "www.fiecon-consulting.eu",
} as const;

export const CONTACT = {
  address: {
    street: "Borsteler Chaussee 179",
    zip: "22453",
    city: "Hamburg",
    country: "Deutschland",
  },
  phone: "+49 (0) 40 636 44 422",
  mobile: "+49 (0) 163 - 988 91 25",
  email: "fiegler-fiecon-consulting@e.mail.de",
} as const;

export const OFFICES = [
  {
    id: "hamburg",
    isHQ: true,
  },
  {
    id: "belgrade",
    isHQ: false,
  },
  {
    id: "texas",
    isHQ: false,
  },
] as const;

export const SERVICES = [
  { id: "consulting" },
  { id: "finance" },
  { id: "construction" },
  { id: "yacht" },
] as const;

export const NAV_LINKS = [
  { id: "about", href: "#about" },
  { id: "services", href: "#services" },
  { id: "approach", href: "#approach" },
  { id: "offices", href: "#offices" },
  { id: "contact", href: "#contact" },
] as const;
