import React from 'react';
import { Pressable, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useThemeStore } from '../../store/themeStore';

// FIX: Implementasikan kembali komponen tombol lingkaran kustom
const CustomTabBarButton = ({ children, onPress }: any) => (
  <Pressable
    onPress={onPress}
    style={{
      top: -20, // Mengangkat tombol ke atas
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <View style={{
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: Colors.light.tint,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      // Instruksi untuk menengahkan ikon di dalam lingkaran
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {children}
    </View>
  </Pressable>
);

export default function TabLayout() {
  const { theme, toggleTheme } = useThemeStore();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: Colors[theme].card,
          borderTopColor: Colors[theme].border,
          height: 60,
        },
      }}>
      {/* Tab Kiri: Beranda */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dep Laundry 🧺',
          headerStyle: { backgroundColor: Colors[theme].card },
          headerTitleStyle: { color: Colors[theme].text },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={28} color={color} />
          ),
          headerRight: () => (
            <Pressable onPress={toggleTheme} style={{ marginRight: 15 }}>
              <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={24}
                color={Colors[theme].text}
              />
            </Pressable>
          ),
        }}
      />
      
      {/* FIX: Tab Tengah kembali menggunakan tombol lingkaran kustom */}
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: () => (
            <Ionicons name="add" size={40} color="white" />
          ),
          // Ganti tombol tab default dengan komponen kustom kita
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} onPress={() => router.push('/add-order')} />
          ),
        }}
      />
      
      {/* Tab Kanan: Daftar Harga */}
      <Tabs.Screen
        name="pricing"
        options={{
          title: 'Daftar Harga 💸',
          headerStyle: { backgroundColor: Colors[theme].card },
          headerTitleStyle: { color: Colors[theme].text },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'pricetags' : 'pricetags-outline'} size={28} color={color} />
          ),
          headerRight: () => (
            <Pressable onPress={toggleTheme} style={{ marginRight: 15 }}>
              <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={24}
                color={Colors[theme].text}
              />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}