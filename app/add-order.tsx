import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, SafeAreaView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore, ServiceType, ServiceSpeed } from '../store/appStore';
import Colors from '../constants/Colors';
import { Picker } from '@react-native-picker/picker';
import { useThemeStore } from '../store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import { useServiceStore } from '../store/serviceStore';

export default function AddOrderScreen() {
  const { addOrder } = useAppStore();
  const router = useRouter();
  const { theme } = useThemeStore();
  
  const { services, fetchServices } = useServiceStore();

  // FIX: Tambahkan fetchServices ke dependency array
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const kiloanService = useMemo(() => services.find(s => s.serviceType === 'kiloan'), [services]);
  const satuanItems = useMemo(() => services.filter(s => s.serviceType === 'satuan'), [services]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('kiloan');
  const [speed, setSpeed] = useState<ServiceSpeed>('regular');
  const [weight, setWeight] = useState('');
  const [quantities, setQuantities] = useState<{[serviceId: number]: number}>({});

  const handleQuantityChange = (serviceId: number, change: 1 | -1) => {
    setQuantities(prev => {
      const currentQty = prev[serviceId] || 0;
      const newQty = Math.max(0, currentQty + change);
      return { ...prev, [serviceId]: newQty };
    });
  };

  const totalPrice = useMemo(() => {
    if (serviceType === 'kiloan' && kiloanService) {
      const weightNum = parseFloat(weight) || 0;
      const pricePerKg = speed === 'regular' ? kiloanService.priceRegular : kiloanService.priceKilat;
      return weightNum * pricePerKg;
    } else {
      return satuanItems.reduce((total, item) => {
        const qty = quantities[item.id] || 0;
        const price = speed === 'regular' ? item.priceRegular : item.priceKilat;
        return total + (qty * price);
      }, 0);
    }
  }, [serviceType, speed, weight, quantities, kiloanService, satuanItems]);

  const handleSubmit = async () => {
    if (!customerName.trim()) { Alert.alert('Error', 'Nama pelanggan harus diisi.'); return; }
    if (serviceType === 'kiloan' && (isNaN(parseFloat(weight)) || parseFloat(weight) <= 0)) { Alert.alert('Error', 'Berat harus valid.'); return; }
    const satuanItemsList = Object.entries(quantities).filter(([_, qty]) => qty > 0);
    if (serviceType === 'satuan' && satuanItemsList.length === 0) { Alert.alert('Error', 'Pilih minimal satu item satuan.'); return; }

    setIsSubmitting(true);
    try {
      const orderData: any = {
        customerName: customerName.trim(),
        serviceType,
        speed,
        price: totalPrice,
        weight: serviceType === 'kiloan' ? parseFloat(weight) : undefined,
        items: serviceType === 'satuan' ? satuanItemsList.map(([serviceId, qty]) => {
          const itemInfo = satuanItems.find(i => i.id === parseInt(serviceId))!;
          return {
            itemName: itemInfo.name,
            quantity: qty,
            pricePerItem: speed === 'regular' ? itemInfo.priceRegular : itemInfo.priceKilat,
          };
        }) : undefined,
      };
      await addOrder(orderData);
      router.back();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedTotalPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPrice);
  const categories = [...new Set(satuanItems.map(item => item.category))];
  const isButtonDisabled = totalPrice <= 0;

  // FIX: Mengembalikan kode JSX yang hilang, yang menyebabkan semua error 'unused variable'.
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama Pelanggan</Text>
          <TextInput style={styles.input} placeholder="Ketik nama pelanggan..." placeholderTextColor={Colors[theme].placeholder} value={customerName} onChangeText={setCustomerName}/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jenis Layanan</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={serviceType} onValueChange={(val) => setServiceType(val)} style={styles.picker} itemStyle={styles.pickerItem} dropdownIconColor={Colors[theme].text}>
              <Picker.Item label="Laundry Kiloan" value="kiloan" />
              <Picker.Item label="Laundry Satuan" value="satuan" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kecepatan Layanan</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={speed} onValueChange={(val) => setSpeed(val)} style={styles.picker} itemStyle={styles.pickerItem} dropdownIconColor={Colors[theme].text}>
              <Picker.Item label="Regular" value="regular" />
              <Picker.Item label="Kilat" value="kilat" />
            </Picker>
          </View>
        </View>
        
        {serviceType === 'kiloan' ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Berat (kg)</Text>
            <TextInput style={styles.input} placeholder="Contoh: 4.5" placeholderTextColor={Colors[theme].placeholder} value={weight} onChangeText={setWeight} keyboardType="numeric"/>
          </View>
        ) : (
          <View>
            {categories.map(category => (
              <View key={category} style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>{category}</Text>
                {satuanItems.filter(item => item.category === category).map(item => (
                  <View key={item.id} style={styles.satuanItem}>
                    <View>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>
                        {speed === 'regular' ? `Rp ${item.priceRegular}` : `Rp ${item.priceKilat}`}
                      </Text>
                    </View>
                    <View style={styles.quantityControl}>
                      <Pressable onPress={() => handleQuantityChange(item.id, -1)} style={styles.qtyButton}>
                        <Ionicons name="remove-circle-outline" size={28} color={Colors.light.tint} />
                      </Pressable>
                      <Text style={styles.quantityText}>{quantities[item.id] || 0}</Text>
                      <Pressable onPress={() => handleQuantityChange(item.id, 1)} style={styles.qtyButton}>
                        <Ionicons name="add-circle-outline" size={28} color={Colors.light.tint} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Harga:</Text>
            <Text style={styles.totalPrice}>{formattedTotalPrice}</Text>
          </View>
          <Pressable onPress={handleSubmit} disabled={isButtonDisabled || isSubmitting} style={[styles.button, (isButtonDisabled || isSubmitting) && styles.buttonDisabled]}>
            {isSubmitting ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Simpan Pesanan</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (scheme: 'light' | 'dark') => {
  const colors = Colors[scheme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContainer: { padding: 20, paddingBottom: 120 },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
    input: { backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 16 },
    pickerContainer: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.card },
    picker: { color: colors.text, backgroundColor: 'transparent', height: 50 },
    pickerItem: { color: scheme === 'dark' ? '#000000' : colors.text, backgroundColor: colors.card },
    categoryContainer: { marginBottom: 20 },
    categoryTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 5 },
    satuanItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.card, padding: 12, borderRadius: 8, marginBottom: 8 },
    itemName: { fontSize: 16, color: colors.text },
    itemPrice: { fontSize: 12, color: colors.placeholder },
    quantityControl: { flexDirection: 'row', alignItems: 'center' },
    qtyButton: { padding: 5 },
    quantityText: { fontSize: 18, color: colors.text, marginHorizontal: 15, fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.card, padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
    totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    totalLabel: { fontSize: 18, color: colors.placeholder },
    totalPrice: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    button: { backgroundColor: Colors.light.tint, padding: 14, borderRadius: 8, alignItems: 'center' },
    buttonDisabled: { backgroundColor: '#a0a0a0' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  });
};