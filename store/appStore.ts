import { create } from 'zustand';
import { Alert } from 'react-native';
import { supabase } from '../lib/supabase';

// Tipe data untuk item satuan di dalam sebuah pesanan
export interface OrderItemSatuan {
  itemName: string;
  quantity: number;
  pricePerItem: number;
}
// Tipe data yang bisa dipilih untuk status, pembayaran, dll.
export type OrderStatus = 'belum dicuci' | 'sedang dicuci' | 'selesai' | 'sudah diambil';
export type PaymentStatus = 'belum bayar' | 'sudah bayar';
export type ServiceType = 'kiloan' | 'satuan';
export type ServiceSpeed = 'regular' | 'kilat';

// Tipe data utama untuk sebuah objek Pesanan (Order)
export interface Order {
  id: number; 
  customerName: string;
  serviceType: ServiceType;
  speed: ServiceSpeed;
  weight?: number;
  items?: OrderItemSatuan[];
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  price: number;
  created_at?: string;
}

// Definisikan semua state dan action yang akan ada di store
interface AppState {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  addOrder: (data: Omit<Order, 'id' | 'orderStatus' | 'paymentStatus' | 'created_at'>) => Promise<void>;
  removeOrder: (id: number, onSuccess?: () => void) => void;
  advanceOrderStatus: (id: number) => Promise<void>;
  togglePaymentStatus: (id: number) => Promise<void>;
}

// Helper untuk siklus status pengerjaan
const getNextOrderStatus = (currentStatus: OrderStatus): OrderStatus => {
  const sequence: OrderStatus[] = ['belum dicuci', 'sedang dicuci', 'selesai', 'sudah diambil'];
  const currentIndex = sequence.indexOf(currentStatus);
  return currentIndex < sequence.length - 1 ? sequence[currentIndex + 1] : currentStatus;
};

// Buat store Zustand utama
export const useAppStore = create<AppState>((set, get) => ({
  // State awal
  orders: [],
  loading: false,

  // Action untuk mengambil semua data pesanan dari Supabase
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      // Map data dari format database (snake_case) ke format aplikasi (camelCase)
      const mappedData: Order[] = data.map(d => ({
        id: d.id,
        customerName: d.customer_name,
        serviceType: d.service_type,
        speed: d.speed,
        weight: d.weight,
        items: d.items,
        orderStatus: d.order_status,
        paymentStatus: d.payment_status,
        price: d.price,
        created_at: d.created_at,
      }));
      set({ orders: mappedData });
    } catch (error: any) {
      Alert.alert('Error Mengambil Data', error.message);
    } finally {
      set({ loading: false });
    }
  },

  // Action untuk menambah pesanan baru ke Supabase
  addOrder: async (data) => {
    const { error } = await supabase.from('orders').insert({
      customer_name: data.customerName,
      service_type: data.serviceType,
      speed: data.speed,
      weight: data.weight,
      items: data.items,
      price: data.price,
    }).single();
    if (error) {
      Alert.alert('Error Menambah Pesanan', error.message);
      throw error;
    }
    Alert.alert('Sukses 🎉', 'Pesanan baru berhasil ditambahkan.');
    await get().fetchOrders(); // Ambil ulang data terbaru setelah menambah
  },

  // Action untuk menghapus pesanan
  removeOrder: (id: number, onSuccess?: () => void) => {
     // Tampilkan notifikasi konfirmasi terlebih dahulu
     Alert.alert('Konfirmasi Hapus 🗑️', 'Anda yakin ingin menghapus pesanan ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        // Proses hapus hanya berjalan jika pengguna menekan "Hapus"
        onPress: async () => {
          try {
            const { error } = await supabase.from('orders').delete().eq('id', id);
            if (error) throw error;
            Alert.alert("Sukses", "Pesanan berhasil dihapus.");
            await get().fetchOrders(); // Refresh data
            if (onSuccess) onSuccess(); // Jalankan callback (misalnya, kembali ke halaman sebelumnya)
          } catch (error: any) {
            Alert.alert('Gagal Menghapus Pesanan', error.message);
          }
        },
      },
    ]);
  },
  
  // Action untuk mengubah status pengerjaan
  advanceOrderStatus: async (id: number) => {
    const orderToUpdate = get().orders.find(o => o.id === id);
    if (!orderToUpdate) return;
    const nextStatus = getNextOrderStatus(orderToUpdate.orderStatus);
    const { error } = await supabase.from('orders').update({ order_status: nextStatus }).eq('id', id);
    if (error) {
      Alert.alert('Error Mengubah Status', error.message);
    } else {
      Alert.alert('Sukses ✅', 'Status pengerjaan berhasil diubah.');
      await get().fetchOrders();
    }
  },
  
  // Action untuk mengubah status pembayaran
  togglePaymentStatus: async (id: number) => {
    const orderToUpdate = get().orders.find(o => o.id === id);
    if (!orderToUpdate) return;
    const nextStatus = orderToUpdate.paymentStatus === 'belum bayar' ? 'sudah bayar' : 'belum bayar';
    const { error } = await supabase.from('orders').update({ payment_status: nextStatus }).eq('id', id);
    if (error) {
       Alert.alert('Error Mengubah Status Pembayaran', error.message);
    } else {
       Alert.alert('Sukses 💳', 'Status pembayaran berhasil diubah.');
       await get().fetchOrders();
    }
  },
}));