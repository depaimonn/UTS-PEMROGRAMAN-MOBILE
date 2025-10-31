// app/(tabs)/pricing.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, SectionList, StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeStore } from '../../store/themeStore';
import Colors from '../../constants/Colors';
import { useServiceStore, Service } from '../../store/serviceStore';
import { Ionicons } from '@expo/vector-icons';

export default function PricingScreen() {
  const { theme } = useThemeStore();
  const styles = getStyles(theme);
  const router = useRouter();
  
  const { services, loading, fetchServices } = useServiceStore();

  // FIX: Tambahkan 'fetchServices' ke dependency array.
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const priceSections = React.useMemo(() => {
    if (services.length === 0) return [];
    
    const grouped = services.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        // Beri ikon berdasarkan kategori untuk tampilan yang lebih baik
        const icon = category === 'Kiloan' ? '🧺' : '👕';
        acc[category] = { title: `${icon} ${category}`, data: [] };
      }
      // @ts-ignore
      acc[category].data.push(item);
      return acc;
    }, {} as { [key: string]: { title: string; data: Service[] } });

    return Object.values(grouped);
  }, [services]);

  if (loading && services.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={priceSections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.itemContainer} 
            onPress={() => router.push({ pathname: '/edit-service', params: { id: item.id } })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                Reg: Rp {item.priceRegular} | Kilat: Rp {item.priceKilat}
              </Text>
            </View>
            {/* FIX: Ganti 'colors' yang salah menjadi 'Colors[theme]' */}
            <Ionicons name="chevron-forward" size={20} color={Colors[theme].placeholder} />
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        onRefresh={fetchServices}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const getStyles = (scheme: 'light' | 'dark') => {
  const colors = Colors[scheme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    centered: { justifyContent: 'center', alignItems: 'center' },
    sectionHeader: { fontSize: 20, fontWeight: 'bold', color: colors.text, backgroundColor: colors.background, padding: 16 },
    itemContainer: { backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemName: { fontSize: 16, color: colors.text, marginBottom: 4 },
    itemPrice: { fontSize: 14, color: colors.placeholder },
    separator: { height: 1, backgroundColor: colors.border, marginLeft: 16 },
  });
};