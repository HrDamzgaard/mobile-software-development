import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from './components/PrimaryButton';
import { BASE_URL, fetchCar, rentCar } from './lib/api';
import colors from './theme/colors';
import { typography } from './theme/typography';
import type { Car } from './types';

export default function App() {
  const [debugError, setDebugError] = useState<string | null>(null);
  const id = 1;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);

  const headerColor = (colors?.header ?? '#8f8f93');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchCar(id);
        if (mounted) setCar(data as Car);
      } catch (e: any) {
        console.log('Error fetching car:', e);
        setDebugError(e?.message || String(e));
        Alert.alert('Error', `Failed to load car from ${BASE_URL}`);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // image alanı: DB "image" veya "imageUrl" olabilir
  const imageUri = useMemo(() => {
    const u = (car as any)?.image || (car as any)?.imageUrl || '';
    if (!u) return null;
    return u.startsWith('http') ? u : `${BASE_URL}${u}`;
  }, [car]);

  // --- BAŞLIK: sadece model (BMW) ---
  const titleText = useMemo(() => {
    if (loading) return "Loading…";
    return car && (car as any).model ? String((car as any).model) : "—";
  }, [loading, car]);

  // --- ESNEK ALAN EŞLEME ---
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

  async function handleRent() {
    const status = statusRaw.toLowerCase();
    if (status && status !== 'available') {
      Alert.alert('Error', 'This car is not available to rent.');
      return;
    }
    try {
      setRenting(true);
      const data = await rentCar(id);
      const msg = (data && (data as any).message) ? (data as any).message : 'Successfully rented.';
      Alert.alert('Success', msg);
    } catch {
      Alert.alert('Error', 'Could not place the reservation');
    } finally { setRenting(false); }
  }

  console.log('RENDER! car:', car, 'loading:', loading, 'renting:', renting);

  return (
    <View style={{ flex: 1, backgroundColor: colors?.bg ?? '#f2f2f2' }}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Pressable style={styles.goBack} onPress={() => Alert.alert('Back', 'Navigation yok, sadece demo')}>
          <Text style={styles.goBackText}>Go Back</Text>
        </Pressable>
        <View style={styles.burger}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </View>
        <View style={styles.avatar} />
      </View>

      {/* İçerik */}
      <SafeAreaView edges={['left','right','bottom']} style={{ flex: 1 }}>
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
              <View style={[StyleSheet.absoluteFillObject as any, { backgroundColor: '#cfcfcf' }]} />
            )}
          </View>

          {/* Başlık (BMW) */}
          <Text style={styles.title}>{titleText}</Text>

          {/* Metadata */}
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

          {/* Fiyat */}
          <Text style={styles.price}>
            {loading ? 'Price: —' : `Price: DKK ${(car as any)?.price || '—'}/day`}
          </Text>

          <PrimaryButton title="Rent" onPress={handleRent} loading={renting} />
          {!!debugError && <Text style={{ color: 'red', textAlign: 'center' }}>{debugError}</Text>}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  goBack: { backgroundColor: '#444', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  goBackText: { color: '#fff', fontSize: 12 },
  burger: { marginLeft: 16, width: 28, gap: 4 },
  line: { height: 3, backgroundColor: '#e9e9e9', borderRadius: 2 },
  avatar: { marginLeft: 'auto', width: 36, height: 36, borderRadius: 18, backgroundColor: '#d9d9d9' },

  container: { padding: 20, gap: 16 },
  imageBox: { height: 220, marginTop: 24, borderRadius: 10, overflow: 'hidden', backgroundColor: '#b5b5b5' },

  title: {
    fontSize: typography?.title ?? 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  metaBox: { gap: 6, alignItems: 'center', marginTop: 6 },
  metaLine: {
    fontSize: (typography?.body ?? 14) + 2,
    color: '#222',
  },
  metaLabel: {
    color: '#111',
    fontWeight: '700',
  },

  description: { fontSize: typography?.body ?? 14, color: '#f1f1f1', lineHeight: 20, textAlign: 'center' },
  price: {
    fontSize: typography?.price ?? 22,
    color: '#222',
    textAlign: 'center',
    marginTop: 48,
    marginBottom: 8,
    fontWeight: '700',
  },
});
