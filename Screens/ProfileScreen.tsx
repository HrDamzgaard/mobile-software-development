import *as React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, Button, TouchableOpacity } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { Car } from '../types/Car';
import { useEffect } from 'react';
import { userAuth } from '../context/AuthContext';
import { Rental } from '../types/Rental';
import {BASE_URL} from "../src/api";
import {Ionicons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const screenwidth = Dimensions.get('window').width;


const ProfileScreen = () => {
  console.log("Rendering ProfileScreen");
  const { user } = userAuth();
  console.log("Current user:", user?.username);
  return (
    <View style={{ flex: 1 }}>
      <ProfileHeader />
      <RentedCars />
    </View>
  );
}

const ProfileHeader = () => {
  console.log("Rendering ProfileHeader");
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
    };
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
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          takePhoto();
        } else if (buttonIndex === 1) {
          pickFromLibrary();
        }
      }
    );
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
          style={{ width: 150, height: 150, borderRadius: 50, marginTop: 0 , marginLeft: 10}}
        />
      </TouchableOpacity>
      <View>

      <View >
        <Text style={[listStyles.name,{alignSelf: "center", marginLeft:10, marginTop: 35}]}>{username}</Text>
      </View>
        <TouchableOpacity
            style={[styles.button,{alignSelf: "center",marginLeft: 10. , marginTop: 50}]}
            onPress={logOut}
        >
          <View style={styles.row}>
            <Ionicons  name="exit-outline" size={20} color="black" style={styles.icon} />
            <Text style={styles.buttonText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
      <Text style={[listStyles.name,{marginLeft:25,marginBottom:5}]}>My Rides</Text>
    </View>

  );
}

const RentedCars: React.FC = () => {
  const [rentals, setRentals] = React.useState<Rental[]>([]);

  const { user } = userAuth();
  const username = user?.username;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/${username}/rentals`, {
          method: 'GET', });
        const data = await response.json();
        setRentals(data);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };
    fetchCars();
  }, []);

  const renderItem = ({ item }: { item: Rental }) => {

    const formattedDate = typeof item.rentalDate === 'string' ? item.rentalDate.substring(0, 10) : 'N/A';
    console.log("Rentals:", rentals);
    console.log("item image:",item.imageUrl);
    return (
        <LinearGradient
            colors={[ '#939393','#d3d3d3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.1 }}
            style={{borderRadius:20,marginBottom: 20}}
        >
      <View style={[listStyles.container,{borderRadius: 30}]}>
        <View style={styles.row}>
        <View style={listStyles.info}>
          <Text style={listStyles.location}>{formattedDate}</Text>
          <Text style={listStyles.name}> {item.model} {item.name}</Text>
          <Text style={listStyles.location}>{["€"+item.totalcost+" - "+item.days+" days"]}</Text>
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={listStyles.container}
        style={{ flex: 1 }} />
    </View>
)
};

const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#0597D5',
  }
});

const listStyles = StyleSheet.create({
  outerContainer: {
    width: screenwidth * 0.92,
    //height: screenwidth * 1.2,
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
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: 'hidden',
    width: screenwidth - 40,
    opacity: 0.85,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  model: {
    fontSize: 16,
    color: '#555',
  },
  location: {
    fontSize: 16,
    color: '#555',
  },
  price: {
    fontSize: 14,
    color: '#555',
  },
  listingdate: {
    fontSize: 14,
    color: '#555',
  },
  image: {
    width: 150,
    height: 75,
  },
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
  }
});
export default ProfileScreen;