import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, Text, TextInput, TouchableOpacity, View} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useEffect} from "react";


export default function CreateAccountScreen() {
        const navigation = useNavigation();
        const [Name, SetName] = React.useState('');
        const [Email, SetEmail] = React.useState('');
        const [Number, SetNumber] = React.useState('');
        const [Password, SetPassword] = React.useState('');
        const [image, setImage] = useState<string | null>(null);
        const onHome = () => {navigation.navigate("HomeScreen");};

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [3, 2],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };



            const createAccount = async () => {
                try {
                    const responseUser = await fetch(`http://192.168.56.1:8080/api/users/create/${Name}/${Email}/${Password}/${Number}`,{ method: "POST" }
                    );
                    console.log("user saved");
                    console.log(responseUser.url);
                    onHome();
                } catch (error) {
                    console.error('Cannot save user on endpoints')
                }
            };


        return (
            <SafeAreaProvider>
                    <View style={styles.inputContainer}>
                        <Ionicons  name="person" size={20} color="black" style={styles.icon} />
                        <TextInput
                            placeholder="Full name"
                            style={styles.input}
                            onChangeText={SetName}
                            value={Name}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons  name="mail-outline" size={20} color="black" style={styles.icon} />
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            onChangeText={SetEmail}
                            value={Email}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <AntDesign  name="phone" size={20} color="black" style={styles.icon} />
                        <TextInput
                            placeholder="Phone number"
                            keyboardType="phone-pad"
                            style={styles.input}
                            onChangeText={SetNumber}
                            value={Number}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="black" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            keyboardType="visible-password"
                            onChangeText={SetPassword}
                            value={Password}
                        />
                    </View>
                <View style={stylesImg.wrapper}>
                    <Text style={stylesImg.Text}>Profile Picture:</Text>
                    <TouchableOpacity onPress={pickImage} style={stylesImg.container}>
                        {image ? (
                            <Image source={{ uri: image }} style={stylesImg.image} />
                        ) : (
                            <Ionicons name="person" size={40} color="gray" /> // placeholder icon
                        )}
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                        createAccount()
                        }>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
            </SafeAreaProvider>
        );
}

    const styles = StyleSheet.create({
        input: {
            flex: 1,
            fontSize: 16,
        },
        inputContainer: {
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f1f1f1",
            borderRadius: 10,
            paddingHorizontal: 10,
            width: "90%",
            height: 50,
            marginTop: 20,
            borderWidth: 1,
            borderColor: '#000'
        },
        icon: {
            marginRight: 8,
        },
        button: {
            backgroundColor: "#fff",
            borderColor: "#000",
            borderWidth: 1,
            alignSelf: "flex-end",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            marginVertical: 10,
            paddingHorizontal: 20,
            width: "60%",
            height: 50,
            marginRight: 20,
        },
        buttonText: {
            color: "#000",
            fontSize: 24,
            alignSelf: "center",
        },
    });

    const stylesImg = StyleSheet.create({
        wrapper: {
            alignItems: "center",
            marginTop: 20,
            paddingLeft: 20,
        },
        container: {
            borderWidth:1,
            borderColor:'rgba(0,0,0,0.2)',
            alignItems:'center',
            justifyContent:'center',
            width:125,
            height:125,
            backgroundColor:'#fff',
            borderRadius:90,
            overflow: "hidden",
            alignSelf: "flex-start",
        },
        image: {
            width:"100%",
            height:"100%",
        },
        Text: {
            color: "#000",
            fontSize: 20,
            alignSelf: "flex-start",
        },
    });