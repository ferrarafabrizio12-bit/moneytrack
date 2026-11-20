import { CATEGORIES } from "../types/transaction";
import type { Transaction } from "../types/transaction";

export const isValidTransaction = (item: unknown): item is Transaction => {
  // 1. Prima controllo che sia un oggetto vero (e non null)
  if (typeof item !== "object" || item === null) return false;

  // 2. Dico a TS: "trattalo come un oggetto generico con chiavi stringa e valori sconosciuti", così posso leggere p.id, p.nome, ecc. senza errori di compilazione
  const t = item as Record<string, unknown>;

  // 3. Controllo i singoli campi
  return (
    typeof t.id === "string" &&
    t.id.trim() !== "" &&
    typeof t.descrizione === "string" &&
    t.descrizione.trim() !== "" &&
    typeof t.importo === "number" &&
    Number.isFinite(t.importo) &&
    t.importo > 0 &&
    ["entrata", "uscita"].includes(t.tipo as string) &&
    typeof t.categoria === "string" &&
    CATEGORIES.includes(t.categoria as any) &&
    typeof t.data === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(t.data) &&
    Number.isFinite(Date.parse(t.data))
  );
};

export const STORAGE_KEY = "moneytrack_movimenti";

export interface LoadTransactionsResult {
  list: Transaction[];
  hasError: boolean;
}

export const loadTransactions = (): LoadTransactionsResult => {
  try {
    const datiSalvati = localStorage.getItem(STORAGE_KEY);
    const lista = datiSalvati === null ? [] : JSON.parse(datiSalvati);
    if (!Array.isArray(lista) || !lista.every(isValidTransaction)) {
      throw new Error("Formato dei movimenti salvati non valido");
    }
    return { list: lista, hasError: false };
  } catch {
    return { list: [], hasError: true };
  }
};

export const saveTransactions = (transactions: Transaction[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return true;
  } catch {
    return false;
  }
};
