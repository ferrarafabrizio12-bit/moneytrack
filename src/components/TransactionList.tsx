import { formatEuro } from "../utils/transactionUtils";

import type { Transaction } from "../types/transaction";

const stileBottoneMovimento =
  "text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors cursor-pointer";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mt-6 space-y-4">
      <h2 className="border-b border-slate-200 pb-4 text-center text-xl font-bold text-slate-800">
        Movimenti Registrati
      </h2>
      {transactions.length === 0 && (
        <p className="font-semibold text-slate-800">
          Nessun Movimento trovato con i Filtri selezionati!
        </p>
      )}
      {transactions.map((movimento) => (
        <article
          className="border border-slate-200 rounded-lg p-4 space-y-2"
          key={movimento.id}
        >
          <div className="flex justify-between items-center gap-4">
            <h2 className="font-semibold text-slate-800">
              {movimento.descrizione}
            </h2>
            <p
              className={`font-semibold ${movimento.tipo === "entrata" ? "text-green-600" : "text-red-600"}`}
            >
              {movimento.tipo === "entrata" ? "+" : "-"}{" "}
              {formatEuro(movimento.importo)}
            </p>
            <p className="text-sm text-slate-500">
              {movimento.categoria} • {movimento.data}
            </p>
          </div>
          <p className="text-sm text-slate-500">{movimento.categoria}</p>
          <div className="flex flex-wrap gap-2">
            <button
              className={`${stileBottoneMovimento} bg-blue-600 hover:bg-blue-700`}
              type="button"
              onClick={() => onEdit(movimento.id)}
            >
              Modifica
            </button>
            <button
              className={`${stileBottoneMovimento} bg-red-600 hover:bg-red-700`}
              type="button"
              onClick={() => onDelete(movimento.id)}
            >
              Elimina
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
