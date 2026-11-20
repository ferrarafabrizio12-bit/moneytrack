import { CATEGORIES } from "../types/transaction";

import type { Category, FilterType, SortOption } from "../types/transaction";

const stileInput =
  "w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const stileLabel = "block text-sm font-medium text-slate-700";
const stileBottoneFiltro = "px-4 py-2 rounded-lg font-medium cursor-pointer";

interface FilterBarProps {
  filterType: FilterType;
  onFilterTypeChange: (type: FilterType) => void;
  filterCategory: Category | "tutte";
  onFilterCategoryChange: (category: Category | "tutte") => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
}

export function FilterBar({
  filterType,
  onFilterTypeChange,
  filterCategory,
  onFilterCategoryChange,
  sortBy,
  onSortByChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white rounded-xl p-6 shadow-sm mt-6">
      <h2 className="border-slate-200 pr-4 border-r text-center text-xl font-bold text-slate-800 mx-auto">
        Filtri
      </h2>
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          className={`${stileBottoneFiltro} ${filterType === "tutti" ? "bg-slate-700 text-white" : "bg-white text-slate-700"}`}
          onClick={() => onFilterTypeChange("tutti")}
        >
          Tutti
        </button>
        <button
          type="button"
          className={`${stileBottoneFiltro} ${filterType === "entrata" ? "bg-slate-700 text-white" : "bg-white text-slate-700"}`}
          onClick={() => onFilterTypeChange("entrata")}
        >
          Entrate
        </button>
        <button
          type="button"
          className={`${stileBottoneFiltro} ${filterType === "uscita" ? "bg-slate-700 text-white" : "bg-white text-slate-700"}`}
          onClick={() => onFilterTypeChange("uscita")}
        >
          Uscite
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <label className={stileLabel} htmlFor="filtroCategoria">
          Categoria
        </label>
        <select
          className={`${stileInput} md:w-auto`}
          id="filtroCategoria"
          value={filterCategory}
          onChange={(e) =>
            onFilterCategoryChange(e.target.value as Category | "tutte")
          }
        >
          <option value="tutte">Tutte le Categorie</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className={stileLabel} htmlFor="ordinamento">
          Ordina per
        </label>
        <select
          className={`${stileInput} md:w-auto`}
          id="ordinamento"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortOption)}
        >
          <option value="importoCrescente">Importo Crescente</option>
          <option value="importoDecrescente">Importo Decrescente</option>
          <option value="dataRecente">Data più Recente</option>
          <option value="dataMenoRecente">Data meno Recente</option>
        </select>
      </div>
    </div>
  );
}
