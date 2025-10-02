import {useNavigation} from '@react-navigation/native';
import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ResetPasswordScreen() {
    const navigation = useNavigation();
    const [Email, SetEmail] = React.useState('Email');
    const onSend = () => {console.log("Email Sent");};

    return (
        <SafeAreaProvider>
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={SetEmail}
                    value={Email}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => onSend()}
            >
                <Text style={styles.buttonText}>Send</Text>
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
        marginTop: 40,
        borderWidth: 1,
        borderColor: '#000'
    },
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
        width: "60%",
        height: 50,
        marginRight: 20,
        marginTop: 40,
    },
    buttonText: {
        color: "#000",
        fontSize: 24,
        alignSelf: "center",
    },
    icon: {
        marginRight: 8,
    },
});