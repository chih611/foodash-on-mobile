import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isUser, setIsUser] = useState<boolean | null>(null); // null = loading

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(" Authenticated:", user.email);
        setIsUser(true);
      } else {
        console.log(" Unauthenticated");
        setIsUser(false);
      }
      setIsAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!isAuthChecked || isUser === null) return;

    console.log("📍 Current pathname:", pathname);

    const isOnAuthPage = pathname === "/signIn" || pathname === "/signUp";

    if (!isUser && !isOnAuthPage) {
      console.log("🔁 Redirecting to /signIn");
      router.replace("/signIn");
    }
  }, [isAuthChecked, isUser, pathname]);

  // Show loading spinner
  if (!isAuthChecked || isUser === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F38B3C" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
