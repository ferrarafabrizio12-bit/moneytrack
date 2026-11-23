export const CATEGORIES = [
  "Alimentari",
  "Casa",
  "Trasporti",
  "Salute",
  "Sport",
  "Intrattenimento",
  "Shopping",
  "Lavoro",
  "Istruzione",
  "Altro",
] as const;

export type TransactionType = "entrata" | "uscita";
export type Category = (typeof CATEGORIES)[number];

export interface Transaction {
  id: string;
  descrizione: string;
  importo: number;
  tipo: TransactionType;
  categoria: Category;
  data: string; // formato YYYY-MM-DD
}
