// 1. Categorie come costante immutabile
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

// 2. Deriviamo il tipo direttamente dall'array sopra
export type Category = (typeof CATEGORIES)[number];

// 3. Union Types: un valore può essere SOLO una di queste stringhe esatte
export type TransactionType = "entrata" | "uscita";

export type FilterType = "tutti" | TransactionType;

export type SortOption =
  | "importoCrescente"
  | "importoDecrescente"
  | "dataRecente"
  | "dataMenoRecente";

// 4. La "forma" esatta di un movimento salvato
export interface Transaction {
  id: string;
  descrizione: string;
  importo: number;
  tipo: TransactionType;
  categoria: Category;
  data: string; // formato YYYY-MM-DD
}

// 5. La "forma" dei dati dentro il form (prima del salvataggio)
export interface TransactionFormData {
  descrizione: string;
  importo: string; // negli <input> il valore è sempre una stringa
  tipo: TransactionType;
  categoria: Category | ""; // stringa vuota quando l'utente non ha ancora scelto
  data: string;
}
