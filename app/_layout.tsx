import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useThemeStore } from '../store/themeStore';

export default function RootLayout() {
  const { theme } = useThemeStore();

  // ThemeProvider akan menerapkan tema terang atau gelap ke seluruh aplikasi
  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Halaman utama adalah layout (tabs) dan headernya disembunyikan */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Definisikan layar modal untuk tambah pesanan */}
        <Stack.Screen
          name="add-order"
          options={{ title: 'Tambah Pesanan Baru 📝', presentation: 'modal' }}
        />
        {/* Definisikan layar detail pesanan */}
        <Stack.Screen
          name="order/[id]"
          options={{ title: 'Detail Pesanan 🧾' }}
        />
      </Stack>
    </ThemeProvider>
  );
}