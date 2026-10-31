import { useState, useEffect, useMemo } from "react";

// Stili condivisi dei campi e dei pulsanti
const stileInput = "w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const stileLabel = "block text-sm font-medium text-slate-700";
const stileBottoneFiltro = "px-4 py-2 rounded-lg font-medium cursor-pointer";
const stileBottone = "text-white font-semibold rounded-lg px-4 py-2 transition-colors cursor-pointer";
const stileBottoneMovimento = "text-white text-sm font-medium rounded-lg px-3 py-2 transition-colors cursor-pointer";

// Formattazione degli importi in euro
const formatoEuro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR"
});

// Categorie disponibili per i movimenti
const categorie = [
  "Alimentari",
  "Casa",
  "Trasporti",
  "Salute",
  "Sport",
  "Intrattenimento",
  "Shopping",
  "Lavoro",
  "Istruzione",
  "Altro"
];

// Valori condivisi per inizializzare e svuotare il form
const movimentoIniziale = {
  descrizione: "",
  importo: "",
  tipo: "entrata",
  categoria: "",
  data: ""
};

// Verifica anche i dati letti dal browser prima di usarli nell’interfaccia
const movimentoValido = (movimento) => (
  movimento !== null && typeof movimento === "object" &&
  typeof movimento.id === "string" && movimento.id.trim() !== "" &&
  typeof movimento.descrizione === "string" && movimento.descrizione.trim() !== "" &&
  Number.isFinite(movimento.importo) && movimento.importo > 0 &&
  ["entrata", "uscita"].includes(movimento.tipo) &&
  categorie.includes(movimento.categoria) &&
  typeof movimento.data === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(movimento.data) &&
  Number.isFinite(Date.parse(movimento.data))
);

const caricaMovimenti = () => {
  try {
    const datiSalvati = localStorage.getItem("moneytrack_movimenti");
    const lista = datiSalvati === null ? [] : JSON.parse(datiSalvati);
    if (!Array.isArray(lista) || !lista.every(movimentoValido)) {
      throw new Error("Formato dei movimenti salvati non valido");
    }
    return { lista, errore: false };
  } catch {
    return { lista: [], errore: true };
  }
};

// Calcolo dei totali per ogni categoria, distinguendo entrate e uscite
const calcolaTotaliPerCategoria = (tipo, listaMovimenti) => {
  const movimentiDelTipo = listaMovimenti.filter((movimento) => movimento.tipo === tipo);
  const totaliPerCategoria = categorie.map((cat) => {
    const movimentiCategoria = movimentiDelTipo.filter((filtroCat) => filtroCat.categoria === cat);
    const totaleCategoria = movimentiCategoria.reduce((somma, movimento) => {
      return somma + movimento.importo;
    }, 0);
    return { categoria: cat, totale: totaleCategoria };
  });

  return totaliPerCategoria;
};

