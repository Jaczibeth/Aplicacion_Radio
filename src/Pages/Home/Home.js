import { StyleSheet, View, Text } from "react-native";

export default function CardBasico( ) {
    return (
        <View style={style.card}>  
            <Text style={style.titulo}>PANTALLA DE INICIO</Text>
        </View>
    );
}
const style = StyleSheet.create({
    card:{
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 40,
        borderRadius: 10,
        shadowColor: '#f9e2feff',
        elevation: 1,
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    titulo:{
        fontSize: 14,
        fontWeight: 'bold',
    },
});