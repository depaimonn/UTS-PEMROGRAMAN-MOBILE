// store/serviceStore.ts
import { create } from 'zustand';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

// Definisikan tipe untuk satu item layanan/harga
export interface Service {
  id: number;
  name: string;
  category: string;
  serviceType: 'kiloan' | 'satuan';
  priceRegular: number;
  priceKilat: number;
}

// Definisikan state dan action untuk store ini
interface ServiceState {
  services: Service[];
  loading: boolean;
  fetchServices: () => Promise<void>;
  updateService: (id: number, newPrices: { priceRegular: number; priceKilat: number }) => Promise<void>;
}

// Buat store Zustand untuk layanan
export const useServiceStore = create<ServiceState>((set, get) => ({
  // State Awal
  services: [],
  loading: false,

  // Action untuk mengambil semua data layanan dari Supabase
  fetchServices: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.from('services').select('*').order('id');
      if (error) throw error;
      
      // Map data dari format database (snake_case) ke format aplikasi (camelCase)
      const mappedData: Service[] = data.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        serviceType: s.service_type,
        priceRegular: s.price_regular,
        priceKilat: s.price_kilat,
      }));
      set({ services: mappedData });

    } catch (error: any) {
      Alert.alert('Error Mengambil Data Layanan', error.message);
    } finally {
      set({ loading: false });
    }
  },

  // Action untuk mengupdate harga sebuah layanan di Supabase
  updateService: async (id, newPrices) => {
    try {
      // Kirim perintah UPDATE dengan data baru (diubah ke snake_case)
      const { error } = await supabase
        .from('services')
        .update({
          price_regular: newPrices.priceRegular,
          price_kilat: newPrices.priceKilat,
        })
        .eq('id', id);

      if (error) throw error;

      Alert.alert('Sukses ✅', 'Harga layanan berhasil diperbarui.');
      await get().fetchServices(); // Ambil ulang data terbaru untuk refresh
    } catch (error: any) {
      Alert.alert('Error Memperbarui Harga', error.message);
    }
  },
}));