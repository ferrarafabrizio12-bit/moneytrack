import { useEffect, useMemo, useState } from "react";
import { loadTransactions, saveTransactions } from "./utils/storage";
import type {
  Transaction,
  FilterType,
  Category,
  SortOption,
} from "./types/transaction";
import {
  calculateCategoryTotals,
  calculateTotalByType,
  filterAndSortTransactions,
} from "./utils/transactionUtils";
import { SummaryCards } from "./components/SummaryCards";
import { CategorySummary } from "./components/CategorySummary";
import { TransactionForm } from "./components/TransactionForm";
import { FilterBar } from "./components/FilterBar";
import { TransactionList } from "./components/TransactionList";

export function App() {
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

  const [filterType, setFilterType] = useState<FilterType>("tutti");
  const [filterCategory, setFilterCategory] = useState<Category | "tutte">(
    "tutte",
  );
  const [sortBy, setSortBy] = useState<SortOption>("dataRecente");

  useEffect(() => {
    if (initialLoad.hasError) return;
    const saved = saveTransactions(transactions);
    if (!saved)
      setStorageError("Impossibile salvare i movimenti nel browser...");
  }, [transactions]);

  const editingTransaction =
    transactions.find((t) => t.id === editingId) ?? null;

  const totalIncome = calculateTotalByType("entrata", transactions);

  const totalExpenses = calculateTotalByType("uscita", transactions);

  const balance = totalIncome - totalExpenses;

  const incomeByCategory = useMemo(
    () => calculateCategoryTotals("entrata", transactions),
    [transactions],
  );

  const expensesByCategory = useMemo(
    () => calculateCategoryTotals("uscita", transactions),
    [transactions],
  );

  const filteredTransactions = filterAndSortTransactions(
    transactions,
    filterType,
    filterCategory,
    sortBy,
  );

  const handleSaveTransaction = (data: Omit<Transaction, "id">) => {
    if (editingId !== null) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...data } : t)),
      );
    } else {
      const newTransaction: Transaction = {
        ...data,
        id: crypto.randomUUID(),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    }
    setEditingId(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (id === editingId) {
      setEditingId(null);
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
            Money<span className="text-blue-600">Track</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestisci entrate, uscite e saldo in tempo reale
          </p>
        </header>

        {storageError && (
          <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {storageError}
          </p>
        )}

        <SummaryCards
          balance={balance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />

        <CategorySummary
          incomeByCategory={incomeByCategory}
          expensesByCategory={expensesByCategory}
        />

        <TransactionForm
          key={editingTransaction?.id ?? "new"}
          editingTransaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancelEdit={() => setEditingId(null)}
        />

        <FilterBar
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          filterCategory={filterCategory}
          onFilterCategoryChange={setFilterCategory}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        <TransactionList
          transactions={filteredTransactions}
          onEdit={(id) => setEditingId(id)}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}
