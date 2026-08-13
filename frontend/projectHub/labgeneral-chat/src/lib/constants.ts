export const APP_NAME = "LabGeneral AI";
export const APP_SUBTITLE = "Asystent";

export const APP_DESCRIPTION =
  "Wybierz rozmowę z historii lub rozpocznij nową, aby zapytać o produkty, wysyłkę lub ceny na labgeneral.pl.";

export const EXAMPLE_QUESTIONS: string[] = [
  "Jaki sprzęt laboratoryjny oferujecie?",
  "Jakie metody płatności są dostępne?",
  "Czy wysyłacie za granicę?",
  "Jak złożyć zamówienie hurtowe?",
  "Jakie marki mikroskopów są dostępne?",
  "Czy mogę otrzymać wycenę odczynników?",
];

export type CatalogIcon = "flask" | "microscope" | "package" | "book";

export interface CatalogCategory {
  id: string;
  label: string;
  count: string;
  icon: CatalogIcon;
  /** Pytanie wysyłane po kliknięciu kategorii/chipa. */
  question: string;
}

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: "reagents",
    label: "Odczynniki i chemikalia",
    count: "1 240+",
    icon: "flask",
    question: "Jakie odczynniki i chemikalia oferujecie?",
  },
  {
    id: "optics",
    label: "Przyrządy optyczne",
    count: "380+",
    icon: "microscope",
    question: "Jakie przyrządy optyczne macie w ofercie?",
  },
  {
    id: "consumables",
    label: "Materiały eksploatacyjne",
    count: "2 100+",
    icon: "package",
    question: "Jakie materiały eksploatacyjne są dostępne?",
  },
  {
    id: "docs",
    label: "Protokoły i dokumentacja",
    count: "420+",
    icon: "book",
    question: "Jakie protokoły i dokumentację udostępniacie?",
  },
];

export const TOTAL_PRODUCTS_LABEL = "18 400+";
export const SITE_URL = "https://labgeneral.pl";
export const SITE_HOSTNAME = "labgeneral.pl";

export const CHAT_API_ENDPOINT = "/api/chat";

export const LOCAL_STORAGE_KEY = "labgeneral.conversations.v1";
export const THEME_STORAGE_KEY = "labgeneral.theme";
