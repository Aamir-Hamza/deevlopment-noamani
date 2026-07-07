"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useAdminSessionGuard } from "@/lib/useAdminSessionGuard";
import { formatPrice } from "@/lib/priceUtils";
import { Plus, X, ShoppingBag, Flame, Leaf, Compass, Menu, Check, Pencil, Trash2 } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  imageHover: string;
  category: string;
  stock: number;
  assignedPages?: string[];
  galleryImages?: string[];
}

const availablePages = [
  "Bestsellers",
  "Fragrance",
  "Shop All",
];

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<"url" | "upload">(
    "url"
  );
  const [hoverImageUploadType, setHoverImageUploadType] = useState<
    "url" | "upload"
  >("url");
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    description: string;
    image: string;
    imageHover: string;
    category: string;
    stock: string;
    assignedPages: string[];
    galleryImages: (string | File)[];
  }>({
    name: "",
    price: "",
    description: "",
    image: "",
    imageHover: "",
    category: "",
    stock: "",
    assignedPages: [],
    galleryImages: [],
  });
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    price: string;
    description: string;
    image: string;
    imageHover: string;
    category: string;
    stock: string;
    assignedPages: string[];
    galleryImages: (string | File)[];
  }>({
    name: "",
    price: "",
    description: "",
    image: "",
    imageHover: "",
    category: "",
    stock: "",
    assignedPages: [],
    galleryImages: [],
  });
  const [activeTab, setActiveTab] = useState("products");
  const router = useRouter();
  const [showNavbarModal, setShowNavbarModal] = useState(false);
  const [navbarProducts, setNavbarProducts] = useState<{ id: string; name: string; slug: string; }[]>([]);
  const [navbarLoading, setNavbarLoading] = useState(false);
  const [navbarEdit, setNavbarEdit] = useState<any>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const [bestsellerProducts, setBestsellerProducts] = useState<{ id: string; name: string; slug: string; }[]>([]);
  const [bestsellerLoading, setBestsellerLoading] = useState(false);
  const [bestsellerEdit, setBestsellerEdit] = useState<any>(null);
  const bestsellerNameRef = useRef<HTMLInputElement>(null);
  const bestsellerSlugRef = useRef<HTMLInputElement>(null);
  const [fragranceProducts, setFragranceProducts] = useState<{ id: string; name: string; slug: string; }[]>([]);
  const [fragranceLoading, setFragranceLoading] = useState(false);
  const [fragranceEdit, setFragranceEdit] = useState<any>(null);
  const fragranceNameRef = useRef<HTMLInputElement>(null);
  const fragranceSlugRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Shop All');
  // State for gallery image upload type (url/upload) for Add and Edit forms
  const [galleryImageUploadType, setGalleryImageUploadType] = useState<("url" | "upload")[]>(["upload", "upload", "upload", "upload"]);
  const [editGalleryImageUploadType, setEditGalleryImageUploadType] = useState<("url" | "upload")[]>(["upload", "upload", "upload", "upload"]);

  // Sync editFormData.galleryImages with product.galleryImages when editProductId changes
  useEffect(() => {
    if (editProductId) {
      const product = products.find(p => p._id === editProductId);
      setEditFormData(prev => ({ ...prev, galleryImages: Array.isArray(product?.galleryImages) ? [...product.galleryImages!] : [] }));
    }
  }, [editProductId]);

  // Helper function to upload gallery image and update preview
  const handleGalleryImageUpload = async (
    file: File,
    index: number,
    formType: "add" | "edit"
  ) => {
    if (!file) return;
    const toastId = toast.loading("Uploading image...");
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    try {
      const response = await fetch("/api/products/upload-image", {
        method: "POST",
        body: formDataObj,
      });
      if (!response.ok) throw new Error("Image upload failed");
      const data = await response.json();
      const { imageUrl } = data;
      if (formType === "add") {
        setFormData((prev) => {
          const arr = prev.galleryImages ? [...prev.galleryImages] : [];
          arr[index] = imageUrl; // ONLY set the URL
          return { ...prev, galleryImages: arr };
        });
      } else {
        setEditFormData((prev) => {
          const arr = prev.galleryImages ? [...prev.galleryImages] : [];
          arr[index] = imageUrl; // ONLY set the URL
          return { ...prev, galleryImages: arr };
        });
      }
      toast.success("Image uploaded successfully", { id: toastId });
    } catch (error) {
      toast.error("Error uploading image", { id: toastId });
      console.error(error);
    }
  };

  useAdminSessionGuard();

  useEffect(() => {
    // Check if admin is logged in
    const adminInfo = localStorage.getItem("adminInfo");
    if (!adminInfo) {
      router.push("/admin/login");
      return;
    }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error("Error fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Only allow submit if all 4 gallery images are uploaded and are URLs
    const galleryImages = (formData.galleryImages || [])
      .map(img => typeof img === 'string' ? img : '')
      .filter(url =>
        url.startsWith('/product-images/') ||
        url.startsWith('http') ||
        url.startsWith('data:image/')
      );
    console.log('Submitting product (ADD):', {
      ...formData,
      galleryImages
    });
    if (galleryImages.length !== 4) {
      toast.error('Please upload all 4 images before submitting.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          assignedPages: formData.assignedPages,
          galleryImages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      toast.success("Product added successfully");
      setShowAddForm(false);
      setFormData(prev => ({
        ...prev,
        name: "",
        price: "",
        description: "",
        image: "",
        imageHover: "",
        category: "",
        stock: "",
        assignedPages: [],
        galleryImages: [],
      }));
      fetchProducts();
    } catch (error) {
      toast.error("Error adding product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  const handleEditClick = (product: Product) => {
    setEditProductId(product._id);
    setEditFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      imageHover: product.imageHover || "",
      category: product.category,
      stock: product.stock.toString(),
      assignedPages: product.assignedPages || [],
      galleryImages: Array.isArray(product.galleryImages) ? [...product.galleryImages] : [],
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id: string) => {
    setIsLoading(true);

    // Only allow submit if all 4 gallery images are uploaded and are URLs
    const galleryImages = (editFormData.galleryImages || [])
      .map(img => typeof img === 'string' ? img : '')
      .filter(url =>
        url.startsWith('/product-images/') ||
        url.startsWith('http') ||
        url.startsWith('data:image/')
      );
    console.log('Submitting product (EDIT):', {
      ...editFormData,
      galleryImages
    });
    if (galleryImages.length !== 4) {
      toast.error('Please upload all 4 images before saving.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editFormData,
          price: parseFloat(editFormData.price),
          stock: parseInt(editFormData.stock),
          assignedPages: editFormData.assignedPages,
          galleryImages,
        }),
      });
      if (!response.ok) throw new Error("Failed to update product");
      toast.success("Product updated successfully");
      setEditProductId(null);
      setEditFormData(prev => ({ ...prev, galleryImages: [] }));
      fetchProducts();
    } catch (error) {
      toast.error("Error updating product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditProductId(null);
    setEditFormData(prev => ({ ...prev, galleryImages: [] }));
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("adminInfo");
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleImageUpload = async (
    file: File,
    fieldToUpdate: "image" | "imageHover",
    formType: "add" | "edit"
  ) => {
    if (!file) return;

    const toastId = toast.loading("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/products/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      const { imageUrl } = data;

      if (formType === "add") {
        setFormData((prev) => ({ ...prev, [fieldToUpdate]: imageUrl }));
      } else {
        setEditFormData((prev) => ({ ...prev, [fieldToUpdate]: imageUrl }));
      }

      toast.success("Image uploaded successfully", { id: toastId });
    } catch (error) {
      toast.error("Error uploading image", { id: toastId });
      console.error(error);
    }
  };

  const fetchNavbarProducts = async () => {
    setNavbarLoading(true);
    const res = await fetch("/api/navbar-products");
    const data = await res.json();
    setNavbarProducts(data);
    setNavbarLoading(false);
  };

  const fetchBestsellerProducts = async () => {
    setBestsellerLoading(true);
    const res = await fetch("/api/navbar-bestsellers");
    const data = await res.json();
    setBestsellerProducts(data);
    setBestsellerLoading(false);
  };

  const fetchFragranceProducts = async () => {
    setFragranceLoading(true);
    const res = await fetch("/api/navbar-fragrance");
    const data = await res.json();
    setFragranceProducts(data);
    setFragranceLoading(false);
  };

  const handleNavbarCardClick = () => {
    setShowNavbarModal(true);
    fetchNavbarProducts();
    fetchBestsellerProducts();
    fetchFragranceProducts();
  };

  const handleNavbarAdd = async () => {
    if (!nameRef.current || !slugRef.current) return;
    const name = nameRef.current.value;
    const slug = slugRef.current.value;
    await fetch("/api/navbar-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    fetchNavbarProducts();
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('navbarProductsUpdated'));
    toast.success('Successfully added!');
  };

  const handleNavbarEdit = (item: any) => setNavbarEdit(item);
  const handleNavbarSave = async () => {
    if (!nameRef.current || !slugRef.current || !navbarEdit) return;
    const name = nameRef.current.value;
    const slug = slugRef.current.value;
    await fetch("/api/navbar-products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: navbarEdit.id, name, slug }),
    });
    setNavbarEdit(null);
    fetchNavbarProducts();
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('navbarProductsUpdated'));
    toast.success('Successfully edited!');
  };
  const handleNavbarDelete = async (id: string) => {
    await fetch("/api/navbar-products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchNavbarProducts();
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('navbarProductsUpdated'));
    toast.success('Successfully deleted!');
  };

  const handleBestsellerAdd = async () => {
    if (!bestsellerNameRef.current || !bestsellerSlugRef.current) return;
    const name = bestsellerNameRef.current.value;
    const slug = bestsellerSlugRef.current.value;
    await fetch("/api/navbar-bestsellers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    fetchBestsellerProducts();
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('navbarBestsellersUpdated'));
    toast.success('Successfully added!');
  };
  const handleBestsellerEdit = (item: any) => setBestsellerEdit(item);
  const handleBestsellerSave = async () => {
    if (!bestsellerNameRef.current || !bestsellerSlugRef.current || !bestsellerEdit) return;
    const name = bestsellerNameRef.current.value;
    const slug = bestsellerSlugRef.current.value;
    await fetch("/api/navbar-bestsellers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bestsellerEdit.id, name, slug }),
    });
    setBestsellerEdit(null);
    fetchBestsellerProducts();
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('navbarBestsellersUpdated'));
    toast.success('Successfully edited!');
  };
  const handleBestsellerDelete = async (id: string) => {
    await fetch("/api/navbar-bestsellers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchBestsellerProducts();
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('navbarBestsellersUpdated'));
    toast.success('Successfully deleted!');
  };

  const handleFragranceAdd = async () => {
    if (!fragranceNameRef.current || !fragranceSlugRef.current) return;
    const name = fragranceNameRef.current.value;
    const slug = fragranceSlugRef.current.value;
    await fetch("/api/navbar-fragrance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    fetchFragranceProducts();
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('navbarFragranceUpdated'));
    toast.success('Successfully added!');
  };
  const handleFragranceEdit = (item: any) => setFragranceEdit(item);
  const handleFragranceSave = async () => {
    if (!fragranceNameRef.current || !fragranceSlugRef.current || !fragranceEdit) return;
    const name = fragranceNameRef.current.value;
    const slug = fragranceSlugRef.current.value;
    await fetch("/api/navbar-fragrance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: fragranceEdit.id, name, slug }),
    });
    setFragranceEdit(null);
    fetchFragranceProducts();
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('navbarFragranceUpdated'));
    toast.success('Successfully edited!');
  };
  const handleFragranceDelete = async (id: string) => {
    await fetch("/api/navbar-fragrance", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchFragranceProducts();
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('navbarFragranceUpdated'));
    toast.success('Successfully deleted!');
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'Shop All') return product.assignedPages && product.assignedPages.includes('Shop All');
    if (selectedCategory === 'Bestsellers') return product.assignedPages && product.assignedPages.includes('Bestsellers');
    if (selectedCategory === 'Fragrance') return product.assignedPages && product.assignedPages.includes('Fragrance');
    return true;
  });

  // When Add Product form is closed, reset galleryImages
  useEffect(() => {
    if (!showAddForm) {
      setFormData(prev => ({ ...prev, galleryImages: [] }));
    }
  }, [showAddForm]);

  // Reset upload type state when forms are closed
  useEffect(() => {
    if (!showAddForm) setGalleryImageUploadType(["upload", "upload", "upload", "upload"]);
  }, [showAddForm]);
  useEffect(() => {
    if (!editProductId) setEditGalleryImageUploadType(["upload", "upload", "upload", "upload"]);
  }, [editProductId]);

  const categoryCards = [
    { key: 'Shop All', label: 'Shop All', sub: 'Total products', icon: ShoppingBag, count: products.length, accent: 'text-blue-400 bg-blue-500/10' },
    { key: 'Bestsellers', label: 'Bestsellers', sub: 'Bestseller products', icon: Flame, count: products.filter(p => p.assignedPages?.includes('Bestsellers')).length, accent: 'text-rose-400 bg-rose-500/10' },
    { key: 'Fragrance', label: 'Fragrance', sub: 'Fragrance products', icon: Leaf, count: products.filter(p => p.assignedPages?.includes('Fragrance')).length, accent: 'text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="hidden md:block"><AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} /></aside>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 p-4 sticky top-0 z-20 border-b border-slate-800">
        <Menu className="h-5 w-5 text-white" aria-label="Open sidebar" />
        <span className="font-semibold text-white">Admin Panel</span>
      </div>
      {/* Main Content */}
      <div className="flex-1 md:ml-64 ml-0 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Products</h1>
            <p className="text-sm text-slate-400 mt-1">Manage your catalogue and storefront placement</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            {showAddForm ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add product
              </>
            )}
          </button>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {categoryCards.map(({ key, label, sub, icon: Icon, count, accent }) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`text-left bg-slate-900 border rounded-xl p-6 transition-colors ${selectedCategory === key ? 'border-indigo-500' : 'border-slate-800 hover:border-slate-700'}`}
            >
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${accent} mb-4`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-400">{label}</p>
              <p className="text-2xl font-semibold text-white mt-1">{count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
            </button>
          ))}
          <button
            onClick={handleNavbarCardClick}
            className="text-left bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-colors"
          >
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-amber-400 bg-amber-500/10 mb-4">
              <Compass className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400">Navbar</p>
            <p className="text-2xl font-semibold text-white mt-1">{navbarProducts.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Navbar products</p>
          </button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900 p-4 md:p-8 rounded-xl shadow-lg mb-8 border border-slate-800"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
              Add New Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    placeholder="Product Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    placeholder="Product Price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    placeholder="Product Category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    placeholder="Product Stock"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Image Upload Type
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imageUploadType"
                      value="url"
                      checked={imageUploadType === "url"}
                      onChange={() => setImageUploadType("url")}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-slate-300">URL</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imageUploadType"
                      value="upload"
                      checked={imageUploadType === "upload"}
                      onChange={() => setImageUploadType("upload")}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-slate-300">Upload</span>
                  </label>
                </div>
              </div>
              {imageUploadType === "url" ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    placeholder="Product Image URL"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleImageUpload(e.target.files[0], "image", "add");
                      }
                    }}
                    className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  />
                  {formData.image && (
                    <p className="text-xs text-slate-400 mt-1">
                      Uploaded: {formData.image}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hover Image Upload Type
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hoverImageUploadType"
                      value="url"
                      checked={hoverImageUploadType === "url"}
                      onChange={() => setHoverImageUploadType("url")}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-slate-300">URL</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hoverImageUploadType"
                      value="upload"
                      checked={hoverImageUploadType === "upload"}
                      onChange={() => setHoverImageUploadType("upload")}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-slate-300">Upload</span>
                  </label>
                </div>
              </div>
              {hoverImageUploadType === "url" ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Second Image URL (on hover)
                  </label>
                  <input
                    type="text"
                    value={formData.imageHover}
                    onChange={(e) =>
                      setFormData({ ...formData, imageHover: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    placeholder="Second Image URL (on hover)"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Upload Second Image (on hover)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleImageUpload(
                          e.target.files[0],
                          "imageHover",
                          "add"
                        );
                      }
                    }}
                    className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  />
                  {formData.imageHover && (
                    <p className="text-xs text-slate-400 mt-1">
                      Uploaded: {formData.imageHover}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                  placeholder="Product Description"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Assigned Pages
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {availablePages.map((page) => (
                    <div key={page} className="flex items-center">
                      <input
                        type="checkbox"
                        id={page}
                        checked={formData.assignedPages.includes(page)}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedPages: prev.assignedPages.includes(page)
                              ? prev.assignedPages.filter((p) => p !== page)
                              : [...prev.assignedPages, page],
                          }))
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-700 rounded"
                      />
                      <label
                        htmlFor={page}
                        className="ml-2 text-sm text-slate-300"
                      >
                        {page}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {/* Gallery Images Section for Add Product */}
              <div className="mt-6 mb-4 p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                <label className="block text-sm font-bold text-slate-200 mb-2">
                  All 4 gallery images are required for the product detail page.
                </label>
                {[0,1,2,3].map(i => (
                  <div key={i} className="mb-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Img {i+1}</label>
                    <div className="flex items-center gap-4 mb-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`galleryImageUploadType-${i}`}
                          value="upload"
                          checked={galleryImageUploadType[i] === "upload"}
                          onChange={() => setGalleryImageUploadType(t => { const arr = [...t]; arr[i] = "upload"; return arr; })}
                          className="form-radio h-4 w-4 text-indigo-500"
                        />
                        <span className="ml-1 text-xs text-slate-400">Upload</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`galleryImageUploadType-${i}`}
                          value="url"
                          checked={galleryImageUploadType[i] === "url"}
                          onChange={() => setGalleryImageUploadType(t => { const arr = [...t]; arr[i] = "url"; return arr; })}
                          className="form-radio h-4 w-4 text-indigo-500"
                        />
                        <span className="ml-1 text-xs text-slate-400">URL</span>
                      </label>
                    </div>
                    {galleryImageUploadType[i] === "upload" ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const files = e.target.files;
                          if (files && files[0]) {
                            handleGalleryImageUpload(files[0], i, "add");
                          }
                        }}
                        className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={typeof formData.galleryImages[i] === 'string' ? formData.galleryImages[i] as string : ''}
                        onChange={e => {
                          const url = e.target.value;
                          setFormData(prev => {
                            const arr = prev.galleryImages ? [...prev.galleryImages] : [];
                            arr[i] = url;
                            return { ...prev, galleryImages: arr };
                          });
                        }}
                        className="block w-full text-sm text-slate-400 bg-slate-900 rounded px-2 py-1 border border-slate-700"
                      />
                    )}
                    {/* Always show preview if URL is present */}
                    {formData.galleryImages &&
                      typeof formData.galleryImages[i] === 'string' &&
                      ((formData.galleryImages[i] as string).startsWith('/product-images/') ||
                        (formData.galleryImages[i] as string).startsWith('http') ||
                        (formData.galleryImages[i] as string).startsWith('data:image/')) && (
                        <img src={formData.galleryImages[i] as string} alt={`Img${i+1}`} className="w-16 h-16 object-contain rounded mt-1 inline-block bg-white border border-gray-300" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Adding..." : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="w-full md:w-auto bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-slate-800 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Product Table Responsive Wrapper */}
        <div className="overflow-x-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-800 min-w-[600px]"
        >
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-slate-400"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-slate-400"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-slate-800 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-300">
                      <Link href={`/product/${product._id}`}>
                        <span className="hover:underline cursor-pointer">{product.name}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {formatPrice(product.price, 'INR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {editProductId === product._id ? (
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditSave(product._id)}
                            className="text-green-500 hover:text-green-400 transition-colors duration-200"
                          >
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleEditCancel}
                            className="text-slate-500 hover:text-slate-400 transition-colors duration-200"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Link href={`/product/${product._id}`}>
                            <button className="text-indigo-500 hover:underline">View</button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditClick(product)}
                            className="text-blue-500 hover:text-blue-400 transition-colors duration-200"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product._id)}
                            className="text-red-500 hover:text-red-400 transition-colors duration-200"
                          >
                            Delete
                          </motion.button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
        </div>

        {editProductId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEditProductId(null)}
          >
            <div
              className="bg-slate-900 p-8 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-800 text-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Edit Product
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editProductId) handleEditSave(editProductId);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      required
                      name="stock"
                      value={editFormData.stock}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Image Upload Type
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editImageUploadType"
                        value="url"
                        checked={imageUploadType === "url"}
                        onChange={() => setImageUploadType("url")}
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-2 text-slate-300">URL</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editImageUploadType"
                        value="upload"
                        checked={imageUploadType === "upload"}
                        onChange={() => setImageUploadType("upload")}
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-2 text-slate-300">Upload</span>
                    </label>
                  </div>
                </div>
                {imageUploadType === "url" ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      required
                      name="image"
                      value={editFormData.image}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleImageUpload(e.target.files[0], "image", "edit");
                        }
                      }}
                      className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                    />
                    {editFormData.image && (
                      <p className="text-xs text-slate-400 mt-1">
                        Uploaded: {editFormData.image}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Hover Image Upload Type
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editHoverImageUploadType"
                        value="url"
                        checked={hoverImageUploadType === "url"}
                        onChange={() => setHoverImageUploadType("url")}
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-2 text-slate-300">URL</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editHoverImageUploadType"
                        value="upload"
                        checked={hoverImageUploadType === "upload"}
                        onChange={() => setHoverImageUploadType("upload")}
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-2 text-slate-300">Upload</span>
                    </label>
                  </div>
                </div>
                {hoverImageUploadType === "url" ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Second Image URL (on hover)
                    </label>
                    <input
                      type="text"
                      name="imageHover"
                      value={editFormData.imageHover}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                      placeholder="Second Image URL (on hover)"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Upload Second Image (on hover)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleImageUpload(
                            e.target.files[0],
                            "imageHover",
                            "edit"
                          );
                        }
                      }}
                      className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                    />
                    {editFormData.imageHover && (
                      <p className="text-xs text-slate-400 mt-1">
                        Uploaded: {editFormData.imageHover}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-slate-700 bg-slate-800 text-white p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 placeholder-slate-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Assigned Pages
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {availablePages.map((page) => (
                      <div key={page} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`edit-${page}`}
                          checked={editFormData.assignedPages.includes(page)}
                          onChange={() =>
                            setEditFormData((prev) => ({
                              ...prev,
                              assignedPages: prev.assignedPages.includes(page)
                                ? prev.assignedPages.filter((p) => p !== page)
                                : [...prev.assignedPages, page],
                            }))
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-700 rounded"
                        />
                        <label
                          htmlFor={`edit-${page}`}
                          className="ml-2 text-sm text-slate-300"
                        >
                          {page}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Gallery Images Section for Edit Product */}
                <div className="mt-6 mb-4 p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                  <label className="block text-sm font-bold text-slate-200 mb-2">
                    All 4 gallery images are required for the product detail page.
                  </label>
                  {[0,1,2,3].map(i => (
                    <div key={i} className="mb-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Img {i+1}</label>
                      <div className="flex items-center gap-4 mb-1">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`editGalleryImageUploadType-${i}`}
                            value="upload"
                            checked={editGalleryImageUploadType[i] === "upload"}
                            onChange={() => setEditGalleryImageUploadType(t => { const arr = [...t]; arr[i] = "upload"; return arr; })}
                            className="form-radio h-4 w-4 text-indigo-500"
                          />
                          <span className="ml-1 text-xs text-slate-400">Upload</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`editGalleryImageUploadType-${i}`}
                            value="url"
                            checked={editGalleryImageUploadType[i] === "url"}
                            onChange={() => setEditGalleryImageUploadType(t => { const arr = [...t]; arr[i] = "url"; return arr; })}
                            className="form-radio h-4 w-4 text-indigo-500"
                          />
                          <span className="ml-1 text-xs text-slate-400">URL</span>
                        </label>
                      </div>
                      {editGalleryImageUploadType[i] === "upload" ? (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const files = e.target.files;
                            if (files && files[0]) {
                              handleGalleryImageUpload(files[0], i, "edit");
                            }
                          }}
                          className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                        />
                      ) : (
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={typeof editFormData.galleryImages[i] === 'string' ? editFormData.galleryImages[i] as string : ''}
                          onChange={e => {
                            const url = e.target.value;
                            setEditFormData(prev => {
                              const arr = prev.galleryImages ? [...prev.galleryImages] : [];
                              arr[i] = url;
                              return { ...prev, galleryImages: arr };
                            });
                          }}
                          className="block w-full text-sm text-slate-400 bg-slate-900 rounded px-2 py-1 border border-slate-700"
                        />
                      )}
                      {/* Always show preview if URL is present */}
                      {editFormData.galleryImages &&
                        typeof editFormData.galleryImages[i] === 'string' &&
                        ((editFormData.galleryImages[i] as string).startsWith('/product-images/') ||
                          (editFormData.galleryImages[i] as string).startsWith('http') ||
                          (editFormData.galleryImages[i] as string).startsWith('data:image/')) && (
                          <img src={editFormData.galleryImages[i] as string} alt={`Img${i+1}`} className="w-16 h-16 object-contain rounded mt-1 inline-block bg-white border border-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-slate-800 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Navbar Modal */}
        {showNavbarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowNavbarModal(false)}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Navbar product placement</h2>
                <button className="text-slate-500 hover:text-slate-300 transition-colors" onClick={() => setShowNavbarModal(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Shop All Section */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 flex flex-col">
                  <h3 className="text-sm font-medium text-white mb-4">Shop All</h3>
                  {navbarLoading ? (
                    <div className="text-center py-8 text-sm text-slate-500">Loading...</div>
                  ) : (
                    <>
                      <ul className="mb-4 divide-y divide-slate-800 flex-1">
                        {navbarProducts.map((item: { id: string; name: string; slug: string }) => (
                          <li key={item.id} className="flex items-center justify-between py-2 group">
                            {navbarEdit && navbarEdit.id === item.id ? (
                              <div className="flex flex-col gap-2 w-full">
                                <input ref={nameRef} defaultValue={item.name} className="border border-slate-700 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 text-sm text-white bg-slate-900" />
                                <input ref={slugRef} defaultValue={item.slug} className="border border-slate-700 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 text-sm text-white bg-slate-900" />
                                <div className="flex gap-3">
                                  <button onClick={handleNavbarSave} className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center gap-1"><Check className="h-3.5 w-3.5" />Save</button>
                                  <button onClick={() => setNavbarEdit(null)} className="text-slate-500 hover:text-slate-300 text-xs font-medium">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="min-w-0">
                                  <span className="text-sm text-slate-200 truncate block">{item.name}</span>
                                  <span className="text-xs text-slate-500">/{item.slug}</span>
                                </div>
                                <div className="flex gap-2 ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleNavbarEdit(item)} className="text-slate-400 hover:text-indigo-400"><Pencil className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => handleNavbarDelete(item.id)} className="text-slate-400 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                                </div>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
                        <input ref={nameRef} placeholder="Name" className="border border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500" />
                        <input ref={slugRef} placeholder="Slug" className="border border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500" />
                        <button onClick={handleNavbarAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Add</button>
                      </div>
                    </>
                  )}
                </div>
                {/* Bestseller Section */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 flex flex-col">
                  <h3 className="text-sm font-medium text-white mb-4">Bestseller</h3>
                  {bestsellerLoading ? (
                    <div className="text-center py-8 text-sm text-slate-500">Loading...</div>
                  ) : (
                    <>
                      <ul className="mb-4 divide-y divide-slate-800 flex-1">
                        {bestsellerProducts.map((item: { id: string; name: string; slug: string }) => (
                          <li key={item.id} className="flex items-center justify-between py-2 group">
                            {bestsellerEdit && bestsellerEdit.id === item.id ? (
                              <div className="flex flex-col gap-2 w-full">
                                <input ref={bestsellerNameRef} defaultValue={item.name} className="border border-slate-700 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 text-sm text-white bg-slate-900" />
                                <input ref={bestsellerSlugRef} defaultValue={item.slug} className="border border-slate-700 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 text-sm text-white bg-slate-900" />
                                <div className="flex gap-3">
                                  <button onClick={handleBestsellerSave} className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center gap-1"><Check className="h-3.5 w-3.5" />Save</button>
                                  <button onClick={() => setBestsellerEdit(null)} className="text-slate-500 hover:text-slate-300 text-xs font-medium">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="min-w-0">
                                  <span className="text-sm text-slate-200 truncate block">{item.name}</span>
                                  <span className="text-xs text-slate-500">/{item.slug}</span>
                                </div>
                                <div className="flex gap-2 ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleBestsellerEdit(item)} className="text-slate-400 hover:text-indigo-400"><Pencil className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => handleBestsellerDelete(item.id)} className="text-slate-400 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                                </div>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
                        <input ref={bestsellerNameRef} placeholder="Name" className="border border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500" />
                        <input ref={bestsellerSlugRef} placeholder="Slug" className="border border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500" />
                        <button onClick={handleBestsellerAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Add</button>
                      </div>
                    </>
                  )}
                </div>
                {/* Fragrance Section */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 flex flex-col">
                  <h3 className="text-sm font-medium text-white mb-4">Fragrance</h3>
                  {fragranceLoading ? (
                    <div className="text-center py-8 text-sm text-slate-500">Loading...</div>
                  ) : (
                    <>
                      <ul className="mb-4 divide-y divide-slate-800 flex-1">
                        {fragranceProducts.map((item: { id: string; name: string; slug: string }) => (
                          <li key={item.id} className="flex items-center justify-between py-2 group">
                            {fragranceEdit && fragranceEdit.id === item.id ? (
                              <div className="flex flex-col gap-2 w-full">
                                <input ref={fragranceNameRef} defaultValue={item.name} className="border border-slate-700 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 text-sm text-white bg-slate-900" />
                                <input ref={fragranceSlugRef} defaultValue={item.slug} className="border border-slate-700 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 text-sm text-white bg-slate-900" />
                                <div className="flex gap-3">
                                  <button onClick={handleFragranceSave} className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center gap-1"><Check className="h-3.5 w-3.5" />Save</button>
                                  <button onClick={() => setFragranceEdit(null)} className="text-slate-500 hover:text-slate-300 text-xs font-medium">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="min-w-0">
                                  <span className="text-sm text-slate-200 truncate block">{item.name}</span>
                                  <span className="text-xs text-slate-500">/{item.slug}</span>
                                </div>
                                <div className="flex gap-2 ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleFragranceEdit(item)} className="text-slate-400 hover:text-indigo-400"><Pencil className="h-3.5 w-3.5" /></button>
                                  <button onClick={() => handleFragranceDelete(item.id)} className="text-slate-400 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                                </div>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
                        <input ref={fragranceNameRef} placeholder="Name" className="border border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500" />
                        <input ref={fragranceSlugRef} placeholder="Slug" className="border border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500" />
                        <button onClick={handleFragranceAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Add</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
