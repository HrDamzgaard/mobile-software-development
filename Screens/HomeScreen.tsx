import {useNavigation} from '@react-navigation/native';
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
import AntDesign from '@expo/vector-icons/AntDesign';

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


const HomeScreen: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();
    const onCar = () => {navigation.navigate("CarDetails");};
    useEffect(() => {
        const getCars = async () => {
            try {
                const responseCars = await fetch('http://localhost:8080/api/cars');
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

    useEffect(() => {
        const rentCar = async () => {
            try {
                const responseRent = await fetch('http://localhost:8080/api/rent/1', {method: 'PUT'});
                const data = responseRent.json();
                console.log(data.toString())
            } catch (error) {
                console.error('Cannot rent car 1 from endpoint.')
            } finally {
                setLoading(false);
            }
        };
        rentCar();
    }, []);

    const renderItem = ({item}: {item: Car}) => (
        <TouchableOpacity style={styles.card} onPress={onCar}>
            <Image source={{uri: item.image}} style={styles.image}/>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.model}>{item.model}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.listingDate}>{item.listingDate}</Text>
            </View>
        </TouchableOpacity>
    );
    if (loading) {
        return (
            <SafeAreaView style={[styles.containerScreen, {alignItems: 'center', justifyContent: 'center'}]}>
                <ActivityIndicator size="large" color="lightgrey"></ActivityIndicator>
            </SafeAreaView>
        )
    }
    return (
    <SafeAreaView style={styles.containerScreen}>
            <View>
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
    containerIcon: {
        alignItems: 'stretch',
    },
    headerBar: {
        backgroundColor: "#0597D5",
        height: 70,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
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