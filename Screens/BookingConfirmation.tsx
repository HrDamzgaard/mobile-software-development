import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const navigation = useNavigation<any>();
  const route = useRoute();
  const booking = (route.params as any)?.booking as Booking | undefined;

  const imageUri = useMemo(() => {
    const u = booking?.imageUrl || '';
    if (!u) return null;
    return u.startsWith('http') ? u : `${BASE_URL}${u}`;
  }, [booking]);

  if (!booking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No booking data.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageBox}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject as any} resizeMode="cover" />
          ) : (
            <View style={[StyleSheet.absoluteFillObject as any, { backgroundColor: colors.surface }]} />
          )}
        </View>

        <Text style={styles.title}>Booking Confirmed</Text>
        <Text style={styles.model}>{booking.model} {booking.name || ''}</Text>

        <View style={styles.card}>
          <View style={styles.rowLine}>
            <Text style={styles.label}>Start</Text>
            <Text style={styles.value}>{booking.startDateISO.substring(0, 10)}</Text>
          </View>
          <View style={styles.rowLine}>
            <Text style={styles.label}>End</Text>
            <Text style={styles.value}>{booking.endDateISO.substring(0, 10)}</Text>
          </View>
          <View style={styles.rowLine}>
            <Text style={styles.label}>Days</Text>
            <Text style={styles.value}>{booking.days}</Text>
          </View>
          <View style={styles.rowLine}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.total}>DKK {booking.totalCost}</Text>
          </View>
        </View>

        <PrimaryButton
          title="View Booking History"
          onPress={() => navigation.navigate('BookingHistory')}
          style={{ backgroundColor: colors.brand, borderColor: colors.brand }}
          textStyle={{ color: '#fff', fontFamily: typography.family.bold }}
        />

        <PrimaryButton
          title="Back to Home"
          onPress={() => navigation.navigate('HomeScreen')}
          style={{ marginTop: 10 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  imageBox: { height: 220, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surface },
  title: { fontSize: 26, color: colors.brand, textAlign: 'center', fontFamily: typography.family.bold },
  model: { fontSize: 18, color: '#111', textAlign: 'center', fontFamily: typography.family.semibold },

  card: { marginTop: 10, padding: 14, borderRadius: 12, backgroundColor: '#f5f5f5', gap: 10 },
  rowLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  label: { color: colors.brand, fontFamily: typography.family.semibold, fontSize: typography.body },
  value: { color: '#222', fontFamily: typography.family.regular, fontSize: typography.body },
  total: { color: '#111', fontFamily: typography.family.bold, fontSize: typography.body + 2 },
});
