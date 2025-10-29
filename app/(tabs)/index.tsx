import React, { useState, useMemo, useEffect } from 'react';
// BARU: Tambahkan TextInput untuk search bar
import { FlatList, StyleSheet, View, Text, SafeAreaView, Pressable, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { useAppStore, OrderStatus } from '../../store/appStore';
import OrderItem from '../../components/OrderItem';
import Colors from '../../constants/Colors';
import { useThemeStore } from '../../store/themeStore';

const STATUS_FILTERS: OrderStatus[] = ['belum dicuci', 'sedang dicuci', 'selesai', 'sudah diambil'];

export default function HomeScreen() {
  const { orders, loading, fetchOrders } = useAppStore();
  const { theme } = useThemeStore();
  const styles = getStyles(theme);
  
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'semua'>('semua');
  // BARU: State untuk menyimpan teks pencarian
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // REVISI: Logika filter sekarang menggabungkan filter status dan pencarian
  const finalFilteredOrders = useMemo(() => {
    // Langkah 1: Filter berdasarkan status (seperti sebelumnya)
    let filtered = orders;
    if (activeFilter !== 'semua') {
      filtered = orders.filter((order) => order.orderStatus === activeFilter);
    }

    // Langkah 2: Filter hasil di atas berdasarkan query pencarian
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((order) =>
        order.customerName.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    return filtered;
  }, [orders, activeFilter, searchQuery]); // Jalankan ulang jika salah satu dari ini berubah

  if (loading && orders.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.emptyText}>Memuat pesanan dari database...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* BARU: Kontainer untuk Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama pelanggan..."
          placeholderTextColor={Colors[theme].placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 16}}>
          <Pressable
            style={[styles.filterButton, activeFilter === 'semua' && styles.activeFilter]}
            onPress={() => setActiveFilter('semua')}>
            <Text style={[styles.filterText, activeFilter === 'semua' && {color: 'white'}]}>Semua</Text>
          </Pressable>
          {STATUS_FILTERS.map((status) => (
            <Pressable
              key={status}
              style={[styles.filterButton, activeFilter === status && styles.activeFilter]}
              onPress={() => setActiveFilter(status)}>
              <Text style={[styles.filterText, activeFilter === status && {color: 'white'}]}>{status}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* REVISI: FlatList sekarang menggunakan data yang sudah difilter ganda */}
      <FlatList
        data={finalFilteredOrders}
        onRefresh={fetchOrders}
        refreshing={loading}
        renderItem={({ item }) => <OrderItem order={item} />}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada pesanan yang cocok. 🧺</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const getStyles = (scheme: 'light' | 'dark') => {
  const colors = Colors[scheme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { justifyContent: 'center', alignItems: 'center' },
    
    // BARU: Style untuk search bar
    searchContainer: {
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchInput: {
      backgroundColor: colors.background,
      color: colors.text,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    filterContainer: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
    filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
    activeFilter: { backgroundColor: Colors.light.tint, borderColor: Colors.light.tint },
    filterText: { color: colors.text, textTransform: 'capitalize', fontWeight: '500' },
    separator: { height: 1, backgroundColor: colors.border },
    emptyContainer: { flex: 1, marginTop: 100, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 16, color: colors.placeholder, marginTop: 10, textAlign: 'center' },
  });
};