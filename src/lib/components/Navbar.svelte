<script lang="ts">
  import { writable } from 'svelte/store';
  import { fly } from 'svelte/transition';
  import { X, Search } from 'lucide-svelte';
  import lozad from 'lozad';
  import { onMount } from 'svelte';
  import SearchComponent from '$lib/components/SearchComponent.svelte';
  import logoPath from '$lib/assets/logo.png';

  // Manajemen status untuk visibilitas pencarian dan input
  const pencarianSelulerTerlihat = writable(false);

  // Toggle visibilitas pencarian seluler
  function togglePencarianSeluler() {
    pencarianSelulerTerlihat.update(v => !v);
  }

  // Tutup pencarian seluler
  function tutupPencarianSeluler() {
    pencarianSelulerTerlihat.set(false);
  }
  
  onMount(() => {
    // Inisialisasi lozad untuk lazy loading gambar logo
    const observer = lozad('.lozad', {
      rootMargin: '10px 0px',
      threshold: 0.1,
      loaded: function(el) {
        el.classList.add('loaded');
      }
    });
    observer.observe();
  });
</script>

<nav class="bg-white shadow-lg sticky top-0 z-50">
  <div class="container mx-auto max-w-5xl px-4">
    <div class="flex items-center justify-between h-16 sm:h-20">
      <!-- Logo -->
      <a 
        href="/" 
        class="flex-shrink-0 flex items-center cursor-pointer"
        aria-label="Beranda"
      >
        <div class="w-32 sm:w-40 md:w-48 h-auto relative">
          <img 
            src={logoPath || "/placeholder.svg"} 
            alt="Logo" 
            class="lozad w-full h-auto object-contain"
            data-src={logoPath || "/placeholder.svg"}
            loading="lazy"
          >
          <noscript>
            <img 
              src={logoPath || "/placeholder.svg"} 
              alt="Logo" 
              class="w-full h-auto object-contain"
            >
          </noscript>
        </div>
      </a>

      <!-- Toggle Pencarian Seluler -->
      <button 
        on:click={togglePencarianSeluler} 
        class="md:hidden text-gray-600 hover:text-primary transition-colors p-2"
        aria-label="Toggle Pencarian Seluler"
      >
        <Search size={22} />
      </button>

      <!-- Pencarian Desktop -->
      <div class="hidden md:flex items-center justify-center flex-1 mx-4">
        <SearchComponent isMobile={false} />
      </div>
    </div>

    <!-- Overlay Pencarian Seluler -->
    {#if $pencarianSelulerTerlihat}
      <div 
        transition:fly="{{ y: 20, duration: 300 }}"
        class="fixed inset-0 bg-white z-50 md:hidden"
      >
        <div class="p-4 flex flex-col h-full">
          <div class="flex justify-between items-center">
            <!-- Logo di Overlay -->
            <div class="w-40 sm:w-40 h-auto">
              <img 
                data-src={logoPath || "/placeholder.svg"} 
                alt="Logo" 
                class="lozad w-full h-auto object-contain"
              >
              <noscript>
                <img 
                  src={logoPath || "/placeholder.svg"} 
                  alt="Logo" 
                  class="w-full h-auto object-contain"
                >
              </noscript>
            </div>
            
            <!-- Tombol Tutup -->
            <button 
              on:click={tutupPencarianSeluler}
              class="text-gray-600 hover:text-primary p-2"
              aria-label="Tutup Pencarian"
            >
              <X size={24} />
            </button>
          </div>

          <!-- Form Pencarian Seluler menggunakan komponen SearchComponent -->
          <div class="mt-8 flex-grow">
            <SearchComponent 
              isMobile={true} 
              onClose={tutupPencarianSeluler} 
            />
          </div>
        </div>
      </div>
    {/if}
  </div>
</nav>

<style>
  /* Menghapus batasan max-height untuk memastikan logo dapat ditampilkan dengan ukuran penuh */
  @media (max-width: 640px) {
    :global(.container a[aria-label="Beranda"] div) {
      height: auto !important;
      min-width: 8rem; /* Memastikan lebar minimum */
    }
    
    :global(img[alt="Logo"]) {
      width: 100% !important;
      height: auto !important;
      transform: scale(1); /* Memastikan ukuran asli ditampilkan */
    }
  }
  
  /* Styling untuk lazy-loaded images */
  :global(.lozad) {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  :global(.lozad.loaded) {
    opacity: 1;
  }
</style>