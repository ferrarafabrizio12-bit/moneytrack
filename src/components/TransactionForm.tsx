import { SyntheticEvent, useState } from "react";

import { CATEGORIES } from "../types/transaction";

import type {
  Category,
  Transaction,
  TransactionFormData,
  TransactionType,
} from "../types/transaction";

const stileInput =
  "w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const stileLabel = "block text-sm font-medium text-slate-700";
const stileBottone =
  "text-white font-semibold rounded-lg px-4 py-2 transition-colors cursor-pointer";

//Stato iniziale del form
const initialFormState: TransactionFormData = {
  descrizione: "",
  importo: "",
  tipo: "entrata",
  categoria: "",
  data: "",
};

interface TransactionFormProps {
  editingTransaction: Transaction | null;
  onSave: (data: Omit<Transaction, "id">) => void;
  onCancelEdit: () => void;
}

export function TransactionForm({
  editingTransaction,
  onSave,
  onCancelEdit,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>(() =>
    editingTransaction
      ? {
          descrizione: editingTransaction.descrizione,
          importo: String(editingTransaction.importo),
          tipo: editingTransaction.tipo,
          categoria: editingTransaction.categoria,
          data: editingTransaction.data,
        }
      : initialFormState,
  );

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.descrizione.trim() === "") {
      setError("Inserire una descrizione valida!");
      return;
    }

    if (
      !Number.isFinite(Number(formData.importo)) ||
      Number(formData.importo) <= 0
    ) {
      setError("Inserire un importo valido e maggiore di zero!");
      return;
    }

    if (formData.categoria.trim() === "") {
      setError("Scegliere una categoria tra quelle della lista!");
      return;
    }

    if (formData.data.trim() === "") {
      setError("Inserire una data valida!");
      return;
    }

    setError(null);

    onSave({
      descrizione: formData.descrizione.trim(),
      importo: Number(formData.importo),
      tipo: formData.tipo,
      categoria: formData.categoria as Category,
      data: formData.data,
    });

    setFormData(initialFormState);
  };

  return (
    <form
      className="bg-white rounded-xl p-6 shadow-sm mt-6 space-y-4"
      onSubmit={handleSubmit}
    >
      <h2 className="border-b border-slate-200 pb-4 text-center text-xl font-bold text-slate-800">
        {editingTransaction === null ? "Nuovo Movimento" : "Modifica Movimento"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className={stileLabel} htmlFor="descrizione">
          Descrizione
        </label>
        <input
          className={stileInput}
          type="text"
          id="descrizione"
          value={formData.descrizione}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              descrizione: e.target.value,
            }))
          }
        />

        <label className={stileLabel} htmlFor="importo">
          Importo
        </label>
        <input
          className={stileInput}
          type="number"
          id="importo"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={formData.importo}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, importo: e.target.value }))
          }
        />

        <label className={stileLabel} htmlFor="tipo">
          Tipo di Movimento
        </label>
        <select
          className={stileInput}
          id="tipo"
          value={formData.tipo}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              tipo: e.target.value as TransactionType,
            }))
          }
        >
          <option value="entrata">Entrata</option>
          <option value="uscita">Uscita</option>
        </select>

        <label className={stileLabel} htmlFor="categoria">
          Categoria
        </label>
        <select
          className={stileInput}
          id="categoria"
          value={formData.categoria}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              categoria: e.target.value as Category,
            }))
          }
        >
          <option value="">Seleziona una Categoria</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className={stileLabel} htmlFor="data">
          Data del Movimento
        </label>
        <input
          className={stileInput}
          type="date"
          id="data"
          value={formData.data}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, data: e.target.value }))
          }
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          className={`${stileBottone} bg-blue-600 hover:bg-blue-700`}
          type="submit"
        >
          {editingTransaction === null
            ? "Aggiungi Movimento"
            : "Salva Modifica"}
        </button>
        {editingTransaction !== null && (
          <button
            className={`${stileBottone} bg-slate-500 hover:bg-slate-600`}
            type="button"
            onClick={onCancelEdit}
          >
            Annulla Modifica
          </button>
        )}
      </div>
    </form>
  );
}
