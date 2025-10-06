import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { userAuth } from "../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';

const AppHeader: React.FC = ({navigation, route, profile}) => {
    const insets = useSafeAreaInsets();
    const {user} = userAuth();

    return (
        <SafeAreaView >
            <View>
                <View style={styles.headerBar}>
                    <View style={[styles.containerIcon]}>
                        <Ionicons name="menu-outline" size={32} color="white"/>
                    </View>
                    <View style={[styles.containerIcon]}>
                        <Ionicons name="person-circle-outline" size={32} color="white" onPress={() => navigation.navigate('ProfileScreen')} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default AppHeader;



const styles = StyleSheet.create({
    headerBar: {
        backgroundColor: "#0597D5",
        height: 70,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    containerScreen: {
        paddingTop: 50,
    },
    containerIcon: {
        paddingVertical: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
    },
});