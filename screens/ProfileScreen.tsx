import *as React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, Button, TouchableOpacity } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';

const screenwidth = Dimensions.get('window').width;


const ProfileScreen = () => {
  return (
    <View >
      <ProfileHeader />
      <RentedCars />
    </View>
  );
}


const ProfileHeader = () => {
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
        console.log("test");
        if(buttonIndex === 0){
          console.log("take photo");
          takePhoto();
        }else if(buttonIndex === 1){
          console.log("pick from library");
          pickFromLibrary();
        }
      }
    );
  };

  return(
    <View style={headerStyles.container}>
      <TouchableOpacity onPress={onPressChangeProfilePicture}>
        <Image 
          source={profileImageUri ? {uri: profileImageUri} : require("../assets/images/profilepictures/yaris.png")}
          style={{width: 200, height: 200, borderRadius: 100, marginTop: 20}}
          />
      </TouchableOpacity>
      <View style={headerStyles.button}>
        <Button title="Log Out" onPress={() => {}} />
      </View>
    </View>
    
  );
}


// Yoinked from Mathias
const RentedCars: React.FC = () => {
  const renderItem = ({item}: {item: Car}) => (
        <View style={listStyles.card}>
        <Image source={require('../assets/icon.png')} style={listStyles.image}/>
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


type Car = {
  id: string;
  name: string;
  model: string;
  location: string;
  price: string;
  listingdate: string;
  image: any;
}

const cars: Car[] = [
    {
  id: '1',
  name: 'Car1',
  model: 'BMW',
  location: 'Copenhagen',
  price: '1000',
  listingdate: '01-01-2025',
  image: require('../assets/icon.png')
},
  {
    id: '2',
    name: 'Car2',
    model: 'Ferrari',
    location: 'Odense',
    price: '1200',
    listingdate: '03-07-2025',
    image: require('../assets/icon.png')
  },
  {
    id: '3',
    name: 'Car3',
    model: 'BMW',
    location: 'Copenhagen',
    price: '1000',
    listingdate: '01-01-2025',
    image: require('../assets/icon.png')
  },
  {
    id: '4',
    name: 'Car4',
    model: 'Ferrari',
    location: 'Odense',
    price: '1200',
    listingdate: '03-07-2025',
    image: require('../assets/icon.png')
  },
  {
    id: '5',
    name: 'Car5',
    model: 'BMW',
    location: 'Copenhagen',
    price: '1000',
    listingdate: '01-01-2025',
    image: require('../assets/icon.png')
  },
  {
    id: '6',
    name: 'Car6',
    model: 'Ferrari',
    location: 'Odense',
    price: '1200',
    listingdate: '03-07-2025',
    image: require('../assets/icon.png')
  },
  {
    id: '7',
    name: 'Car7',
    model: 'BMW',
    location: 'Copenhagen',
    price: '1000',
    listingdate: '01-01-2025',
    image: require('../assets/icon.png')
  },
  {
    id: '8',
    name: 'Car8',
    model: 'Ferrari',
    location: 'Odense',
    price: '1200',
    listingdate: '03-07-2025',
    image: require('../assets/icon.png')
  },]




  
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
      height: screenwidth * 1.2,
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: 10,
      backgroundColor: '#464444ff',
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