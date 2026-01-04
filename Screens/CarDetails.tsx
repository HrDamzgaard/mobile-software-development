import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View, Platform } from 'react-native';

import PrimaryButton from '../src/components/PrimaryButton';
import { BASE_URL, fetchCar } from '../src/api';
import colors from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import type { Car } from '../src/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userAuth } from "../context/AuthContext";
import DateTimePicker from '@react-native-community/datetimepicker';

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

export default function CarDetails() {
  const route = useRoute();
  const navigation = useNavigation();

  const id = route.params ? (route.params as any).id : null;

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);

  const BRAND = colors.brand;

  const { user } = userAuth();
  const username = user?.username;

  const [startDate, setStartDate] = useState<Date>(() => new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchCar(id);
        if (mounted) setCar(data as Car);
      } catch (e: any) {
        console.log('Error fetching car:', e);
        Alert.alert('Error', `Failed to load car from ${BASE_URL}`);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const imageUri = useMemo(() => {
    const u = (car as any)?.image || (car as any)?.imageUrl || '';
    if (!u) return null;
    return u.startsWith('http') ? u : `${BASE_URL}${u}`;
  }, [car]);

  const titleText = useMemo(() => {
    if (loading) return 'Loading…';
    return (car as any)?.model ? String((car as any).model) : '—';
  }, [loading, car]);

  const norm = (v: any) => {
    if (v === null || v === undefined) return '';
    const s = String(v).trim();
    return s.length ? s : '';
  };

  const location =
    norm((car as any)?.location) ||
    norm((car as any)?.city) ||
    norm((car as any)?.place) ||
    '';

  const listingDate =
    norm((car as any)?.listingDate) ||
    norm((car as any)?.listed) ||
    norm((car as any)?.listing_date) ||
    norm((car as any)?.date) ||
    '';

  const statusRaw = norm((car as any)?.status);
  const statusText = statusRaw || '';

  const pricePerDay = useMemo(() => {
    const p = Number((car as any)?.price);
    if (Number.isFinite(p) && p > 0) return p;
    return 0;
  }, [car]);

  const formatYMD = (d: Date) => {
    try {
      return d.toISOString().substring(0, 10);
    } catch {
      return String(d);
    }
  };

  const calcDays = (s: Date, e: Date) => {
    const a = new Date(s);
    const b = new Date(e);
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
    const diff = b.getTime() - a.getTime();
    const raw = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, raw);
  };

  const days = calcDays(startDate, endDate);
  const totalCost = pricePerDay > 0 ? days * pricePerDay : 0;

  const bookingStorageKey = (u: string) => `booking_history_${u}`;

  async function appendBooking(u: string, b: LocalBooking) {
    const key = bookingStorageKey(u);
    const existing = await AsyncStorage.getItem(key);
    const arr: LocalBooking[] = existing ? JSON.parse(existing) : [];
    arr.unshift(b);
    await AsyncStorage.setItem(key, JSON.stringify(arr));
  }

  async function handleRent() {
    if (!car?.id) {
      Alert.alert('Error', 'Car not loaded yet.');
      return;
    }
    if (!username) {
      Alert.alert('Login required', 'Please login before renting.');
      return;
    }

    const s = (statusRaw || '').toLowerCase();
    if (s && s !== 'available') {
      Alert.alert('Error', 'This car is not available to rent.');
      return;
    }

    if (endDate.getTime() < startDate.getTime()) {
      Alert.alert('Invalid dates', 'End date cannot be earlier than start date.');
      return;
    }

    try {
      setRenting(true);

      const res = await fetch(`${BASE_URL}/api/rent/${car.id}/${username}`, {
        method: 'PUT',
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.log('Rent error:', res.status, txt);
        Alert.alert('Error', 'Could not place the reservation');
        return;
      }

      const booking: LocalBooking = {
        bookingId: `${Date.now()}`,
        carId: car.id as any,
        model: norm((car as any)?.model) || '—',
        name: norm((car as any)?.name) || '',
        location: location || '',
        imageUrl: (car as any)?.image || (car as any)?.imageUrl || null,
        startDateISO: startDate.toISOString(),
        endDateISO: endDate.toISOString(),
        days,
        pricePerDay,
        totalCost,
        createdAtISO: new Date().toISOString(),
      };

      await appendBooking(username, booking);

      (navigation as any).navigate('BookingConfirmation', { booking });
    } catch (e) {
      console.log('Rent exception:', e);
      Alert.alert('Error', 'Could not place the reservation');
    } finally {
      setRenting(false);
    }
  }

  const onStartChange = (_: any, selected?: Date) => {
    if (Platform.OS === 'android') setShowStartPicker(false);
    if (!selected) return;
    const next = new Date(selected);
    setStartDate(next);

    if (endDate.getTime() < next.getTime()) {
      const fix = new Date(next);
      fix.setDate(fix.getDate() + 1);
      setEndDate(fix);
    }
  };

  const onEndChange = (_: any, selected?: Date) => {
    if (Platform.OS === 'android') setShowEndPicker(false);
    if (!selected) return;
    const next = new Date(selected);
    setEndDate(next);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.imageBox}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={StyleSheet.absoluteFillObject as any}
                resizeMode="cover"
                onError={(e) => console.log('Image load error:', e.nativeEvent?.error)}
              />
            ) : (
              <View style={[StyleSheet.absoluteFillObject as any, { backgroundColor: colors.surface }]} />
            )}
          </View>

          <Text style={styles.title}>{titleText}</Text>

          {(car as any)?.description ? (
            <Text style={styles.description}>{String((car as any).description)}</Text>
          ) : null}

          {!loading && (
            <View style={styles.metaBox}>
              <Text style={styles.metaLine}>
                <Text style={styles.metaLabel}>Location: </Text>
                {location || '—'}
              </Text>
              <Text style={styles.metaLine}>
                <Text style={styles.metaLabel}>Listing Date: </Text>
                {listingDate || '—'}
              </Text>
              <Text style={styles.metaLine}>
                <Text style={styles.metaLabel}>Status: </Text>
                {statusText || '—'}
              </Text>
            </View>
          )}

          <Text style={styles.price}>
            {loading ? 'Price: —' : `Price: DKK ${(car as any)?.price || '—'}/day`}
          </Text>

          <View style={styles.dateBox}>
            <Text style={styles.sectionTitle}>Select dates</Text>

            <View style={styles.dateRow}>
              <Pressable style={styles.datePill} onPress={() => setShowStartPicker(true)}>
                <Text style={styles.dateLabel}>Start</Text>
                <Text style={styles.dateValue}>{formatYMD(startDate)}</Text>
              </Pressable>

              <Pressable style={styles.datePill} onPress={() => setShowEndPicker(true)}>
                <Text style={styles.dateLabel}>End</Text>
                <Text style={styles.dateValue}>{formatYMD(endDate)}</Text>
              </Pressable>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Days: {days}</Text>
              <Text style={styles.summaryText}>Total: {totalCost ? `DKK ${totalCost}` : '—'}</Text>
            </View>

            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onStartChange}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onEndChange}
              />
            )}
          </View>

          <PrimaryButton
            title="Rent"
            onPress={handleRent}
            loading={renting}
            style={{ backgroundColor: BRAND, borderColor: BRAND }}
            textStyle={{ color: '#fff', fontFamily: typography.family.bold }}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16, backgroundColor: '#fff' },

  imageBox: {
    height: 220,
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },

  title: {
    fontSize: typography.title,
    color: colors.brand,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: typography.family.bold,
  },

  description: {
    fontSize: typography.body,
    color: '#333',
    lineHeight: 20,
    textAlign: 'left',
    marginHorizontal: 8,
    fontFamily: typography.family.regular,
  },

  metaBox: { gap: 6, alignItems: 'center', marginTop: 6 },
  metaLine: { fontSize: typography.body + 2, color: '#222', fontFamily: typography.family.regular },
  metaLabel: { color: colors.brand, fontFamily: typography.family.semibold },

  price: {
    fontSize: typography.price,
    color: colors.brand,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
    fontFamily: typography.family.bold,
  },

  dateBox: {
    borderWidth: 1,
    borderColor: '#e9e9e9',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },

  sectionTitle: {
    color: colors.brand,
    fontFamily: typography.family.bold,
    fontSize: typography.body + 2,
    textAlign: 'center',
  },

  dateRow: { flexDirection: 'row', gap: 12 },
  datePill: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  dateLabel: { color: '#666', fontFamily: typography.family.regular, fontSize: 12 },
  dateValue: { color: '#111', fontFamily: typography.family.bold, fontSize: 14, marginTop: 4 },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryText: { color: '#222', fontFamily: typography.family.semibold },
});
