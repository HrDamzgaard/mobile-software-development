import * as React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { userAuth } from '../context/AuthContext';
import { Rental } from '../types/Rental';
import { BASE_URL } from "../src/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const ProfileScreen = () => {
  const { user } = userAuth();
  return (
    <View style={{ flex: 1 }}>
      <ProfileHeader />
      <Text style={[listStyles.name, { marginLeft: 25, marginBottom: 8 }]}>My Rides (Backend)</Text>
      <RentedCars />
      <Text style={[listStyles.name, { marginLeft: 25, marginTop: 10, marginBottom: 8 }]}>Booking History (Local)</Text>
      <View style={{ flex: 1 }}>
        <BookingHistoryLocal username={user?.username || ''} />
      </View>
    </View>
  );
};

const ProfileHeader = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [profileImageUri, setProfileImageUri] = React.useState<string | null>(null);

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImageUri(uri);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      alert("Permission to access camera is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImageUri(uri);
    }
  };

  const onPressChangeProfilePicture = () => {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions({ options, cancelButtonIndex }, (buttonIndex) => {
      if (buttonIndex === 0) takePhoto();
      if (buttonIndex === 1) pickFromLibrary();
    });
  };

  const { logOut } = userAuth();
  const { user } = userAuth();
  const username = user?.username;

  return (
    <View>
      <View style={styles.row}>
        <TouchableOpacity onPress={onPressChangeProfilePicture}>
          <Image
            source={profileImageUri ? { uri: profileImageUri } : require("../assets/images/profilepictures/yaris.png")}
            style={{ width: 150, height: 150, borderRadius: 50, marginTop: 0, marginLeft: 10 }}
          />
        </TouchableOpacity>

        <View>
          <View>
            <Text style={[listStyles.name, { alignSelf: "center", marginLeft: 10, marginTop: 35 }]}>
              {username}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, { alignSelf: "center", marginLeft: 10, marginTop: 50 }]}
            onPress={logOut}
          >
            <View style={styles.row}>
              <Ionicons name="exit-outline" size={20} color="black" style={styles.icon} />
              <Text style={styles.buttonText}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const RentedCars: React.FC = () => {
  const [rentals, setRentals] = React.useState<Rental[]>([]);
  const { user } = userAuth();
  const username = user?.username;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/${username}/rentals`, { method: 'GET' });
        const data = await response.json();
        setRentals(data);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };
    if (username) fetchCars();
  }, [username]);

  const renderItem = ({ item }: { item: Rental }) => {
    const formattedDate = typeof item.rentalDate === 'string' ? item.rentalDate.substring(0, 10) : 'N/A';
    return (
      <LinearGradient
        colors={['#939393', '#d3d3d3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.1 }}
        style={{ borderRadius: 20, marginBottom: 12 }}
      >
        <View style={[listStyles.container, { borderRadius: 30 }]}>
          <View style={styles.row}>
            <View style={listStyles.info}>
              <Text style={listStyles.location}>{formattedDate}</Text>
              <Text style={listStyles.name}> {item.model} {item.name}</Text>
              <Text style={listStyles.location}>{["€" + item.totalcost + " - " + item.days + " days"]}</Text>
            </View>
            <Image source={{ uri: item.imageUrl }} style={listStyles.image} />
          </View>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={listStyles.card}>
      <FlatList
        data={rentals}
        renderItem={renderItem}
        keyExtractor={(item: any) => String(item.id)}
        contentContainerStyle={listStyles.container}
        scrollEnabled={false}
        style={{ flexGrow: 0 }}
      />
    </View>
  );
};

const BookingHistoryLocal: React.FC<{ username: string }> = ({ username }) => {
  const [items, setItems] = React.useState<LocalBooking[]>([]);

  const key = (u: string) => `booking_history_${u}`;

  const load = async () => {
    if (!username) return;
    const raw = await AsyncStorage.getItem(key(username));
    const arr: LocalBooking[] = raw ? JSON.parse(raw) : [];
    setItems(arr);
  };

  useEffect(() => {
    load();
  }, [username]);

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [username])
  );

  const nice = (iso: string) => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toISOString().substring(0, 10);
    } catch {
      return iso;
    }
  };

  const renderItem = ({ item }: { item: LocalBooking }) => {
    const img = item.imageUrl
      ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${BASE_URL}${item.imageUrl}`)
      : null;

    return (
      <View style={bh.card}>
        <View style={bh.left}>
          <Text style={bh.dates}>
            {nice(item.startDateISO)} → {nice(item.endDateISO)}
          </Text>

          <Text style={bh.model} numberOfLines={1}>
            {item.model || '—'}
          </Text>

          <Text style={bh.location} numberOfLines={1}>
            {item.location || '—'}
          </Text>

          <View style={bh.metaRow}>
            <Text style={bh.metaText}>{item.days} days</Text>
            <Text style={bh.dot}>•</Text>
            <Text style={bh.metaText}>DKK {item.totalCost}</Text>
          </View>

          <Text style={bh.id} numberOfLines={1}>
            ID: {item.bookingId}
          </Text>
        </View>

        <View style={bh.right}>
          {img ? <Image source={{ uri: img }} style={bh.thumb} /> : <View style={bh.thumbPlaceholder} />}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.bookingId}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
        style={{ flex: 1 }}
        nestedScrollEnabled
        showsVerticalScrollIndicator
        ListEmptyComponent={
          <Text style={{ padding: 14, color: '#666' }}>No local bookings yet.</Text>
        }
      />
    </View>
  );
};

const listStyles = StyleSheet.create({
  outerContainer: {
    width: screenwidth * 0.92,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    flex: 1,
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: "center",
    borderRadius: 5,
  },
  card: {
    flexDirection: 'row',
    marginVertical: 6,
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: 'hidden',
    width: screenwidth - 40,
    opacity: 0.95,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 16,
    color: '#555',
  },
  image: {
    width: 150,
    height: 75,
  },
});

const bh = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  left: { flex: 1, paddingRight: 10 },
  right: { width: 96, alignItems: 'flex-end' },

  dates: { fontSize: 12, color: '#666', marginBottom: 4 },
  model: { fontSize: 18, fontWeight: '800', color: '#111' },
  location: { fontSize: 13, color: '#444', marginTop: 2 },

  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText: { fontSize: 12, color: '#333', fontWeight: '600' },
  dot: { marginHorizontal: 6, color: '#999' },

  id: { fontSize: 11, color: '#888', marginTop: 6 },

  thumb: { width: 96, height: 64, borderRadius: 10, backgroundColor: '#f3f3f3' },
  thumbPlaceholder: { width: 96, height: 64, borderRadius: 10, backgroundColor: '#f3f3f3' },
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 20,
    width: 200,
    height: 50,
    marginBottom: 20,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    alignSelf: "center",
  },
  icon: {
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginRight: 15,
  },
});

export default ProfileScreen;
