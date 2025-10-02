import {useNavigation} from '@react-navigation/native';
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function LogCreateScreen() {
    const navigation = useNavigation();
    const onLoginPressed = () => {navigation.navigate("LoginScreen");};
    const onCreatePressed = () => {navigation.navigate("CreateAccountScreen");};
    return (
        <SafeAreaProvider>
           <View style={stylesImg.container}>
               <Image source={require('C:\\Users\\olive\\mobile-software-development\\logo.png')} style={stylesImg}/>
           </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => onLoginPressed()}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        <TouchableOpacity
            style={styles.button}
            onPress={() => onCreatePressed()}
        >
            <Text style={styles.buttonText}>Create an Account</Text>
        </TouchableOpacity>
        </SafeAreaProvider>

    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#fff",
        borderColor: "#000",
        borderWidth: 1,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        marginVertical: 10,
        paddingHorizontal: 20,
        width: "75%",
        height: 50,
        marginRight: 20,
        marginBottom: 20,
        marginTop: 40,
    },
    buttonText: {
        color: "#000",
        fontSize: 24,
        alignSelf: "center",
    },
});

const stylesImg = StyleSheet.create({
    container: {
        borderWidth:1,
        borderColor:'rgba(0,0,0,0)',
        alignItems:'center',
        justifyContent:'center',
        width:200,
        height:200,
        backgroundColor:'#fff',
        borderRadius:90,
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 40,
    },
    image: {
        width:"100%",
        height:"100%",
    },
    icon: {
        alignSelf: 'center',
        width: 150,
        height: 150,
    }
});