import type { Transaction } from "../types/transaction";

// In locale usa localhost:3001; quando pubblicheremo il backend online userà l'URL di produzione
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Funzione di supporto per controllare la risposta del server ed estrarre il JSON
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error ||
        `Errore di comunicazione con il server (${response.status})`,
    );
  }

  // La DELETE risponde con 204 (No Content) e non ha un corpo JSON da leggere
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// 1. LETTURA: scarica tutti i movimenti dal database
export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/api/transactions`);
  return handleResponse<Transaction[]>(response);
}

// 2. CREAZIONE: invia un nuovo movimento al server e riceve quello salvato con ID
export async function createTransaction(
  data: Omit<Transaction, "id">,
): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Transaction>(response);
}

// 3. MODIFICA: aggiorna un movimento esistente tramite il suo ID
export async function updateTransaction(
  id: string,
  data: Omit<Transaction, "id">,
): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Transaction>(response);
}

// 4. ELIMINAZIONE: cancella un movimento dal database
export async function deleteTransaction(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "DELETE",
  });
  return handleResponse<void>(response);
}
