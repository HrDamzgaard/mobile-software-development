import React, { useMemo } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import PrimaryButton from '../src/components/PrimaryButton';
import colors from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { BASE_URL } from '../src/api';

type Booking = {
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

export default function BookingConfirmation() {
  const route = useRoute();
  const navigation = useNavigation();

  const booking: Booking | null = (route.params as any)?.booking ?? null;

  const img = useMemo(() => {
    const u = booking?.imageUrl || '';
    if (!u) return null;
    return u.startsWith('http') ? u : `${BASE_URL}${u}`;
  }, [booking]);

  const niceDate = (iso: string) => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toISOString().substring(0, 10);
    } catch {
      return iso;
    }
  };

  if (!booking) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.title}>Booking</Text>
        <Text style={styles.subtitle}>No booking data found.</Text>
        <PrimaryButton
          title="Back to Home"
          onPress={() => (navigation as any).navigate('HomeScreen')}
          style={{ backgroundColor: colors.brand, borderColor: colors.brand }}
          textStyle={{ color: '#fff', fontFamily: typography.family.bold }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.bigOk}>✅</Text>
        <Text style={styles.title}>Booking Confirmed</Text>
        <Text style={styles.subtitle}>Your reservation has been saved.</Text>

        <View style={styles.card}>
          <View style={styles.imageBox}>
            {img ? (
              <Image
                source={{ uri: img }}
                style={StyleSheet.absoluteFillObject as any}
                resizeMode="cover"
              />
            ) : (
              <View style={[StyleSheet.absoluteFillObject as any, { backgroundColor: colors.surface }]} />
            )}
          </View>

          <Text style={styles.model}>{booking.model || '—'}</Text>

          <View style={styles.rowLine}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{booking.location || '—'}</Text>
          </View>

          <View style={styles.rowLine}>
            <Text style={styles.label}>Dates:</Text>
            <Text style={styles.value}>
              {niceDate(booking.startDateISO)} → {niceDate(booking.endDateISO)}
            </Text>
          </View>

          <View style={styles.rowLine}>
            <Text style={styles.label}>Days:</Text>
            <Text style={styles.value}>{booking.days}</Text>
          </View>

          <View style={styles.rowLine}>
            <Text style={styles.label}>Price/day:</Text>
            <Text style={styles.value}>DKK {booking.pricePerDay}</Text>
          </View>

          <View style={styles.rowLine}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.total}>DKK {booking.totalCost}</Text>
          </View>

          <View style={styles.rowLine}>
            <Text style={styles.label}>Booking ID:</Text>
            <Text style={styles.value}>{booking.bookingId}</Text>
          </View>
        </View>

        <PrimaryButton
          title="View Booking History"
          onPress={() => (navigation as any).navigate('Profile')}
          style={{ backgroundColor: colors.brand, borderColor: colors.brand }}
          textStyle={{ color: '#fff', fontFamily: typography.family.bold }}
        />

        <PrimaryButton
          title="Back to Home"
          onPress={() => (navigation as any).navigate('HomeScreen')}
          style={{ backgroundColor: '#fff', borderColor: colors.brand }}
          textStyle={{ color: colors.brand, fontFamily: typography.family.bold }}
        />

        <Text
          style={styles.smallNote}
          onPress={() => Alert.alert('Saved', 'This booking is stored locally (AsyncStorage) as booking history.')}
        >
          Tap for info
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 14, backgroundColor: '#fff' },
  bigOk: { fontSize: 44, textAlign: 'center' },
  title: {
    fontSize: typography.title,
    color: colors.brand,
    textAlign: 'center',
    fontFamily: typography.family.bold,
  },
  subtitle: {
    fontSize: typography.body,
    textAlign: 'center',
    color: '#333',
    fontFamily: typography.family.regular,
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e9e9e9',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    backgroundColor: '#fff',
  },
  imageBox: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  model: {
    fontSize: typography.body + 6,
    color: '#111',
    textAlign: 'center',
    fontFamily: typography.family.bold,
  },
  rowLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  label: { color: colors.brand, fontFamily: typography.family.semibold, fontSize: typography.body },
  value: { color: '#222', fontFamily: typography.family.regular, fontSize: typography.body },
  total: { color: '#111', fontFamily: typography.family.bold, fontSize: typography.body + 2 },
  smallNote: {
    textAlign: 'center',
    color: '#666',
    fontFamily: typography.family.regular,
    marginTop: 6,
    textDecorationLine: 'underline',
  },
});
