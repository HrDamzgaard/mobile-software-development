import *as React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, Button } from 'react-native';

const screenwidth = Dimensions.get('window').width;


const ProfileScreen = () => {
  return (
    <View >
      <ProfileHeader />
      <RentedCars />
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
      <FlatList
          data={cars}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={listStyles.container}/>
  )
};

const ProfileHeader = () => {
  return(
    <View style={headerStyles.container}>
      <Image 
        source={require("../assets/images/profilepictures/yaris.png")} 
        style={{width: 200, height: 200, borderRadius: 100, marginTop: 20}}
        />
      <View style={headerStyles.button}>
        <Button title="Log Out" onPress={() => {}} />
      </View>
    </View>
    
  );
}
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
    container: {
    paddingVertical: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    width: screenwidth - 20,
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