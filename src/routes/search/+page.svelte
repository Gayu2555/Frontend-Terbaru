  <script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { fly } from 'svelte/transition';
  import { Search, Filter, Loader2 } from 'lucide-svelte';
  import { 
    searchQuery, 
    searchResults,
    isSearching,
    performSearch
  } from '$lib/stores/searchStore';
  
  // Import kategori
  import { getCategories } from '$lib/api/categories';
  
  // State lokal
  let categories = [];
  let loading = true;
  let currentPage = 1;
  let totalPages = 1;
  let selectedCategory = '';
  let pagination = null;
  let observer: any;
  
  // Dapatkan query dari URL
  $: query = $page.url.searchParams.get('q') || '';
  
  // Fungsi untuk memuat data kategori
  async function loadCategories() {
    try {
      const response = await getCategories();
      categories = response.categories || [];
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }
  
  // Fungsi untuk melakukan pencarian
  async function search() {
    loading = true;
    $searchQuery = query;
    
    try {
      const result = await performSearch(query, selectedCategory, currentPage);
      pagination = result?.pagination || null;
      totalPages = pagination?.totalPages || 1;
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      loading = false;
      // Reinisialisasi lozad setelah konten baru dimuat
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          if (observer) {
            observer.observe();
          }
        }, 100);
      }
    }
  }
  
  // Fungsi untuk mengubah halaman
  function changePage(page: number) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    search();
    // Scroll ke atas halaman
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  // Fungsi untuk mengubah kategori
  function changeCategory(categoryId: string) {
    selectedCategory = categoryId;
    currentPage = 1;
    search();
  }
  
  // Fungsi untuk memuat lozad hanya di sisi client
  function initLozad() {
    // Pastikan kode ini hanya berjalan di browser
    if (typeof window === 'undefined') return;
    
    import('lozad').then((lozadModule) => {
      const lozad = lozadModule.default;
      observer = lozad('.lozad', {
        rootMargin: '10px 0px',
        threshold: 0.1,
        loaded: function(el: HTMLElement) {
          el.classList.add('loaded');
        }
      });
      
      observer.observe();
    });
  }
  
  onMount(async () => {
    // Load categories
    await loadCategories();
    
    // Jika ada query di URL, lakukan pencarian
    if (query) {
      await search();
    } else {
      loading = false;
    }
    
    // Inisialisasi lozad hanya di sisi client
    initLozad();
  });
  
  // Watch untuk perubahan query atau category
  $: if ((query || selectedCategory) && typeof window !== 'undefined') {
    // Perbarui URL jika query berubah
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    if (selectedCategory) {
      url.searchParams.set('category', selectedCategory);
    } else {
      url.searchParams.delete('category');
    }
    window.history.replaceState({}, '', url.toString());
  }
</script>

<svelte:head>
  <title>Hasil Pencarian: {query} | Nama Situs</title>
  <meta name="description" content="Hasil pencarian untuk '{query}' di Nama Situs" />
</svelte:head>

<div class="container mx-auto max-w-5xl px-4 py-8" in:fly={{ y: 20, duration: 300 }}>
  <h1 class="text-2xl font-bold mb-6">Hasil Pencarian: {query}</h1>
  
  <!-- Form Pencarian -->
  <div class="mb-8">
    <form on:submit|preventDefault={search} class="flex flex-col sm:flex-row gap-4">
      <div class="flex-grow relative">
        <input 
          type="search" 
          bind:value={query}
          placeholder="Cari artikel..." 
          class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button 
          type="submit" 
          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          aria-label="Cari"
        >
          <Search size={20} />
        </button>
      </div>
      
      <!-- Filter Kategori -->
      <div class="relative">
        <select 
          bind:value={selectedCategory}
          on:change={() => changeCategory(selectedCategory)}
          class="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none pr-10"
        >
          <option value="">Semua Kategori</option>
          {#each categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          <Filter size={16} />
        </div>
      </div>
    </form>
  </div>
  
  <!-- Loading Indicator -->
  {#if loading}
    <div class="flex justify-center items-center py-16">
      <Loader2 size={40} class="animate-spin text-primary" />
    </div>
  {:else}
    <!-- Hasil Pencarian -->
    {#if $searchResults.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $searchResults as article}
          <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <!-- Thumbnail dengan Lazy Loading -->
            <div class="aspect-video relative overflow-hidden">
              <img 
                data-src={article.thumbnail_url || '/placeholder.jpg'} 
                alt={article.title}
                class="lozad w-full h-full object-cover transition-transform hover:scale-105"
              />
              <noscript>
                <img 
                  src={article.thumbnail_url || '/placeholder.jpg'} 
                  alt={article.title}
                  class="w-full h-full object-cover"
                />
              </noscript>
              <div class="absolute bottom-0 left-0 bg-primary text-white text-xs px-2 py-1">
                {article.category_name}
              </div>
            </div>
            
            <!-- Konten -->
            <div class="p-4">
              <h2 class="text-lg font-semibold mb-2 line-clamp-2">
                <a 
                  href="/article/{article.slug}" 
                  class="hover:text-primary transition-colors"
                >
                  {article.title}
                </a>
              </h2>
              <p class="text-gray-600 text-sm line-clamp-3">
                {article.excerpt || article.content.slice(0, 150)}...
              </p>
              <div class="mt-3 text-xs text-gray-500">
                {new Date(article.date_published).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      <!-- Pagination -->
      {#if pagination && pagination.totalPages > 1}
        <div class="flex justify-center mt-10">
          <nav class="flex items-center space-x-1">
            <button 
              on:click={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              class="px-3 py-1 rounded-md border {currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}"
              aria-label="Previous page"
            >
              &laquo;
            </button>
            
            {#each Array(totalPages > 5 ? 5 : totalPages) as _, i}
              {@const pageNum = totalPages > 5 
                ? (currentPage > 2 
                  ? (currentPage + i > totalPages 
                    ? totalPages - 4 + i 
                    : currentPage - 2 + i) 
                  : i + 1) 
                : i + 1}
              
              <button 
                on:click={() => changePage(pageNum)}
                class="px-3 py-1 rounded-md border {currentPage === pageNum ? 'bg-primary text-white border-primary' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}"
              >
                {pageNum}
              </button>
            {/each}
            
            <button 
              on:click={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              class="px-3 py-1 rounded-md border {currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}"
              aria-label="Next page"
            >
              &raquo;
            </button>
          </nav>
        </div>
      {/if}
      
    {:else if query}
      <!-- Tidak ada hasil -->
      <div class="py-16 text-center">
        <div class="text-gray-400 mb-4">
          <Search size={48} class="inline-block" />
        </div>
        <h2 class="text-xl font-medium mb-2">Tidak ada hasil ditemukan</h2>
        <p class="text-gray-600">
          Tidak ada artikel yang cocok dengan "{query}".
          <br>
          Coba kata kunci lain atau filter yang berbeda.
        </p>
      </div>
    {:else}
      <!-- Belum mencari -->
      <div class="py-16 text-center">
        <div class="text-gray-400 mb-4">
          <Search size={48} class="inline-block" />
        </div>
        <h2 class="text-xl font-medium mb-2">Mulai pencarian</h2>
        <p class="text-gray-600">
          Masukkan kata kunci untuk menemukan artikel yang Anda cari.
        </p>
      </div>
    {/if}
  {/if}
</div>

<style>
  /* Styling untuk lazy-loaded images */
  :global(.lozad) {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  :global(.lozad.loaded) {
    opacity: 1;
  }
</style>