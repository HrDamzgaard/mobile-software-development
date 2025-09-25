import {useNavigation} from '@react-navigation/native';
import {Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function LogCreateScreen() {
    const navigation = useNavigation();
    const onLoginPressed = () => {navigation.navigate("LoginScreen");};
    const onCreatePressed = () => {navigation.navigate("CreateScreen");};

    return (
        <SafeAreaProvider>
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
        backgroundColor: "#1E90FF",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        marginVertical: 10,
        paddingHorizontal: 20,
        width: "75%",
        height: 50,
        marginRight: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 24,
        alignSelf: "center",
    },
});
