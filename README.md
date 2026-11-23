# MoneyTrack

Applicazione web per il monitoraggio delle finanze personali, progettata per registrare, filtrare e analizzare entrate e uscite in tempo reale con persistenza locale nel browser.

## Funzionalità principali

- **Riepilogo finanziario:** calcolo istantaneo di saldo totale, entrate complessive e uscite complessive.
- **Analisi per categoria:** aggregazione automatica degli importi suddivisi tra entrate e uscite per singola categoria.
- **Gestione completa dei movimenti (CRUD):** inserimento con validazione dei campi, modifica tramite form precompilato ed eliminazione.
- **Ricerca e ordinamento:** filtraggio combinato per tipologia (tutte, entrate, uscite), categoria e ordinamento per data o importo.
- **Persistenza resiliente:** salvataggio automatico su `localStorage` con protezione da dati corrotti ed errori di lettura/scrittura gestiti tramite banner dedicati nell'interfaccia.

## Stack tecnologico

- **React** (Hook: `useState`, `useEffect`, `useMemo`)
- **TypeScript** (tipizzazione stretta, utility types e custom type guards)
- **Tailwind CSS** (layout responsive e design system coerente)
- **Vite** (ambiente di sviluppo e bundling di produzione)

## Scelte architetturali

Il progetto è stato strutturato separando nettamente l'interfaccia utente, i tipi di dominio e la logica di calcolo:

- **Architettura modulare:** l'interfaccia è suddivisa in componenti dedicati (`SummaryCards`, `CategorySummary`, `TransactionForm`, `FilterBar`, `TransactionList`), mentre le operazioni di calcolo, filtraggio e accesso al `localStorage` sono isolate in funzioni pure dentro `src/utils/`.
- **Sicurezza dei tipi a compile-time e runtime:** oltre alle interfacce e agli union types in `src/types/transaction.ts`, i dati letti dal `localStorage` vengono validati tramite type guard per evitare errori a runtime dovuti a JSON alterati.
- **Reset del form tramite `key` pattern:** invece di sincronizzare lo stato del form con un `useEffect` al cambio del movimento in modifica, `TransactionForm` utilizza una `key` dinamica legata all'ID selezionato (`key={editingTransaction?.id ?? "new"}`), garantendo un reset pulito in un unico render.
- **Ottimizzazione dei calcoli derivati:** i totali per categoria vengono ricalcolati solo quando cambia l'elenco dei movimenti grazie a `useMemo`.

## Struttura del progetto

```text
src/
├── components/
│   ├── CategorySummary.tsx   # Riepilogo entrate e uscite per categoria
│   ├── FilterBar.tsx         # Controlli di filtro per tipo, categoria e ordinamento
│   ├── SummaryCards.tsx      # Card principali con saldo, entrate e uscite
│   ├── TransactionForm.tsx   # Form controllato per creazione e modifica
│   └── TransactionList.tsx   # Elenco movimenti con azioni di modifica ed eliminazione
├── types/
│   └── transaction.ts        # Interfacce, costanti e tipi di dominio
├── utils/
│   ├── storage.ts            # Lettura, validazione e salvataggio su localStorage
│   └── transactionUtils.ts   # Funzioni pure di calcolo, filtro e ordinamento
├── App.tsx                   # Orchestrazione dello stato globale e dei componenti
├── index.css                 # Configurazione Tailwind CSS
└── main.tsx                  # Entry point dell'applicazione
```

## Avvio in locale

1. Clona la repository ed entra nella cartella del progetto.
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```
4. Per generare la build di produzione e verificare i tipi TypeScript:
   ```bash
   npm run build
   ```
