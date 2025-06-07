import { Stack } from "expo-router";
import "./globals.css"
import {AuthProvider} from './../context/AuthContex'

export default function RootLayout() {
  return <AuthProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} >
      <Stack.Screen
        name="login"
      />
      <Stack.Screen
        name="signup"
      />
      <Stack.Screen
        name="(tabs)"
      />
      <Stack.Screen
        name="recipes/[id]"
      />
    </Stack>
  </AuthProvider>
}
