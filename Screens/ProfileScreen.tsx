import *as React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, Button, TouchableOpacity } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import { Car } from '../types/Car';
import { useEffect } from 'react';
import { userAuth } from '../context/AuthContext';

const screenwidth = Dimensions.get('window').width;


const ProfileScreen = () => {
  console.log("Rendering ProfileScreen");
  return (
    <View style={{flex: 1}}>
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
    if(!perm.granted){
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    });
    if(!result.canceled){
      const uri = result.assets[0].uri;
      setProfileImageUri(uri);
    }
  };
  
  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if(!perm.granted){
      alert("Permission to access camera is required!");
      return;
    };
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    });
    if(!result.canceled){
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
        if(buttonIndex === 0){
          takePhoto();
        }else if(buttonIndex === 1){
          pickFromLibrary();
        }
      }
    );
  };

  const {logOut} = userAuth();

  return(
    <View style={headerStyles.container}>
      <TouchableOpacity onPress={onPressChangeProfilePicture}>
        <Image 
          source={profileImageUri ? {uri: profileImageUri} : require("../assets/images/profilepictures/yaris.png")}
          style={{width: 200, height: 200, borderRadius: 100, marginTop: 20}}
          />
      </TouchableOpacity>
      <View style={headerStyles.button}>
        <Button title="Log Out" onPress={logOut} />
      </View>
    </View>
    
  );
}

const RentedCars: React.FC = () => {
  const [cars, setCars] = React.useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://192.168.1.94:8080/api/cars');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching car:', error);
      }
    };
    fetchCars();
  }, []);

  const renderItem = ({item}: {item: Car}) => (
        <View style={listStyles.card}>
        <Image source={{uri: item.image}} style={listStyles.image}/>
        <View style={listStyles.info}>
          <Text style={listStyles.name}>{item.name}</Text>
          <Text style={listStyles.model}>{item.model}</Text>
          <Text style={listStyles.location}>{item.location}</Text>
          <Text style={listStyles.price}>{item.price}</Text>
          <Text style={listStyles.listingdate}>{item.listingdate}</Text>
        </View>
      </View>
  );
  return (
    <View style={listStyles.outerContainer}>
      <FlatList
          data={cars}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={listStyles.container}
          style={{flex: 1}}/>
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
    }
  });

  const listStyles = StyleSheet.create({
    outerContainer: {
      width: screenwidth * 0.92,
      //height: screenwidth * 1.2,
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: 10,
      backgroundColor: '#464444ff',
      flex: 1,
  },
    container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#a19f9fff',
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,

  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  model: {
    fontSize: 14,
    color: '#555',
  },
  location: {
    fontSize: 14,
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
  });

export default ProfileScreen;