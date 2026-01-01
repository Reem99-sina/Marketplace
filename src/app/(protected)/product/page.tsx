"use client";

import { useEffect, useState } from "react";
import { ProductDoc } from "@/models/Product";
import {
  fetchProducts,
  addProduct,
  NewProductInput,
  deleteProduct,
  fetchAllProducts,
} from "@/actions/productAction";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StoreDoc } from "@/models/Store";
import { fetchStore } from "@/actions/storeAction";
import { useUser } from "@/contexts/use-user";
import { Role } from "@/models/Role";
import { CardProduct } from "@/components/store/CardProduct";
import { ResponseMessage } from "@/types/auth";

export default function StoreProductsPage() {
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProductInput>({
    name: "",
    price: "",
  });
  const { user } = useUser();
  const [store, setStore] = useState<StoreDoc | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      if (user?.store) {
        const prods = await fetchProducts({ storeId: user?.store });
        setProducts(prods);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const loadUserProducts = async () => {
    setLoading(true);
    try {
      const prods = await fetchAllProducts();
      setProducts(prods);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const getStore = async () => {
    setLoading(true);
    try {
      const s = await fetchStore();
      setStore(s as StoreDoc);
    } catch (err) {
      console.log(err);
      setStore(null);
    } finally {
      setLoading(false);
    }
  };
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;

    try {
      const product = await addProduct(newProduct);
      setProducts([product, ...products]);
      setNewProduct({ name: "", price: "" });
      setIsDialogOpen(false);
    } catch (err) {
      alert((err as ResponseMessage)?.message || "something wrong");
      setIsDialogOpen(false);
    }
  };
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(productId);
      setProducts(
        products.filter((p) => p._id?.toString() != productId?.toString())
      );
    } catch (err) {
      alert((err as ResponseMessage)?.message || "something wrong");
    }
  };
  useEffect(() => {
    getStore();
  }, []);

  useEffect(() => {
    if (store?._id) {
      loadProducts();
    }
  }, [store]);

  return (
    <div className="p-6 w-full">
      {user?.role != Role.CUSTOMER ? (
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-bold">My Store Products</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <Input
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </div>

              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-bold"> Products</h1>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <CardProduct
              product={product}
              handleDeleteProduct={handleDeleteProduct}
              key={product?._id?.toString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
