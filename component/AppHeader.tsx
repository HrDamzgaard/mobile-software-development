import React from "react";
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from "react-native";
import { userAuth } from "../context/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';


interface AppHeaderProps {
    navigation: any;
    options: { title: string };
}

const AppHeader: React.FC<AppHeaderProps> = ({options}) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView >
            <View>
                <View style={styles.headerBar}>
                    <TouchableOpacity style={styles.containerIcon} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <Ionicons name="menu-outline" size={32} color="black" />
                    </TouchableOpacity>
                    <Text style={{color: "black", fontSize: 20, fontWeight: "bold"}}>{options.title}</Text>
                    <View style={[styles.containerIcon]}>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Ionicons name="person-circle-outline" size={32} color="black" />
                        </TouchableOpacity>
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