function App() {

  // Mantengo l’esito del caricamento per proteggere eventuali dati illeggibili
  const [caricamento] = useState(caricaMovimenti);
  const [movimenti, setMovimenti] = useState(caricamento.lista);

  // Dati del form di aggiunta e modifica
  const [nuovoMovimento, setNuovoMovimento] = useState(movimentoIniziale);

  // Salvataggio automatico dei movimenti a ogni aggiornamento
  useEffect(() => {
    if (caricamento.errore) {
      alert("Impossibile caricare i movimenti salvati. I dati nel browser sono stati conservati. Le modifiche resteranno solo in memoria finché il problema non sarà risolto e la pagina ricaricata.");
      return;
    }
    try {
      localStorage.setItem("moneytrack_movimenti", JSON.stringify(movimenti));
    } catch {
      alert("Impossibile salvare i movimenti nel browser. Le modifiche restano in memoria, ma potrebbero andare perse ricaricando la pagina.");
    }
  }, [movimenti, caricamento.errore]);

  // Movimento selezionato per la modifica
  const [idInModifica, setIdInModifica] = useState(null);

  // Ordinamento e filtri della lista
  const [ordinamento, setOrdinamento] = useState("importoCrescente");

  const [filtroTipo, setFiltroTipo] = useState("tutti");

  const [filtroCategoria, setFiltroCategoria] = useState("tutte");

  // Applicazione combinata dei filtri e dell’ordinamento
  const movimentiFiltrati = movimenti.filter((movimento) => {
    const corrispondeTipo = filtroTipo === "tutti" || movimento.tipo === filtroTipo;
    const corrispondeCategoria = filtroCategoria === "tutte" || movimento.categoria === filtroCategoria;
    return corrispondeTipo && corrispondeCategoria;}).sort((a, b) => {
    if (ordinamento === "importoCrescente") return a.importo - b.importo;
    if (ordinamento === "importoDecrescente") return b.importo - a.importo;
    if (ordinamento === "dataRecente") return b.data.localeCompare(a.data);
    if (ordinamento === "dataMenoRecente") return a.data.localeCompare(b.data);
    return 0;
  });

  // Calcolo dei totali complessivi e del saldo
  const totaleEntrate = movimenti.reduce((somma, movimento) => {
    if (movimento.tipo === "entrata") return somma + movimento.importo;
    else return somma;
  }, 0);

  const totaleUscite = movimenti.reduce((somma, movimento) => {
    if (movimento.tipo === "uscita") return somma + movimento.importo;
    else return somma;
  }, 0);

  const saldo = totaleEntrate - totaleUscite;

  // Movimenti separati per tipo
  const soloEntrate = movimenti.filter((movimento) => {
    return movimento.tipo === "entrata";
  });

  const soloUscite = movimenti.filter((movimento) => {
    return movimento.tipo === "uscita";
  });

  // Riepiloghi per categoria ricalcolati quando cambiano i movimenti
  const guadagniPerCategoria = useMemo(() => {
    return calcolaTotaliPerCategoria("entrata", movimenti);
  }, [movimenti]);

  const spesePerCategoria = useMemo(() => {
    return calcolaTotaliPerCategoria("uscita", movimenti);
  }, [movimenti]);

  // Aggiunta o modifica di un movimento, con controllo dei dati inseriti
  const aggiungiMovimento = (e) => {
    e.preventDefault();

    if (nuovoMovimento.descrizione.trim() === "") {
      alert("Inserire una descrizione valida!");
      return;
    };

    const importoNumerico = Number(nuovoMovimento.importo);
    if (nuovoMovimento.importo.trim() === "" || !Number.isFinite(importoNumerico) || importoNumerico <= 0) {
      alert("Inserire un importo valido e maggiore di zero!");
      return;
    };

    if (nuovoMovimento.categoria.trim() ==="") {
      alert("Scegliere una categoria tra quelle della lista!");
      return;
    };

    if (nuovoMovimento.data.trim() ==="") {
      alert("Inserire una data valida!");
      return;
    };

    // Preparo gli stessi dati normalizzati per aggiunta e modifica
    const datiMovimento = {
      descrizione: nuovoMovimento.descrizione.trim(),
      importo: importoNumerico,
      tipo: nuovoMovimento.tipo,
      categoria: nuovoMovimento.categoria,
      data: nuovoMovimento.data
    };

    if (idInModifica !== null) {
      setMovimenti((prev) => prev.map((movimento) =>
        movimento.id === idInModifica
          ? { ...movimento, ...datiMovimento }
          : movimento
      ));
    } else {
      const movimentoDaAggiungere = {
        ...datiMovimento,
        id: crypto.randomUUID()
      };
      setMovimenti((prev) => [movimentoDaAggiungere, ...prev]);
    }

    setIdInModifica(null);
    setNuovoMovimento(movimentoIniziale);

  };

  // Eliminazione di un movimento dalla lista
  const eliminaMovimento = (id) => {
    if (id === idInModifica) {
      annullaModifica();
    };

    setMovimenti((prev) => prev.filter((movimento) => movimento.id !== id));
  };

  // Caricamento del movimento selezionato nel form
  const preparaModifica = (id) => {
    const movimentoDaModificare = movimenti.find((movimento) => movimento.id === id);
    if (!movimentoDaModificare) {
      alert("Movimento non esistente");
      return;
    }

    setIdInModifica(id);
    setNuovoMovimento({
      ...movimentoDaModificare,
      importo: String(movimentoDaModificare.importo)
    });
  };

  // Uscita dalla modalità modifica e pulizia del form
  const annullaModifica = () => {
    setIdInModifica(null);
    setNuovoMovimento(movimentoIniziale);
  };

  // Interfaccia principale di MoneyTrack
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-6 text-center">MoneyTrack</h1>
        {/* Saldo, entrate e uscite complessive */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
            <p className="text-sm text-slate-500">Saldo: </p>
            <h2 className="text-3xl font-bold text-slate-800">{formatoEuro.format(saldo)}</h2>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
            <p className="text-sm text-slate-500">Entrate:</p>
            <h2 className="text-3xl font-bold text-green-600">+ {formatoEuro.format(totaleEntrate)}</h2>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
            <p className="text-sm text-slate-500">Uscite:</p>
            <h2 className="text-3xl font-bold text-red-600">- {formatoEuro.format(totaleUscite)}</h2>
          </div>
        </div>

        {/* Riepiloghi di entrate e uscite per categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-green-600 border-b border-slate-200 pb-3">Entrate per Categoria:</h2>
            {soloEntrate.length === 0 && <p className="text-sm text-slate-600">Nessuna entrata registrata!</p>}
            {guadagniPerCategoria.filter((guadagno) => guadagno.totale !== 0).map((guadagno) => (
              <article className="flex justify-between items-center gap-2" key={guadagno.categoria}>
                <h3 className="text-sm text-slate-600">{guadagno.categoria}:</h3>
                <p className="font-semibold text-green-600">+ {formatoEuro.format(guadagno.totale)}</p>
              </article>
            ))}
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-red-600 border-b border-slate-200 pb-3">Uscite per Categoria:</h2>
            {soloUscite.length === 0 && <p className="text-sm text-slate-600">Nessuna uscita registrata!</p>}
            {spesePerCategoria.filter((spesa) => spesa.totale !== 0).map((spesa) => (
              <article className="flex justify-between items-center gap-2" key={spesa.categoria}>
                <h3 className="text-sm text-slate-600">{spesa.categoria}:</h3>
                <p className="font-semibold text-red-600">- {formatoEuro.format(spesa.totale)}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Form per aggiungere o modificare un movimento */}
        <form className="bg-white rounded-xl p-6 shadow-sm mt-6 space-y-4" onSubmit={aggiungiMovimento}>
          <h2 className="border-b border-slate-200 pb-4 text-center text-xl font-bold text-slate-800">{idInModifica === null ? "Nuovo Movimento" : "Modifica Movimento"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={stileLabel} htmlFor="descrizione">Descrizione</label>
            <input
              className={stileInput}
              type="text"
              id="descrizione"
              value={nuovoMovimento.descrizione}
              onChange={(e) => setNuovoMovimento((prev) => ({...prev, descrizione:e.target.value}))}
            />

            <label className={stileLabel} htmlFor="importo">Importo</label>
            <input
              className={stileInput}
              type="number"
              id="importo"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={nuovoMovimento.importo}
              onChange={(e) => setNuovoMovimento((prev) => ({...prev, importo:e.target.value}))}
            />

            <label className={stileLabel} htmlFor="tipo">Tipo di Movimento</label>
            <select className={stileInput} id="tipo" value={nuovoMovimento.tipo} onChange={(e) => setNuovoMovimento((prev) => ({...prev, tipo:e.target.value}))}>
              <option value="entrata">Entrata</option>
              <option value="uscita">Uscita</option>
            </select>

            <label className={stileLabel} htmlFor="categoria">Categoria</label>
            <select className={stileInput} id="categoria" value={nuovoMovimento.categoria} onChange={(e) => setNuovoMovimento((prev) => ({...prev, categoria:e.target.value}))}>
              <option value="">Seleziona una Categoria</option>
              {categorie.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>

            <label className={stileLabel} htmlFor="data">Data del Movimento</label>
            <input
              className={stileInput}
              type="date"
              id="data"
              value={nuovoMovimento.data}
              onChange={(e) => setNuovoMovimento((prev) => ({...prev, data:e.target.value}))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={`${stileBottone} bg-blue-600 hover:bg-blue-700`} type="submit">{idInModifica === null ? "Aggiungi Movimento" : "Salva Modifica"}</button>
            {idInModifica !== null && <button className={`${stileBottone} bg-slate-500 hover:bg-slate-600`} type="button" onClick={annullaModifica}>Annulla Modifica</button>}
          </div>
        </form>

        {/* Filtri per tipo, categoria e ordinamento */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white rounded-xl p-6 shadow-sm mt-6">
          <h2 className="border-slate-200 pr-4 border-r text-center text-xl font-bold text-slate-800 mx-auto">Filtri</h2>
          <div className="flex gap-2 flex-wrap">
            <button type="button" className={`${stileBottoneFiltro} ${filtroTipo === "tutti" ? "bg-slate-700 text-white" : "bg-white text-slate-700"}`} onClick={() => setFiltroTipo("tutti")}>Tutti</button>
            <button type="button" className={`${stileBottoneFiltro} ${filtroTipo === "entrata" ? "bg-slate-700 text-white" : "bg-white text-slate-700"}`} onClick={() => setFiltroTipo("entrata")}>Entrate</button>
            <button type="button" className={`${stileBottoneFiltro} ${filtroTipo === "uscita" ? "bg-slate-700 text-white" : "bg-white text-slate-700"}`} onClick={() => setFiltroTipo("uscita")}>Uscite</button>
          </div>
          <div className="flex flex-col gap-1">
            <label className={stileLabel} htmlFor="filtroCategoria">Categoria</label>
            <select className={`${stileInput} md:w-auto`} id="filtroCategoria" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="tutte">Tutte le Categorie</option>
              {categorie.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className={stileLabel} htmlFor="ordinamento">Ordina per</label>
            <select className={`${stileInput} md:w-auto`} id="ordinamento" value={ordinamento} onChange={(e) => setOrdinamento(e.target.value)}>
              <option value="importoCrescente">Importo Crescente</option>
              <option value="importoDecrescente">Importo Decrescente</option>
              <option value="dataRecente">Data più Recente</option>
              <option value="dataMenoRecente">Data meno Recente</option>
            </select>
          </div>
        </div>

        {/* Elenco dei movimenti registrati */}
        <div className="bg-white rounded-xl p-6 shadow-sm mt-6 space-y-4">
          <h2 className="border-b border-slate-200 pb-4 text-center text-xl font-bold text-slate-800">Movimenti Registrati</h2>
          {movimentiFiltrati.length === 0 && <p className="font-semibold text-slate-800">Nessun Movimento trovato con i Filtri selezionati!</p>}
          {movimentiFiltrati.map((movimento) => (
            <article className="border border-slate-200 rounded-lg p-4 space-y-2" key={movimento.id}>
              <div className="flex justify-between items-center gap-4">
                <h2 className="font-semibold text-slate-800">{movimento.descrizione}</h2>
                <p className={`font-semibold ${movimento.tipo === "entrata" ? "text-green-600" : "text-red-600"}`}>{movimento.tipo === "entrata" ? "+" : "-"} {formatoEuro.format(movimento.importo)}</p>
              </div>
              <p className="text-sm text-slate-500">{movimento.categoria}</p>
              <div className="flex flex-wrap gap-2">
                <button className={`${stileBottoneMovimento} bg-blue-600 hover:bg-blue-700`} type="button" onClick={() => preparaModifica(movimento.id)}>Modifica</button>
                <button className={`${stileBottoneMovimento} bg-red-600 hover:bg-red-700`} type="button" onClick={() => eliminaMovimento(movimento.id)}>Elimina</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
