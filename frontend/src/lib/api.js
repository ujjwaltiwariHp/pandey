let baseApi = "http://localhost:5000/api";
if (typeof window !== "undefined") {
  const host = window.location.hostname;
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    baseApi = `http://${host}:5000/api`;
  }
}
const API = process.env.NEXT_PUBLIC_API_URL || baseApi;

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Auth
export async function login(username, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function verifyToken() {
  const res = await fetch(`${API}/auth/me`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Token invalid");
  return await res.json();
}

// Lists
export async function fetchLists() {
  const res = await fetch(`${API}/lists`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch lists");
  return data.lists;
}

export async function createList(payload) {
  const res = await fetch(`${API}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create list");
  return data.list;
}

export async function updateList(id, payload) {
  const res = await fetch(`${API}/lists/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update list");
  return data.list;
}

export async function deleteList(id) {
  const res = await fetch(`${API}/lists/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete list");
  return data;
}

// Items
export async function createItem(listId, payload) {
  const res = await fetch(`${API}/lists/${listId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to create item");
  return data.item;
}

export async function updateItem(id, payload) {
  const res = await fetch(`${API}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update item");
  return data.item;
}

export async function deleteItem(id) {
  const res = await fetch(`${API}/items/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete item");
  return data;
}

// Hindi Transliteration via Google API
let translitCache = {};
export async function getHindiSuggestions(text) {
  if (!text || text.length < 1) return [];
  if (translitCache[text]) return translitCache[text];
  try {
    const res = await fetch(
      `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8`
    );
    const data = await res.json();
    if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]) {
      translitCache[text] = data[1][0][1];
      return data[1][0][1];
    }
    return [];
  } catch {
    return [];
  }
}
