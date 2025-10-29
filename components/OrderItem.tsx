import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Order } from '../store/appStore';
import Colors from '../constants/Colors';
import { useThemeStore } from '../store/themeStore';

export default function OrderItem({ order }: { order: Order }) {
  const { theme } = useThemeStore();
  const styles = getStyles(theme);
  const router = useRouter();
  
  const customerName = order.customerName;

  const formattedHarga = new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(order.price);
  
  const getStatusColor = (status: string) => {
    if (status === 'selesai') return '#4CAF50';
    if (status === 'sudah diambil') return '#0288D1';
    if (status === 'sedang dicuci') return '#FFC107';
    return '#757575';
  };

  // FIX: Logika baru untuk menampilkan detail pesanan
  let detailDisplay: string;
  if (order.serviceType === 'kiloan') {
    // Jika kiloan, tampilkan berat dan kecepatan
    detailDisplay = `${order.weight} kg / ${order.speed}`;
  } else {
    // Jika satuan, ambil nama item dari array 'items'
    const itemNames = order.items?.map(item => item.itemName) || [];
    
    // Batasi hanya 2 item pertama, lalu tambahkan "..." jika lebih
    if (itemNames.length > 2) {
      detailDisplay = itemNames.slice(0, 2).join(', ') + ', ...';
    } else {
      detailDisplay = itemNames.join(', ');
    }
  }

  return (
    <Pressable style={styles.container} onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}>
      <View style={styles.infoContainer}>
        <Text style={styles.customerName}>{customerName}</Text>
        {/* Tampilkan detail yang sudah kita proses di atas */}
        <Text style={styles.detailText} numberOfLines={1}>{detailDisplay}</Text>
        
        <View style={styles.statusRow}>
          <View style={[styles.statusChip, { backgroundColor: getStatusColor(order.orderStatus) }]}>
            <Text style={styles.statusChipText}>{order.orderStatus}</Text>
          </View>
          <View style={[styles.statusChip, { backgroundColor: order.paymentStatus === 'sudah bayar' ? '#4CAF50' : '#F44336' }]}>
            <Text style={styles.statusChipText}>{order.paymentStatus}</Text>
          </View>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>{formattedHarga}</Text>
      </View>
    </Pressable>
  );
}

const getStyles = (scheme: 'light' | 'dark') => {
  const colors = Colors[scheme];
  return StyleSheet.create({
    container: { flexDirection: 'row', backgroundColor: colors.card, padding: 16 },
    infoContainer: { flex: 1, marginRight: 10 },
    customerName: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
    detailText: { 
      fontSize: 14, 
      color: colors.placeholder, 
      marginBottom: 12, 
      textTransform: 'capitalize' 
    },
    statusRow: { flexDirection: 'row', flexWrap: 'wrap' },
    statusChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginBottom: 8 },
    statusChipText: { color: 'white', fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
    priceContainer: { justifyContent: 'center', alignItems: 'flex-end' },
    priceText: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  });
};