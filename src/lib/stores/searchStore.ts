import { writable } from "svelte/store";

// Store untuk menyimpan query pencarian
export const searchQuery = writable("");

// Store untuk menyimpan saran pencarian
export const searchSuggestions = writable<string[]>([]);

// Store untuk menyimpan hasil pencarian artikel
export const searchResults = writable<any[]>([]);

// Store untuk status loading
export const isSearching = writable(false);

// Status untuk menampilkan popup saran pencarian
export const showSuggestions = writable(false);

// Fungsi untuk melakukan pencarian saran
export async function fetchSuggestions(query: string) {
  if (!query || query.length < 1) {
    searchSuggestions.set([]);
    showSuggestions.set(false);
    return;
  }

  isSearching.set(true);

  try {
    const response = await fetch(
      `/api/articles/search?q=${encodeURIComponent(query)}&limit=5`
    );
    const data = await response.json();
    searchSuggestions.set(data.suggestions || []);
    showSuggestions.set(true);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    searchSuggestions.set([]);
  } finally {
    isSearching.set(false);
  }
}

// Fungsi untuk melakukan pencarian penuh
export async function performSearch(
  query: string,
  categoryId?: string,
  page: number = 1
) {
  if (!query) {
    searchResults.set([]);
    return;
  }

  isSearching.set(true);

  try {
    let url = `/api/articles/search/advanced?q=${encodeURIComponent(
      query
    )}&page=${page}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    searchResults.set(data.articles || []);
    return data;
  } catch (error) {
    console.error("Error performing search:", error);
    searchResults.set([]);
  } finally {
    isSearching.set(false);
  }
}
