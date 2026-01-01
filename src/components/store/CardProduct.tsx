"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ProductDoc } from "@/models/Product";
import Image from "next/image";
import { Button } from "../ui/button";
import { ShoppingCart, Slash, Star, Trash2 } from "lucide-react";
import { Schema } from "mongoose";
import { useUser } from "@/contexts/use-user";
import { Role } from "@/models/Role";
import { addToCart, fetchCart } from "@/actions/cartAction";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/contexts/useCart";
import { ResponseMessage } from "@/types/auth";

export function CardProduct({
  product,
  handleDeleteProduct,
}: {
  product: ProductDoc;
  handleDeleteProduct: (productId: string) => Promise<void>;
}) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { refreshCart } = useCart();

  const handleAddToCart = async () => {
    if (!user) {
      setError("You must be logged in to add products to cart");
      return;
    }
    setLoading(true);
    try {
      await addToCart({ productId: product._id?.toString(), quantity: 1 });
      setError(""); // Clear any previous error
      await refreshCart();
      alert("Product added to cart!"); // Simple feedback, you can replace with toast
    } catch (err) {
      setError((err as ResponseMessage)?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <Image
        src={"/defualtProduct.jpg"} // صورة افتراضية
        alt={product.name}
        className="w-full h-40 object-cover rounded-t-md"
        height={40}
        width={100}
      />
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>${product.price}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex gap-2">
          {product.isFeatured && <Star className="text-blue-500 w-5 h-5" />}
          {product.isArchived && <Slash className="text-red-500 w-5 h-5" />}
        </div>
        {user?.role != Role.CUSTOMER ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteProduct(product._id?.toString())}
          >
            <Trash2 className="w-4 h-4" /> {/* icon زر الحذف */}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={loading}
            className="relative"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            {loading ? "Adding..." : "Add to Cart"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
