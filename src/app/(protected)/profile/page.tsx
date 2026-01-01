"use client";
import { useUser } from "@/contexts/use-user";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, refetchUser } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) return;
    try {
      setLoading(true);

      // استدعاء API logout أو مسح الـ token
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      refetchUser();
      router.replace("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="p-4">No user logged in</p>;

  return (
    <div className="p-6  rounded-lg shadow w-full ">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <Button
        onClick={handleLogout}
        variant="destructive"
        className="mt-6"
        disabled={loading}
      >
        {loading ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
