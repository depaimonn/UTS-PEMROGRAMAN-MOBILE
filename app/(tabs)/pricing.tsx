import React from 'react';
import { SafeAreaView, SectionList, StyleSheet, Text, View, SectionListData } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import Colors from '../../constants/Colors';
import { SATUAN_ITEMS } from '../../constants/Pricing';

// Tipe data universal untuk semua item di dalam list
interface PriceListItem {
  id: string;
  name: string;
  price: string;
}

// Tipe untuk setiap section di SectionList
type PriceSection = SectionListData<PriceListItem, { title: string }>;

// Proses data dari constants/Pricing.ts agar sesuai dengan format yang dibutuhkan SectionList
const priceSections: PriceSection[] = [
  {
    title: '🧺 Laundry Kiloan',
    data: [
      { id: 'kilo_reg', name: 'Regular', price: 'Rp 7.000 / kg' },
      { id: 'kilo_kilat', name: 'Kilat', price: 'Rp 12.000 / kg' },
    ],
  },
  // Mengelompokkan item satuan berdasarkan kategori
  ...Object.values(
    SATUAN_ITEMS.reduce((acc, item) => {
      const title = `👕 ${item.category}`;
      if (!acc[title]) {
        acc[title] = { title, data: [] };
      }
      // @ts-ignore
      acc[title].data.push(item);
      return acc;
    }, {} as { [key: string]: { title: string; data: typeof SATUAN_ITEMS } })
  ).map(section => ({
    ...section,
    data: section.data.map(item => ({
      id: item.id,
      name: item.name,
      price: `Reg: Rp ${item.priceRegular} | Kilat: Rp ${item.priceKilat}`,
    })),
  })),
];

export default function PricingScreen() {
  const { theme } = useThemeStore();
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={priceSections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: PriceListItem }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const getStyles = (scheme: 'light' | 'dark') => {
  const colors = Colors[scheme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    sectionHeader: { fontSize: 20, fontWeight: 'bold', color: colors.text, backgroundColor: colors.background, padding: 16 },
    itemContainer: { backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemName: { fontSize: 16, color: colors.text, flex: 1, marginRight: 8 },
    itemPrice: { fontSize: 14, color: colors.placeholder, textAlign: 'right' },
    separator: { height: 1, backgroundColor: colors.border, marginLeft: 16 },
  });
};