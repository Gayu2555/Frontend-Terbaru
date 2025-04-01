<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { formatDateWithTime } from '$lib/utils';
  import Navbar from '$lib/components/Navbar.svelte';
  
  export let data;
  
  let article = null;
  let error = null;
  let isClient = false;
  let siteUrl = '';
  
  // Inisialisasi artikel setelah data tersedia
  $: {
    if (data && data.article) {
      article = data.article;
    }
  }
  
  // Fungsi-fungsi berbasis browser hanya dijalankan setelah komponen dimount
  onMount(() => {
    isClient = true;
    siteUrl = window.location.origin;
    
    if (!article) {
      error = "Artikel tidak ditemukan atau terjadi kesalahan saat memuat data.";
    }
  });
  
  // Modifikasi fungsi share agar memeriksa ketersediaan window
  function shareOnWhatsApp() {
    if (!isClient) return;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + url)}`, '_blank');
  }
  
  function shareOnFacebook() {
    if (!isClient) return;
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }
  
  function shareOnTwitter() {
    if (!isClient) return;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`, '_blank');
  }
  
  function copyLink() {
    if (!isClient) return;
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('Link berhasil disalin!');
      })
      .catch(err => {
        console.error('Gagal menyalin link: ', err);
      });
  }
  
  let isShareMenuOpen = false;
  
  function toggleShareMenu() {
    isShareMenuOpen = !isShareMenuOpen;
  }
</script>

