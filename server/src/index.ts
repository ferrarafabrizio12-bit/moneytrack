import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { CATEGORIES, type Category, type Transaction } from "./types.js";
import { initDb, mapRowToTransaction, pool } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

// Type guard: verifica che un valore sconosciuto sia una delle categorie valide
function isValidCategory(value: unknown): value is Category {
  return (
    typeof value === "string" &&
    (CATEGORIES as readonly string[]).includes(value)
  );
}

// Funzione di supporto: valida i dati in arrivo per creazione (POST) e modifica (PUT)
function validateTransactionInput(
  body: unknown,
): Omit<Transaction, "id"> | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const { descrizione, importo, tipo, categoria, data } = body as Record<
    string,
    unknown
  >;

  if (
    typeof descrizione !== "string" ||
    descrizione.trim() === "" ||
    typeof importo !== "number" ||
    Number.isNaN(importo) ||
    importo <= 0 ||
    (tipo !== "entrata" && tipo !== "uscita") ||
    !isValidCategory(categoria) ||
    typeof data !== "string" ||
    data.trim() === ""
  ) {
    return null;
  }

  return {
    descrizione: descrizione.trim(),
    importo,
    tipo,
    categoria,
    data,
  };
}

// Rotta di controllo per verificare che il server sia acceso
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Il backend di MoneyTrack è attivo!",
  });
});

// 1. LETTURA: recupera tutti i movimenti dal database ordinati dal più recente
app.get("/api/transactions", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions ORDER BY data DESC",
    );
    const transactions = result.rows.map(mapRowToTransaction);
    res.json(transactions);
  } catch (err) {
    console.error("Errore durante il recupero dei movimenti:", err);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

// 2. CREAZIONE: inserisce un nuovo movimento nel database
app.post("/api/transactions", async (req, res) => {
  const validData = validateTransactionInput(req.body);

  if (!validData) {
    res.status(400).json({
      error: "Dati del movimento mancanti o non validi.",
    });
    return;
  }

  const id = crypto.randomUUID();

  try {
    const result = await pool.query(
      `INSERT INTO transactions (id, descrizione, importo, tipo, categoria, data)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        id,
        validData.descrizione,
        validData.importo,
        validData.tipo,
        validData.categoria,
        validData.data,
      ],
    );

    const newTransaction = mapRowToTransaction(result.rows[0]);
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error("Errore durante il salvataggio del movimento:", err);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

// 3. MODIFICA: aggiorna un movimento esistente nel database tramite :id
app.put("/api/transactions/:id", async (req, res) => {
  const { id } = req.params;
  const validData = validateTransactionInput(req.body);

  if (!validData) {
    res.status(400).json({
      error: "Dati del movimento mancanti o non validi.",
    });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE transactions
       SET descrizione = $1, importo = $2, tipo = $3, categoria = $4, data = $5
       WHERE id = $6
       RETURNING *`,
      [
        validData.descrizione,
        validData.importo,
        validData.tipo,
        validData.categoria,
        validData.data,
        id,
      ],
    );

    if (!result.rowCount) {
      res.status(404).json({ error: "Movimento non trovato." });
      return;
    }

    const updatedTransaction = mapRowToTransaction(result.rows[0]);
    res.json(updatedTransaction);
  } catch (err) {
    console.error("Errore durante la modifica del movimento:", err);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

// 4. ELIMINAZIONE: cancella un movimento dal database tramite :id
app.delete("/api/transactions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM transactions WHERE id = $1", [
      id,
    ]);

    if (!result.rowCount) {
      res.status(404).json({ error: "Movimento non trovato." });
      return;
    }

    res.status(204).send();
  } catch (err) {
    console.error("Errore durante l'eliminazione del movimento:", err);
    res.status(500).json({ error: "Errore interno del server." });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server avviato su http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Errore di connessione al database:", err);
    process.exit(1);
  });
