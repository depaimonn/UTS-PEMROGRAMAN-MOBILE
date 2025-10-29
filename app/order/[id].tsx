import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import Colors from '../../constants/Colors';
import { useThemeStore } from '../../store/themeStore';

export default function DetailScreen() {
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useThemeStore();
  const styles = getStyles(theme);

  const { orders, advanceOrderStatus, togglePaymentStatus, removeOrder } = useAppStore();
  
  const orderId = parseInt(idString || '0', 10);
  const order = orders.find((o) => o.id === orderId);

  const handleDeletePress = () => {
    if (orderId > 0) {
      removeOrder(orderId, () => {
        if (router.canGoBack()) {
          router.back();
        }
      });
    }
  };

  if (!order) {
    return (
      <View style={styles.container}><Text style={styles.label}>Pesanan tidak ditemukan.</Text></View>
    );
  }

  const customerName = order.customerName;
  const formattedHarga = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.price);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Info Box Utama */}
        <View style={styles.infoGroup}>
            <View style={styles.infoBox}><Text style={styles.infoLabel}>Pelanggan:</Text><Text style={styles.infoValue}>{customerName}</Text></View>
            <View style={styles.infoBox}><Text style={styles.infoLabel}>Tanggal Masuk:</Text><Text style={styles.infoValue}>{new Date(order.created_at!).toLocaleString('id-ID')}</Text></View>
            <View style={styles.infoBox}><Text style={styles.infoLabel}>Total Harga:</Text><Text style={styles.infoValue}>{formattedHarga}</Text></View>
            <View style={styles.infoBox}><Text style={styles.infoLabel}>Status Pengerjaan:</Text><Text style={[styles.infoValue, {textTransform: 'capitalize'}]}>{order.orderStatus}</Text></View>
            <View style={styles.infoBox}><Text style={styles.infoLabel}>Status Bayar:</Text><Text style={[styles.infoValue, {textTransform: 'capitalize'}]}>{order.paymentStatus}</Text></View>
        </View>

        {/* FIX: Bagian baru untuk menampilkan detail layanan */}
        <View style={styles.itemDetailContainer}>
          <Text style={styles.itemDetailHeader}>Detail Layanan</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Jenis:</Text>
            <Text style={[styles.infoValue, {textTransform: 'capitalize'}]}>{order.serviceType} / {order.speed}</Text>
          </View>
          
          {/* Tampilan kondisional: tampilkan berat atau daftar item */}
          {order.serviceType === 'kiloan' && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Berat:</Text>
              <Text style={styles.infoValue}>{order.weight} kg</Text>
            </View>
          )}

          {order.serviceType === 'satuan' && order.items && (
            <View>
              {order.items.map((item, index) => (
                <View key={index} style={styles.itemDetailRow}>
                  <Text style={styles.itemDetailName}>- {item.itemName}</Text>
                  <Text style={styles.itemDetailQuantity}>x{item.quantity}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Tombol Aksi */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.actionButton} onPress={() => advanceOrderStatus(orderId)}><Text style={styles.actionButtonText}>Ubah Status Pengerjaan</Text></Pressable>
          <Pressable style={[styles.actionButton, {backgroundColor: '#4CAF50'}]} onPress={() => togglePaymentStatus(orderId)}><Text style={styles.actionButtonText}>Ubah Status Pembayaran</Text></Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDeletePress}><Text style={styles.deleteButtonText}>Hapus Pesanan Ini</Text></Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (scheme: 'light' | 'dark') => {
  const colors = Colors[scheme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContainer: { padding: 20 },
    infoGroup: { backgroundColor: colors.card, borderRadius: 8, paddingHorizontal: 16, marginBottom: 20 },
    infoBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    infoLabel: { fontSize: 16, color: colors.placeholder },
    infoValue: { fontSize: 16, fontWeight: 'bold', color: colors.text },
    label: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
    
    // FIX: Style baru untuk kontainer detail layanan
    itemDetailContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 30,
    },
    itemDetailHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemDetailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemDetailName: {
      fontSize: 16,
      color: colors.text,
    },
    itemDetailQuantity: {
      fontSize: 16,
      color: colors.placeholder,
    },

    buttonContainer: { marginTop: 10 },
    actionButton: { backgroundColor: Colors.light.tint, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 15 },
    actionButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    deleteButton: { backgroundColor: '#F44336', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 15, marginBottom: 40 },
    deleteButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  });
};