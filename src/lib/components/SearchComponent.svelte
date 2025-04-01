<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Search, X, Loader2 } from 'lucide-svelte';
  import lozad from 'lozad';
  import { 
    searchQuery, 
    searchSuggestions, 
    isSearching, 
    showSuggestions,
    fetchSuggestions,
    performSearch
  } from '$lib/stores/searchStore';
  
  // Props
  export let isMobile = false;
  export let onClose = () => {};
  
  // Lozad observer initialization
  let observer: any;
  
  // Debounce timer
  let debounceTimer: ReturnType<typeof setTimeout>;
  
  // Search form element
  let searchForm: HTMLFormElement;
  
  // Click outside untuk menutup suggestions
  function handleClickOutside(event: MouseEvent) {
    if (searchForm && !searchForm.contains(event.target as Node)) {
      $showSuggestions = false;
    }
  }
  
  // Debounce untuk pencarian saran
  function handleInputChange() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if ($searchQuery.length > 0) {
        fetchSuggestions($searchQuery);
      } else {
        $showSuggestions = false;
        $searchSuggestions = [];
      }
    }, 300);
  }
  
  // Tangani pengiriman pencarian
  async function handleSubmit(event: Event) {
    event.preventDefault();
    $showSuggestions = false;
    
    if ($searchQuery.trim()) {
      const result = await performSearch($searchQuery);
      
      // Jika mobile, tutup overlay setelah pencarian
      if (isMobile) {
        onClose();
      }
      
      // Navigasi ke halaman hasil pencarian
      window.location.href = `/search?q=${encodeURIComponent($searchQuery)}`;
    }
  }
  
  // Menangani klik pada saran pencarian
  function handleSuggestionClick(suggestion: string) {
    $searchQuery = suggestion;
    $showSuggestions = false;
    handleSubmit(new Event('submit'));
  }
  
  onMount(() => {
    // Inisialisasi lozad untuk lazy loading
    observer = lozad('.lozad', {
      rootMargin: '10px 0px',
      threshold: 0.1,
      loaded: function(el: HTMLElement) {
        el.classList.add('loaded');
      }
    });
    observer.observe();
    
    // Tambahkan event listener untuk click outside
    document.addEventListener('click', handleClickOutside);
  });
  
  onDestroy(() => {
    clearTimeout(debounceTimer);
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<form 
  bind:this={searchForm}
  on:submit={handleSubmit}
  class="relative {isMobile ? 'w-full' : 'w-full max-w-md'}"
>
  <div class="relative group">
    <input 
      type="search" 
      bind:value={$searchQuery}
      on:input={handleInputChange}
      on:focus={() => {
        if ($searchQuery && $searchSuggestions.length > 0) {
          $showSuggestions = true;
        }
      }}
      placeholder="Cari artikel..."
      class="w-full px-4 py-{isMobile ? '3' : '2'} pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-{isMobile ? 'base' : 'sm'}"
      autocomplete="off"
    >
    
    <button 
      type="submit"
      class="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-500 group-focus-within:text-primary"
      aria-label="Kirim Pencarian"
    >
      {#if $isSearching}
        <Loader2 size={isMobile ? 22 : 18} class="animate-spin" />
      {:else}
        <Search size={isMobile ? 22 : 18} />
      {/if}
    </button>
  </div>
  
  <!-- Suggestions Dropdown -->
  {#if $showSuggestions && $searchSuggestions.length > 0}
    <div 
      transition:fly={{ y: 10, duration: 200 }}
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
    >
      <ul>
        {#each $searchSuggestions as suggestion}
          <li>
            <button 
              type="button"
              on:click={() => handleSuggestionClick(suggestion)}
              class="w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-800 truncate"
            >
              {suggestion}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</form>