// app/_layout.jsx
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "./components/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(client)" />
        <Stack.Screen name="(business)" />
      </Stack>
    </AuthProvider>
  );
}
