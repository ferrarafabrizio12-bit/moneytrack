import { useEffect, useState } from "react";
import { loadTransactions, saveTransactions } from "./utils/storage";
import { Transaction } from "./types/transaction";
import type { FilterType, Category, SortOption } from "./types/transaction";

interface AppProps {
  filterType: FilterType;
  filterCategory: Category | "tutte";
  sortBy: SortOption;
}

export function App({ filterType, filterCategory, sortBy }: AppProps) {
  const [initialLoad] = useState(loadTransactions);
  const [transactions, setTransactions] = useState<Transaction[]>(
    initialLoad.list,
  );
  const [storageError, setStorageError] = useState<string | null>(
    initialLoad.hasError
      ? "Impossibile caricare i dati salavti. I dati nel browser sono stai conservati."
      : null,
  );

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (initialLoad.hasError) return;
    const saved = saveTransactions(transactions);
    if (!saved)
      setStorageError("Impossibile salvare i movimenti nel browser...");
  }, [transactions]);
}
