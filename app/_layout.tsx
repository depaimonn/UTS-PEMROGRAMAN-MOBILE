// app/_layout.tsx
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useThemeStore } from '../store/themeStore';

export default function RootLayout() {
  const { theme } = useThemeStore();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-order" options={{ title: 'Tambah Pesanan Baru 📝', presentation: 'modal' }} />
        <Stack.Screen name="order/[id]" options={{ title: 'Detail Pesanan 🧾' }} />
        
        {/* [BARU] Definisikan layar modal untuk mengedit layanan */}
        <Stack.Screen
          name="edit-service"
          options={{ title: 'Edit Harga Layanan ✏️', presentation: 'modal' }}
        />
      </Stack>
    </ThemeProvider>
  );
}