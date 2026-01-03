import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';



import PrimaryButton from '../src/components/PrimaryButton';
import { BASE_URL, fetchCar, rentCar } from '../src/api';
import colors from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import type { Car } from '../src/types';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userAuth } from "../context/AuthContext";

export default function CarDetails() {
  const route = useRoute();
  const id = route.params ? (route.params as any).id : null;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);

  const BRAND = colors.brand; 
  const LIGHT = colors.light; 

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

  const { user } = userAuth();
  const username = user?.username;


  async function handleRent() {
    const response = await fetch(`${BASE_URL}/api/rent/${car?.id}/${username}`, {
      method: 'PUT', });
    Alert.alert('Rented', 'Successfully rented.')
    return;
    const s = statusRaw.toLowerCase();
    if (s && s !== 'available') {
      Alert.alert('Error', 'This car is not available to rent.');
      return;
    }
    try {
      setRenting(true);
      const data = await rentCar(id,username);
      const msg = (data && (data as any).message) ? (data as any).message : 'Successfully rented.';
      Alert.alert('Success', msg);
    } catch {
      Alert.alert('Error', 'Could not place the reservation');
    } finally { setRenting(false); }
  }

const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      <View>

      </View>

      {/* Content */}
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

          {/* Title */}
          <Text style={styles.title}>{titleText}</Text>

          {/* Description */}
          {(car as any)?.description ? (
            <Text style={styles.description}>{String((car as any).description)}</Text>
          ) : null}

          {/* Data */}
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

          {/* FİYAT */}
          <Text style={styles.price}>
            {loading ? 'Price: —' : `Price: DKK ${(car as any)?.price || '—'}/day`}
          </Text>

          {/* RENT */}
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

  
  // Back button 
  backRow: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 0, backgroundColor: '#fff' },
  goBack: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  goBackText: { color: '#fff', fontFamily: typography.family.semibold, fontSize: 12 },

  // CONTENT
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
  metaLine: {
    fontSize: typography.body + 2,
    color: '#222',
    fontFamily: typography.family.regular,
  },
  metaLabel: {
    color: colors.brand,
    fontFamily: typography.family.semibold,
  },

  price: {
    fontSize: typography.price,
    color: colors.brand,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
    fontFamily: typography.family.bold,
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: typography.family.regular,
  },
});
