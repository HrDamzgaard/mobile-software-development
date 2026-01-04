import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { userAuth } from '../context/AuthContext';
import { BASE_URL } from '../src/api';

const screenwidth = Dimensions.get('window').width;

type LocalBooking = {
  bookingId: string;
  carId: string | number;
  model: string;
  name?: string;
  location?: string;
  imageUrl?: string | null;
  startDateISO: string;
  endDateISO: string;
  days: number;
  pricePerDay: number;
  totalCost: number;
  createdAtISO: string;
};

export default function BookingHistoryScreen() {
  const { user } = userAuth();
  const username = user?.username;

  const [items, setItems] = React.useState<LocalBooking[]>([]);

  const storageKey = React.useMemo(() => {
    if (!username) return null;
    return `booking_history_${username}`;
  }, [username]);

  const niceDate = (iso: string) => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toISOString().substring(0, 10);
    } catch {
      return iso;
    }
  };

  const toImg = (u?: string | null) => {
    if (!u) return null;
    return u.startsWith('http') ? u : `${BASE_URL}${u}`;
  };

  const load = React.useCallback(async () => {
    if (!storageKey) return;
    try {
      const raw = await AsyncStorage.getItem(storageKey);
      const arr: LocalBooking[] = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(arr) ? arr : []);
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [load])
  );

  const renderItem = ({ item }: { item: LocalBooking }) => {
    const img = toImg(item.imageUrl);
    return (
      <LinearGradient
        colors={['#939393', '#d3d3d3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.1 }}
        style={{ borderRadius: 20, marginBottom: 20 }}
      >
        <View style={styles.rowWrap}>
          <View style={styles.info}>
            <Text style={styles.small}>{niceDate(item.startDateISO)} → {niceDate(item.endDateISO)}</Text>
            <Text style={styles.title}>{item.model} {item.name || ''}</Text>
            <Text style={styles.small}>{item.location || '—'}</Text>
            <Text style={styles.small}>DKK {item.totalCost} • {item.days} days</Text>
          </View>

          {img ? (
            <Image source={{ uri: img }} style={styles.image} />
          ) : (
            <View style={[styles.image, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="image-outline" size={22} color="#666" />
            </View>
          )}
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking History</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => String(it.bookingId)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text style={{ textAlign: 'center', color: '#666' }}>
              No bookings found.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 14, paddingBottom: 6, paddingHorizontal: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#111' },

  rowWrap: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  info: { flex: 1, paddingRight: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111', marginTop: 4 },
  small: { fontSize: 14, color: '#555' },

  image: { width: 150, height: 75, borderRadius: 10, backgroundColor: '#eee' },
});
