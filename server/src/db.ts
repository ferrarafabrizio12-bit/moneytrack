import "dotenv/config";
import pg from "pg";
import type { Category, Transaction, TransactionType } from "./types.js";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL mancante nel file .env");
}

// Crea un "pool" di connessioni riutilizzabili verso PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Crea la tabella dei movimenti al primo avvio, se non esiste già
export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      descrizione TEXT NOT NULL,
      importo NUMERIC(10, 2) NOT NULL,
      tipo TEXT NOT NULL,
      categoria TEXT NOT NULL,
      data TEXT NOT NULL
    );
  `);
  console.log("Database PostgreSQL connesso e tabella pronta.");
}

// Converte una riga grezza del database in un oggetto Transaction tipizzato
export function mapRowToTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: String(row.id),
    descrizione: String(row.descrizione),
    importo: Number(row.importo),
    tipo: row.tipo as TransactionType,
    categoria: row.categoria as Category,
    data: String(row.data),
  };
}
