import { StatusBar } from 'expo-status-bar';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Linking,
  TouchableOpacity,
  Platform,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from "react-native";
import {useEffect, useState} from "react";

export default function App() {
  return (
      <HomeScreen></HomeScreen>
  );
}

type Car = {
  id: string;
  name: string;
  model: string;
  location: string;
  price: string;
  listingDate: string;
  image: string;
}

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
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCars = async () => {
      try {
        const responseCars = await fetch('http://10.0.2.2:8080/api/cars');
        const data = await responseCars.json();
        setCars(data);
      } catch (error) {
        console.error('Cannot get cars from endpoint')
      } finally {
        setLoading(false);
      }
    };
    getCars();
  }, []);

  const renderItem = ({item}: {item: Car}) => (
        <View style={styles.card}>
        <Image source={{uri: item.image}} style={styles.image}/>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.model}>{item.model}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.listingDate}>{item.listingDate}</Text>
        </View>
      </View>
  );
  if (loading) {
    return (
        <SafeAreaView style={[styles.containerScreen,
          {alignItems: 'center', justifyContent: 'center'}]}>
          <ActivityIndicator size="large" color="lightgrey"></ActivityIndicator>
        </SafeAreaView>
    )
  }
  return (
        <SafeAreaView style={styles.containerScreen}>
          <View>
            <View style={styles.headerBar}>
              <Ionicons name="home" size={32} color="white"/>
            </View>
          <FlatList
              data={cars}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.container}/>
          </View>
        </SafeAreaView>
  )
};
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  containerScreen: {
    paddingTop: 52
  },
  headerBar: {
    backgroundColor: "lightblue",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
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
    width: screenWidth - 20,
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
  listingDate: {
    fontSize: 14,
    color: '#555',
  },
})