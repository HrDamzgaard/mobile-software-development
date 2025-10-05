import { StatusBar } from 'expo-status-bar';
import {FlatList, StyleSheet, Text, View, Dimensions, Image, Linking, TouchableOpacity} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (<
      HomeScreen></HomeScreen>
  );
}

type Car = {
  id: string;
  name: string;
  model: string;
  location: string;
  price: string;
  listingdate: string;
  image: Image;
}

const cars: Car[] = [
    {
  id: '1',
  name: 'Car1',
  model: 'BMW',
  location: 'Copenhagen',
  price: '1000',
  listingdate: '01-01-2025',
  image: require('./assets/icon.png')
},
  {
    id: '2',
    name: 'Car2',
    model: 'Ferrari',
    location: 'Odense',
    price: '1200',
    listingdate: '03-07-2025',
    image: require('./assets/icon.png')
  },
  {
    id: '3',
    name: 'Car3',
    model: 'BMW',
    location: 'Copenhagen',
    price: '1000',
    listingdate: '01-01-2025',
    image: require('./assets/icon.png')
  },
  {
    id: '4',
    name: 'Car4',
    model: 'Ferrari',
    location: 'Odense',
    price: '1200',
    listingdate: '03-07-2025',
    image: require('./assets/icon.png')
  },
  {
    id: '5',
    name: 'Car5',
    model: 'BMW',
    location: 'Copenhagen',
    price: '1000',
    listingdate: '01-01-2025',
    image: require('./assets/icon.png')
  },
  {
    id: '6',
    name: 'Car6',
    model: 'Ferrari',
    location: 'Odense',
    price: '1200',
    listingdate: '03-07-2025',
    image: require('./assets/icon.png')
  },
  {
    id: '7',
    name: 'Car7',
    model: 'BMW',
    location: 'Copenhagen',
    price: '1000',
    listingdate: '01-01-2025',
    image: require('./assets/icon.png')
  },
  {
    id: '8',
    name: 'Car8',
    model: 'Ferrari',
    location: 'Odense',
    price: '1200',
    listingdate: '03-07-2025',
    image: require('./assets/icon.png')
  },]

type HeaderComponentProps = {
  title: string;
  view?: string;
};

type ParamList = {
  Detail: {
    openDrawer: void;
  };
};


const HomeScreen: React.FC = () => {
  const renderItem = ({item}: {item: Car}) => (
        <View style={styles.card}>
        <Image source={require('./assets/icon.png')} style={styles.image}/>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.model}>{item.model}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.listingdate}>{item.listingdate}</Text>
        </View>
      </View>
  );
  return (
      <FlatList
          data={cars}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.container}/>
  )
};
const screenwidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
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
})