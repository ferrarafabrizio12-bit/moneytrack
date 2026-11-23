import { useEffect, useMemo, useState } from "react";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./utils/api";
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<FilterType>("tutti");
  const [filterCategory, setFilterCategory] = useState<Category | "tutte">(
    "tutte",
  );
  const [sortBy, setSortBy] = useState<SortOption>("dataRecente");

  // Carica i movimenti dal backend una sola volta all'apertura dell'app
  useEffect(() => {
    getTransactions()
      .then((data) => {
        setTransactions(data);
        setApiError(null);
      })
      .catch((err) => {
        setApiError(
          err instanceof Error
            ? err.message
            : "Impossibile caricare i movimenti dal server.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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

  const handleSaveTransaction = async (data: Omit<Transaction, "id">) => {
    setApiError(null);

    try {
      if (editingId !== null) {
        const updated = await updateTransaction(editingId, data);
        setTransactions((prev) =>
          prev.map((t) => (t.id === editingId ? updated : t)),
        );
        setEditingId(null);
      } else {
        const created = await createTransaction(data);
        setTransactions((prev) => [created, ...prev]);
      }
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Errore durante il salvataggio del movimento.",
      );
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    setApiError(null);

    try {
      await deleteTransaction(id);
      if (id === editingId) {
        setEditingId(null);
      }
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : "Errore durante l'eliminazione del movimento.",
      );
    }
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

        {apiError && (
          <p className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {apiError}
          </p>
        )}

        {isLoading ? (
          <p className="text-center text-slate-500 py-12">
            Caricamento movimenti in corso...
          </p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