<svelte:head>
  <title>{article ? article.title : 'Artikel Tidak Ditemukan'} - Urbansiana</title>
  
  {#if article}
    <!-- SEO Meta Tags -->
    <meta name="title" content="{article.title} - Urbansiana">
    <meta name="description" content="{article.description}">
    <meta name="keywords" content="{article.category}, berita, urbansiana, {article.category_slug}, wotaku, anime, manga, internasional, nasional">
    <meta name="author" content="{article.author_name || 'Urbansiana'}">
    <!-- Open Graph (OG) Meta Tags -->
    <meta property="og:title" content="{article.title}">
    <meta property="og:description" content="{article.description}">
    <meta property="og:image" content="{article.image}">
    <meta property="og:url" content="{isClient ? window.location.href : `https://www.urbansiana.com/article/${article.slug}`}">
    <meta property="article:published_time" content="{article.date_published}">
    <meta property="article:section" content="{article.category}">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{article.title}">
    <meta name="twitter:description" content="{article.description}">
    <meta name="twitter:image" content="{article.image}">
  {/if}
</svelte:head>

<Navbar />
<main class="container mx-auto px-4 py-4 max-w-4xl">
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{error}</p>
      <a href="/" class="mt-2 inline-block bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
        Kembali ke Beranda
      </a>
    </div>
  {:else if $page.error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{$page.error.message || 'Terjadi kesalahan saat memuat artikel'}</p>
      <a href="/" class="mt-2 inline-block bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
        Kembali ke Beranda
      </a>
    </div>
  {:else if article}
    <div class="mb-4">
      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-600 mb-3">
        <a href="/" class="hover:text-red-600">Beranda</a>
        <span class="mx-2">›</span>
        <a href="/{article.category_slug || '#'}" class="hover:text-red-600">{article.category}</a>
      </nav>
      
      <!-- Article Title -->
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{article.title}</h1>
      
      <!-- Source and Date -->
      <div class="mb-3">
  <div class="text-yellow-500 font-medium">Urbansiana Media Infotainment</div>
  <div class="text-gray-800 text-sm">{article.author_name || 'Portal Berita'}</div>
  <div class="text-gray-400 text-sm mt-1">
    {#if article.date_published}
      {formatDateWithTime(article.date_published)}
    {/if}
  </div>
</div>
      
      <!-- Share Buttons (tampilkan hanya jika di client side) -->
      {#if isClient}
        <div class="flex items-center mb-4">
          <div class="text-sm mr-2">Bagikan:</div>
          <div class="flex space-x-2">
            <button 
              on:click={shareOnWhatsApp}
              class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
              aria-label="Bagikan ke WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-14.382c-2.72 0-5.184 1.1-6.97 2.887-1.788 1.786-2.888 4.25-2.888 6.97 0 1.216.216 2.406.647 3.528l-1.091 4.028 4.028-1.09c1.122.43 2.312.646 3.528.646 2.72 0 5.184-1.1 6.97-2.887 1.788-1.786 2.888-4.25 2.888-6.97s-1.1-5.184-2.887-6.97c-1.787-1.787-4.251-2.887-6.971-2.887zm0 2c2.22 0 4.236.898 5.556 2.22 1.319 1.32 2.218 3.336 2.218 5.556 0 2.22-.9 4.236-2.219 5.556-1.32 1.319-3.336 2.218-5.556 2.218-1.059 0-2.081-.187-3.026-.547l-4.244 1.147 1.147-4.244c-.36-.945-.547-1.967-.547-3.026 0-2.22.898-4.236 2.22-5.556 1.32-1.319 3.336-2.218 5.556-2.218z"/>
              </svg>
            </button>
            <button 
              on:click={shareOnFacebook}
              class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
              aria-label="Bagikan ke Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </button>
            <button 
              on:click={shareOnTwitter}
              class="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600"
              aria-label="Bagikan ke Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
            <button 
              on:click={copyLink}
              class="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center hover:bg-gray-600"
              aria-label="Salin tautan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Featured Image with Figcaption -->
    <figure class="mb-6">
      <img 
        src={article.image || "/placeholder.svg"} 
        alt={article.title} 
        class="w-full h-auto object-cover rounded"
      />
      <figcaption class="text-sm text-gray-600 italic mt-2 px-2">
        {article.description}
      </figcaption>
    </figure>
    
    <!-- Article Content -->
    <div class="prose max-w-none">
      {#if article.content}
        {@html article.content}
      {:else}
        <p class="text-gray-700">{article.description}</p>
        <p class="text-gray-500 italic mt-4">Konten lengkap artikel tidak tersedia.</p>
      {/if}
    </div>
    
    <!-- Tags -->
    <div class="mt-8 pt-4 border-t">
      <div class="flex flex-wrap gap-2">
        <span class="text-sm text-gray-600 mr-2">Tag:</span>
        <a href="#" class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200">
          {article.category}
        </a>
        <a href="#" class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200">
          Berita
        </a>
        <a href="#" class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200">
          Indonesia
        </a>
      </div>
    </div>
    
    <!-- Back Button -->
    <div class="mt-8">
      <a href="/" class="inline-flex items-center text-red-600 hover:text-red-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Kembali ke Beranda
      </a>
    </div>
  {:else}
    <div class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
    </div>
  {/if}
</main>

<footer class="bg-gray-800 text-white py-6 mt-10">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row justify-between items-center">
      <div class="mb-4 md:mb-0">
        <h2 class="text-xl font-bold">Urbansiana</h2>
        <p class="text-gray-400">Sumber berita terpercaya</p>
      </div>
      
      <div class="flex space-x-4">
        <a href="#" class="text-gray-400 hover:text-white">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
          </svg>
        </a>
        <a href="#" class="text-gray-400 hover:text-white">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
          </svg>
        </a>
        <a href="#" class="text-gray-400 hover:text-white">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path>
          </svg>
        </a>
      </div>
    </div>
    
    <div class="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
      <p>&copy; {new Date().getFullYear()} Urbansiana. All rights reserved.</p>
    </div>
  </div>
</footer>

<style>
  /* Styling untuk konten artikel */
  :global(.prose) {
    color: rgb(30 41 59);
  }
  
  :global(.prose h2) {
    font-size: 1.25rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }
  
  :global(.prose h3) {
    font-size: 1.125rem;
    font-weight: 700;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  :global(.prose p) {
    margin-bottom: 1rem;
    line-height: 1.625;
  }
  
  :global(.prose img) {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
  }
  
  :global(.prose a) {
    color: rgb(220 38 38);
    text-decoration: underline;
  }
  
  :global(.prose a:hover) {
    color: rgb(185 28 28);
  }
  
  :global(.prose ul) {
    list-style-type: disc;
    padding-left: 1.25rem;
    margin-bottom: 1rem;
  }
  
  :global(.prose ol) {
    list-style-type: decimal;
    padding-left: 1.25rem;
    margin-bottom: 1rem;
  }
  
  :global(.prose blockquote) {
    border-left-width: 4px;
    border-color: rgb(209 213 219);
    padding-left: 1rem;
    font-style: italic;
    color: rgb(75 85 99);
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
</style>