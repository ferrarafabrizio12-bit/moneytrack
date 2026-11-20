import { formatEuro } from "../utils/transactionUtils";

import type { CategoryTotal } from "../utils/transactionUtils";

interface CategorySummaryProps {
  incomeByCategory: CategoryTotal[];
  expensesByCategory: CategoryTotal[];
}

export function CategorySummary({
  incomeByCategory,
  expensesByCategory,
}: CategorySummaryProps) {
  const activeIncome = incomeByCategory.filter((item) => item.totale !== 0);

  const activeExpenses = expensesByCategory.filter((item) => item.totale !== 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
        <h2 className="text-xl font-bold text-green-600 border-b border-slate-200 pb-3">
          Entrate per Categoria:
        </h2>
        {activeIncome.length === 0 && (
          <p className="text-sm text-slate-600">Nessuna entrata registrata!</p>
        )}
        {activeIncome.map((income) => (
          <article
            className="flex justify-between items-center gap-2"
            key={income.categoria}
          >
            <h3 className="text-sm text-slate-600">{income.categoria}:</h3>
            <p className="font-semibold text-green-600">
              + {formatEuro(income.totale)}
            </p>
          </article>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
        <h2 className="text-xl font-bold text-red-600 border-b border-slate-200 pb-3">
          Uscite per Categoria:
        </h2>
        {activeExpenses.length === 0 && (
          <p className="text-sm text-slate-600">Nessuna uscita registrata!</p>
        )}
        {activeExpenses.map((expense) => (
          <article
            className="flex justify-between items-center gap-2"
            key={expense.categoria}
          >
            <h3 className="text-sm text-slate-600">{expense.categoria}:</h3>
            <p className="font-semibold text-red-600">
              - {formatEuro(expense.totale)}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
