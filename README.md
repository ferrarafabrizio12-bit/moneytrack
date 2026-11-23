# MoneyTrack

Applicazione web full-stack per la gestione delle finanze personali. Permette di registrare e monitorare entrate, uscite, saldo totale e ripartizione per categorie con salvataggio persistente su database PostgreSQL e supporto per l'installazione come web app su iOS.

## Funzionalità principali

- **Gestione completa dei movimenti (CRUD):** creazione, modifica ed eliminazione di entrate e uscite con validazione dei dati lato client e lato server.
- **Analisi in tempo reale:** calcolo automatico di saldo attuale, totale entrate, totale uscite e riepilogo suddiviso per categoria.
- **Ricerca e ordinamento:** filtri per tipologia (`tutti`, `entrata`, `uscita`), categoria e ordinamento per data o importo.
- **Persistenza su cloud:** sincronizzazione dei dati tramite API REST su database relazionale PostgreSQL, accessibile da desktop e smartphone.
- **Esperienza Web App su iOS:** icona personalizzata (`apple-touch-icon.png`) e apertura a schermo intero dalla schermata Home di iPhone e iPad.

## Stack Tecnologico

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (ospitato su Neon)
- **Deploy:** Vercel (Frontend), Render (Backend)

## Struttura del progetto

```text
moneytrack/
├── public/
│   └── apple-touch-icon.png   # Icona per schermata Home iOS
├── src/                       # Codice sorgente Frontend (React)
│   ├── components/            # Componenti UI (Form, Lista, Filtri, Riepiloghi)
│   ├── types/                 # Interfacce e tipi TypeScript
│   ├── utils/                 # Client API (api.ts) e funzioni di calcolo
│   └── App.tsx                # Componente principale
├── server/                    # Codice sorgente Backend (Express)
│   ├── src/
│   │   ├── db.ts              # Connessione PostgreSQL e creazione tabella
│   │   ├── index.ts           # Server Express, validazione e rotte API
│   │   └── types.ts           # Tipi condivisi e categorie valide
│   ├── .env                   # Variabili d'ambiente locali (escluso da Git)
│   └── package.json
└── index.html
```
