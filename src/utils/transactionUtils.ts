import { CATEGORIES } from "../types/transaction";
import type {
  Category,
  Transaction,
  TransactionType,
  FilterType,
  SortOption,
} from "../types/transaction";

// Creiamo il formattatore una sola volta fuori dalla funzione
const euroFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

// Funzione vera -> si usa "export const", NON "export type"
export const formatEuro = (amount: number): string => {
  return euroFormatter.format(amount);
};

// Definiamo la "forma" di ogni singolo elemento dell'array che restituiremo
export interface CategoryTotal {
  categoria: Category;
  totale: number;
}

// Entra: un TransactionType(tipo movimento) e un array di Transaction(lista movimenti)
// Esce: un array di CategoryTotal
export const calculateCategoryTotals = (
  type: TransactionType,
  transaction: Transaction[],
): CategoryTotal[] => {
  const filteredByType = transaction.filter((t) => t.tipo === type);

  return CATEGORIES.map((cat) => {
    const total = filteredByType
      .filter((t) => t.categoria === cat)
      .reduce((sum, t) => sum + t.importo, 0);
    return { categoria: cat, totale: total };
  });
};

export const calculateTotalByType = (
  type: TransactionType,
  transactions: Transaction[],
): number => {
  //creo un array di elementi filtrati per tipo
  const filteredByType = transactions.filter((t) => t.tipo === type);

  //creo il totale sommando i valori dei prodotti filtrati
  const total = filteredByType.reduce((sum, t) => sum + t.importo, 0);

  //ritorno il totale
  return total;
};

export const filterAndSortTransactions = (
  transactions: Transaction[],
  filterType: FilterType,
  filterCategory: Category | "tutte",
  sortBy: SortOption,
): Transaction[] => {
  //filtro gli elementi per tipo e categoria
  const filteredTransactions = transactions
    .filter((t) => filterType === "tutti" || t.tipo === filterType)
    .filter(
      (t) => filterCategory === "tutte" || t.categoria === filterCategory,
    );

  //ritorno nuovo array ordinato in base a SortBy
  return filteredTransactions.sort((a, b) => {
    if (sortBy === "importoCrescente") return a.importo - b.importo;
    if (sortBy === "importoDecrescente") return b.importo - a.importo;
    if (sortBy === "dataRecente") return b.data.localeCompare(a.data);
    if (sortBy === "dataMenoRecente") return a.data.localeCompare(b.data);
    return 0;
  });
};
