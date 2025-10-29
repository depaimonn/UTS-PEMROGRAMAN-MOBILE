export interface SatuanItemPrice {
  id: string;
  name: string;
  category: 'Pakaian' | 'Perlengkapan Rumah Tangga' | 'Barang Tambahan';
  priceRegular: number;
  priceKilat: number;
}

// Data harga untuk semua item satuan
export const SATUAN_ITEMS: SatuanItemPrice[] = [
  // Pakaian
  { id: 'kemeja', name: 'Kemeja', category: 'Pakaian', priceRegular: 10000, priceKilat: 15000 },
  { id: 'celana', name: 'Celana Panjang / Jeans', category: 'Pakaian', priceRegular: 10000, priceKilat: 15000 },
  { id: 'jaket', name: 'Jaket', category: 'Pakaian', priceRegular: 15000, priceKilat: 22000 },
  { id: 'sweater', name: 'Sweater / Hoodie', category: 'Pakaian', priceRegular: 15000, priceKilat: 22000 },
  { id: 'dress', name: 'Dress', category: 'Pakaian', priceRegular: 20000, priceKilat: 30000 },
  { id: 'batik', name: 'Batik', category: 'Pakaian', priceRegular: 12000, priceKilat: 18000 },
  { id: 'kebaya', name: 'Kebaya', category: 'Pakaian', priceRegular: 25000, priceKilat: 35000 },
  // Perlengkapan Rumah Tangga
  { id: 'selimut', name: 'Selimut', category: 'Perlengkapan Rumah Tangga', priceRegular: 20000, priceKilat: 30000 },
  { id: 'bedcover', name: 'Bed Cover', category: 'Perlengkapan Rumah Tangga', priceRegular: 25000, priceKilat: 35000 },
  { id: 'sprei', name: 'Sprei Set', category: 'Perlengkapan Rumah Tangga', priceRegular: 18000, priceKilat: 28000 },
  { id: 'gordyn', name: 'Gordyn / Tirai', category: 'Perlengkapan Rumah Tangga', priceRegular: 25000, priceKilat: 40000 },
  // Barang Tambahan
  { id: 'sepatu', name: 'Sepatu (per pasang)', category: 'Barang Tambahan', priceRegular: 30000, priceKilat: 45000 },
  { id: 'tas', name: 'Tas', category: 'Barang Tambahan', priceRegular: 25000, priceKilat: 40000 },
];