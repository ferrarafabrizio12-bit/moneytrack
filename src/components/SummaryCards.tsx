import { formatEuro } from "../utils/transactionUtils";

interface SummaryCardsProps {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

export function SummaryCards({
  balance,
  totalIncome,
  totalExpenses,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
        <p className="text-sm text-slate-500">Saldo: </p>
        <h2 className="text-3xl font-bold text-slate-800">
          {formatEuro(balance)}
        </h2>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
        <p className="text-sm text-slate-500">Entrate:</p>
        <h2 className="text-3xl font-bold text-green-600">
          + {formatEuro(totalIncome)}
        </h2>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
        <p className="text-sm text-slate-500">Uscite:</p>
        <h2 className="text-3xl font-bold text-red-600">
          - {formatEuro(totalExpenses)}
        </h2>
      </div>
    </div>
  );
}
