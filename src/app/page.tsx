"use client";

import { useState } from "react";

export default function AuthGate() {
  const [checking, setChecking] = useState(true);

  // useEffect(() => {
  //   if (user) {
  //     Cookie.set("user", JSON.stringify(user));
  //     setUser(user);
  //     router.push("/Home"); // إذا موجود بيانات المستخدم
  //   } else {
  //     router.push("/login"); // إذا مفيش بيانات
  //   }
  // }, [user]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking session...
      </div>
    );
  }

  return null; // بعد ما نخلص التحقق، الصفحة هتتغير
}
