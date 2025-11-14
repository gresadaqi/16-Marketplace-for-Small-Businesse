
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../components/AuthProvider";

export default function AuthLayout() {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && role === "client") {
      router.replace("/(client)");
    } else if (user && role === "business") {
      router.replace("/(business)");
    }
  }, [user, role]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
