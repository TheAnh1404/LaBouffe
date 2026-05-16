import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from '../context/CartContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { FavoritesProvider } from '../context/FavoritesContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Component xử lý logic redirect dựa trên trạng thái đăng nhập.
 * Nếu đã login → vào (tabs)/home
 * Nếu chưa login → vào (auth)/welcome
 */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Đang check auth, chưa làm gì

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const isSplash = segments[0] === 'splash' || !segments[0];

    // Nếu đang ở splash/onboarding → để flow tự nhiên, không redirect
    if (isSplash || inOnboarding) return;

    if (!isAuthenticated && !inAuthGroup) {
      // Chưa đăng nhập mà cố vào app → redirect về Welcome
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      // Đã đăng nhập mà ở trang auth → redirect về Home
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, loading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AuthGate>
              <Stack screenOptions={{ headerShown: false }}>
                {/* Onboarding flow */}
                <Stack.Screen name="onboarding" />

                {/* Auth flow */}
                <Stack.Screen name="(auth)" />

                {/* Main app tabs */}
                <Stack.Screen name="(tabs)" />
              </Stack>
            </AuthGate>
            <StatusBar style="auto" />
          </ThemeProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}