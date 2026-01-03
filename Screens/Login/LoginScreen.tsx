import {useNavigation} from '@react-navigation/native';
import {Button, StyleSheet, TextInput, TouchableOpacity, View, Text} from "react-native";
import React from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import ResetPasswordScreen from "./ResetPasswordScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userAuth } from '../../context/AuthContext';
import {BASE_URL} from "../../src/api";

export default function LoginScreen() {
    const navigation = useNavigation();
    const [Name, SetName] = React.useState('');
    const [Password, SetPassword] = React.useState('');
    const onResetPressed = () => {navigation.navigate("ResetPasswordScreen");};
    const {login} = userAuth();


    const checkLogin = async() => {
        try{
            const response = await fetch(`${BASE_URL}/api/users`)
            const users = await response.json();
            console.log(users);
            const matchedUser = users.find(user => user.username === Name && user.password === Password);
            console.log(matchedUser);
            if(matchedUser != null){
                await AsyncStorage.setItem("userData", JSON.stringify(matchedUser));
                login(matchedUser);
                console.log(await AsyncStorage.getItem("userData"));
            }
        }
        catch (e) {
            console.error("Error");
        } };


        return (
            <SafeAreaProvider>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person" size={20} color="black" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="User Name"
                            onChangeText={SetName}
                            value={Name}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons  name="lock-closed-outline" size={20} color="black" style={styles.icon} />
                        <TextInput
                            placeholder="Password"
                            style={styles.input}
                            onChangeText={SetPassword}
                            value={Password}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.ResPass}
                        onPress={() => onResetPressed()}
                    >
                        <Text>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => checkLogin()}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
            </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
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
    input: {
        flex: 1,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#fff",
        borderColor: "#000",
        borderWidth: 1,
        alignSelf: "center",
        justifyContent: "center",
        borderRadius: 8,
        marginVertical: 10,
        paddingHorizontal: 20,
        width: "60%",
        height: 50,

    },
    buttonText: {
        color: "#000",
        fontSize: 24,
        alignSelf: "center",
    },
    ResPass: {
        color: "#fff",
        paddingHorizontal: 20,

    }
});