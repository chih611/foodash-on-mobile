import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="desserts" options={{ title: 'Desserts', headerShown: false }} />
      <Stack.Screen name="matcha" options={{ title: 'Matcha', headerShown: false }} />
    </Stack>
  );
}
