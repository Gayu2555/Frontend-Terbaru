// Fungsi untuk mendapatkan semua kategori
export async function getCategories() {
  try {
    const response = await fetch("/api/categories");
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
}

// Mendapatkan kategori berdasarkan ID
export async function getCategoryById(id: string) {
  try {
    const response = await fetch(`/api/categories/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return { category: null };
  }
}

// Mendapatkan kategori berdasarkan slug
export async function getCategoryBySlug(slug: string) {
  try {
    const response = await fetch(`/api/categories/slug/${slug}`);
    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return { category: null };
  }
}

//
// Membuat kategori baru
export async function createCategory(categoryData: {
  name: string;
  slug: string;
  description?: string;
}) {
  try {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error("Failed to create category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: error.message };
  }
}

// Memperbarui kategori yang sudah ada
export async function updateCategory(
  id: string,
  categoryData: {
    name?: string;
    slug?: string;
    description?: string;
  }
) {
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      throw new Error("Failed to update category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: error.message };
  }
}

// Menghapus kategori
export async function deleteCategory(id: string) {
  try {
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: error.message };
  }
}

// Mendapatkan semua produk dalam kategori tertentu
export async function getProductsByCategory(categoryId: string) {
  try {
    const response = await fetch(`/api/categories/${categoryId}/products`);

    if (!response.ok) {
      throw new Error("Failed to fetch products for category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return { products: [] };
  }
}

// Mendapatkan jumlah produk dalam kategori tertentu
export async function getCategoryProductCount(categoryId: string) {
  try {
    const response = await fetch(`/api/categories/${categoryId}/count`);

    if (!response.ok) {
      throw new Error("Failed to fetch category product count");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching category product count:", error);
    return { count: 0 };
  }
}
