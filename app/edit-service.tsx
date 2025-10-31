// app/edit-service.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, SafeAreaView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useServiceStore } from '../store/serviceStore';
import Colors from '../constants/Colors';
import { useThemeStore } from '../store/themeStore';

export default function EditServiceScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const styles = getStyles(theme);
  
  // Ambil 'id' layanan yang dikirim dari halaman sebelumnya
  const { id } = useLocalSearchParams<{ id: string }>();
  const serviceId = parseInt(id || '0');

  // Ambil data dan fungsi dari serviceStore
  const { services, updateService } = useServiceStore();
  const serviceToEdit = services.find(s => s.id === serviceId);

  // State untuk form input
  const [priceRegular, setPriceRegular] = useState('');
  const [priceKilat, setPriceKilat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Isi form dengan data harga saat ini saat halaman dibuka
  useEffect(() => {
    if (serviceToEdit) {
      setPriceRegular(serviceToEdit.priceRegular.toString());
      setPriceKilat(serviceToEdit.priceKilat.toString());
    }
  }, [serviceToEdit]);
  
  // Fungsi yang dijalankan saat tombol "Simpan" ditekan
  const handleSave = async () => {
    const regularNum = parseInt(priceRegular);
    const kilatNum = parseInt(priceKilat);

    // Validasi input
    if (isNaN(regularNum) || isNaN(kilatNum)) {
      Alert.alert('Error', 'Harga harus berupa angka yang valid.');
      return;
    }

    setIsSubmitting(true);
    await updateService(serviceId, { priceRegular: regularNum, priceKilat: kilatNum });
    setIsSubmitting(false);
    
    // Tutup modal setelah berhasil
    if (router.canGoBack()) {
      router.back();
    }
  };

  // Tampilkan pesan jika layanan tidak ditemukan
  if (!serviceToEdit) {
    return <SafeAreaView style={styles.container}><Text style={styles.label}>Layanan tidak ditemukan.</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{serviceToEdit.name}</Text>
        
        {/* Input untuk Harga Reguler */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Harga Reguler (Rp)</Text>
          <TextInput
            style={styles.input}
            value={priceRegular}
            onChangeText={setPriceRegular}
            keyboardType="number-pad"
            placeholderTextColor={Colors[theme].placeholder}
          />
        </View>

        {/* Input untuk Harga Kilat */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Harga Kilat (Rp)</Text>
          <TextInput
            style={styles.input}
            value={priceKilat}
            onChangeText={setPriceKilat}
            keyboardType="number-pad"
            placeholderTextColor={Colors[theme].placeholder}
          />
        </View>

        {/* Tombol Simpan */}
        <Pressable
          onPress={handleSave}
          disabled={isSubmitting}
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Simpan Perubahan</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (scheme: 'light' | 'dark') => {
  const colors = Colors[scheme];
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContainer: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 20, textAlign: 'center' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
    input: { backgroundColor: colors.card, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 16 },
    button: { backgroundColor: Colors.light.tint, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#a0a0a0' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  });
};