# MoneyTrack

**MoneyTrack** è un'applicazione web per gestire le finanze personali, realizzata con React. Permette di registrare entrate e uscite, consultarne i riepiloghi e ritrovare i dati anche dopo aver ricaricato la pagina.

## Funzionalità

- Aggiunta, modifica ed eliminazione di movimenti finanziari.
- Registrazione di descrizione, importo, tipo (entrata/uscita), categoria e data.
- Riepilogo di saldo, entrate totali e uscite totali.
- Totali delle entrate e delle uscite suddivisi per categoria.
- Filtri combinabili per tipo di movimento e categoria.
- Ordinamento per importo (crescente/decrescente) o data (più recente/meno recente).
- Validazione dei campi del modulo.
- Salvataggio dei movimenti nel `localStorage` del browser.
- Interfaccia responsive realizzata con Tailwind CSS.

## Tecnologie utilizzate

- **React** — componenti, stato e rendering dell'interfaccia.
- **JavaScript** — logica e gestione dei dati.
- **Vite** — ambiente di sviluppo e build.
- **Tailwind CSS v4** — stile e layout responsive.
- **localStorage** — persistenza locale dei movimenti.

## Avvio in locale

### Requisiti

- Node.js e npm installati.

### Installazione

1. Clona il repository:

   ```bash
   git clone https://github.com/ferrarafabrizio12-bit/MoneyTrack.git
   ```

2. Entra nella cartella del progetto:

   ```bash
   cd MoneyTrack
   ```

3. Installa le dipendenze:

   ```bash
   npm install
   ```

4. Avvia il server di sviluppo:

   ```bash
   npm run dev
   ```

5. Apri nel browser l'indirizzo mostrato nel terminale.

## Come si usa

Inserisci un nuovo movimento scegliendo tipo, categoria e data. La dashboard aggiorna automaticamente saldo e riepiloghi. Puoi modificare o eliminare i movimenti registrati, filtrarli e ordinarli.

## Dove vengono salvati i dati?

I movimenti sono memorizzati nel **localStorage del browser** (chiave `moneytrack_movimenti`). Non è previsto un account utente né un database remoto: i dati non vengono sincronizzati fra browser o dispositivi diversi. La cancellazione dei dati del sito nel browser può comportare la perdita dei movimenti.

## Stato del progetto

Prima versione funzionale completata, con gestione dei movimenti e interfaccia responsive.
