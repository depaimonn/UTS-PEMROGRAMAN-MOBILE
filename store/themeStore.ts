import { create } from 'zustand';

// Definisikan tipe untuk state dan action tema
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Buat store Zustand untuk tema
export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light', // State awal
  // Action untuk mengganti tema
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}));