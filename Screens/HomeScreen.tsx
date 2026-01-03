import {useNavigation} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Modalize } from 'react-native-modalize';
import { SearchBar } from 'react-native-elements';

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
import {SafeAreaView} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import {BASE_URL} from "../src/api";
import Slider from "@react-native-community/slider";



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
    totalPrice: number;
}




const HomeScreen: React.FC = () => {
    const [allCars, setAllCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();
    const onCar = (id: string) => {navigation.navigate("CarDetails", { id });};
    const modalizeRef = useRef<Modalize>(null);
    const [maxPrice, setMaxPrice] = useState(500);
    const [BmwImageUri] = React.useState<string | null>(null);
    const [OpelImageUri] = React.useState<string | null>(null);
    const [KiaImageUri] = React.useState<string | null>(null);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    const applyFilters = () => {
        let result = allCars;

        result = result.filter(car => Number(car.price) <= maxPrice);

        if (selectedBrands.length > 0) {
            result = result.filter(car =>
                selectedBrands.includes(car.model)
            );
        }

        setFilteredCars(result);
        modalizeRef.current?.close();
    }

    useEffect(() => {
        const getCars = async () => {
            try {
                const responseCars = await fetch(`${BASE_URL}/api/cars/available`);
                const data = await responseCars.json();
                setAllCars(data);
                setFilteredCars(data);
            } catch (error) {
                console.error('Cannot get cars from endpoint')
            } finally {
                setLoading(false);
            }
        };
        getCars();
    }, []);


    const renderItem = ({item}: {item: Car}) => (
    <LinearGradient
            colors={[ '#0597D5','#4DCAFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.1 }}
            style={styles.card}
        >
        <TouchableOpacity
            style={styles.cardContent}
            activeOpacity={0.9}
            onPress={() => onCar(item.id)}
        >
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.row}>
                    <Ionicons  name="car-sport-sharp" size={20} color="black" style={styles.icon} />
                    <Text style={styles.model}>{item.model}</Text>
                </View>
                <View style={styles.row}>
                    <Ionicons  name="globe-sharp" size={20} color="black" style={styles.icon} />
                    <Text style={styles.location}>{item.location}</Text>
                </View>
                <View style={styles.row}>
                    <Ionicons  name="calendar-clear-sharp" size={20} color="black" style={styles.icon} />
                    <Text style={styles.listingDate}>{item.listingDate}</Text>
                </View>
            </View>
            <View>
                <Image source={{uri: item.image}} style={styles.image}/>
                <Text style={styles.price}>{"€"+item.price.toString()+" / Day"}</Text>
            </View>
        </TouchableOpacity>
</LinearGradient>

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
        <View style={styles.row}>

            <SearchBar
                containerStyle={styles.searchBar}
                inputContainerStyle={styles.searchBarInput}
                placeholder="Type Here..."
                placeholderTextColor = "black"
                searchIcon={{ color: '#000' }}
                onChangeText={setSearch}
                value={search}
            />

            <TouchableOpacity  style={styles.filterButton} onPress={() => modalizeRef.current?.open()}>
                <Ionicons name="filter-sharp" size={28} color="black"   />
            </TouchableOpacity>


        </View>

            <View>
                <FlatList
                    data={filteredCars}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.container}/>

            </View>

            <Modalize ref={modalizeRef} snapPoint={500}>
                <View style={{ padding: 20 }}>
                    <Text style={styles.name}>Filter Options</Text>
                </View >
                <View style={styles.sliderCard}>
                    <Text style={styles.sliderText}>{maxPrice}</Text>
                </View>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={500}
                    onValueChange={setMaxPrice}
                    minimumTrackTintColor="#0597D5"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#0597D5"
                    step={10}
                />
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Veichle Brand</Text>
                <View style={[styles.row, {alignItems: 'center',justifyContent: 'center'}]}>
                    <TouchableOpacity
                        style={styles.ButtonRow}
                        onPress={() => toggleBrand('BMW')}
                    >
                        <Image
                            source={BmwImageUri ? { uri: BmwImageUri } : require("../assets/images/profilepictures/bmw_logo.png")}
                            style={{ width: 25, height: 25 , marginLeft: 5}}
                        />
                        <Text style={styles.ButtonName}>BMW</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.ButtonRow}
                        onPress={() => toggleBrand('Opel')}>
                        <Image
                            source={OpelImageUri ? { uri: OpelImageUri } : require("../assets/images/profilepictures/opel_logo.png")}
                            style={{ width: 25, height: 25, marginLeft: 5}}
                        />
                        <Text style={styles.ButtonName}>Opel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.ButtonRow}
                        onPress={() => toggleBrand('Kia')}>
                        <Image
                            source={KiaImageUri ? { uri: KiaImageUri } : require("../assets/images/profilepictures/kia_logo.png")}
                            style={{ width: 50, height: 10 , marginLeft: 5}}
                        />
                        <Text style={styles.ButtonName}>Kia</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.confirmButton} onPress={applyFilters}>
                    <Text>confirm</Text>
                </TouchableOpacity>
            </Modalize>
        </SafeAreaView>

    )
};
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const styles = StyleSheet.create({
    searchBar: {
        width: screenWidth - 20,
        marginHorizontal: 10,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 0,
    },
    searchBarInput: {
        backgroundColor: '#0597D5',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000',
        height: 48,
    },
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
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 8,
        overflow: 'hidden',
        width: screenWidth - 20,
        height: 200,
        opacity: 0.85,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },

    image: {
        width: 200,
        height: 100,
    },
    info: {
        flex: 1,
        padding: 10,

    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom:  15,
    },
    model: {
        fontSize: 14,
        color: '#000',
    },
    location: {

        fontSize: 14,
        color: '#000',
    },
    price: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#000',
        paddingTop: 55,
        paddingLeft: 100,
    },
    listingDate: {
        fontSize: 14,
        color: '#000',
    },
    icon: {
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginRight: 15,
    },
    filterButton: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 16,
        top: '45%',
        transform: [{ translateY: -11 }],
        backgroundColor: '#0597D5',
    },
    slider: {
        width: screenWidth - 50,
        left: 10,
    },
    sliderText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    sliderCard: {
        marginTop: 10,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginRight: 15,
        width: 100,
        backgroundColor: '#d3d3d3',
        borderRadius: 5,
    },
    ButtonName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 5
    },
    filterOverlay: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -11 }],
    },
    confirmButton: {
        width: screenWidth - 50,
        height: 50,
        marginLeft: 25,
        marginTop: 50,
        backgroundColor: '#0597D5',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    }

})