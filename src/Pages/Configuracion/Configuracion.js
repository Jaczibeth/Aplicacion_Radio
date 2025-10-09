import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking,  } from "react-native";
import { Card, Button } from "react-native-paper";
import { Rating } from 'react-native-ratings';
import { IconButton, Avatar } from "react-native-paper";

export default function Configuracion({ navigation }) {
  const [rating, setRating] = useState(0);

  return (
    <View style={estilos.contenedor}>

      {/* Barra superior con logo y título */}
      <View style={estilos.header}>
         <Avatar.Image size={50} source={require("../../../assets/Logos/nt-el-reloj.gif")} />
      </View>
      <ScrollView contentContainerStyle={estilos.scrollContenedor}>
        <Text style={estilos.titulo}>Configuración de la App</Text>
        <Text style={estilos.texto}>Ajusta las preferencias y da tu opinión sobre la aplicación.</Text>

        {/* Sección de calificación */}
        <Card style={estilos.card}>
          <Card.Content>
            <Text style={estilos.tituloCard}>¿Cómo calificarías nuestra aplicación?</Text>
            <Rating ratingCount={5}   imageSize={30}    startingValue={rating}   onFinishRating={(value) => setRating(value)}  style={estilos.rating}/>
            <Text style={estilos.textoRating}>{rating} estrellas</Text>
          </Card.Content>
        </Card>

        {/* Card de Políticas de Privacidad */}
        <Card style={estilos.card}>
          <Card.Content>
            <Text style={estilos.tituloCard}>Política de Privacidad</Text>
            <Button  title="Ver Política"  onPress={() => Linking.openURL('https://www.loreal-paris.com.mx/politica-de-privacidad?gclsrc=aw.ds&gad_source=1&gad_campaignid=20482487271&gbraid=0AAAAAC3qrxrGJUxh1uY-SjyiHr2ShaDoM&gclid=CjwKCAjwup3HBhAAEiwA7euZuqBadWXhcALZNB9FE2UU57EIv0kzNhpOpE5aHjqctumpmOvQc80UDBoCbV8QAvD_BwE')}   />
          </Card.Content>
        </Card>

        {/* Card de Términos y Condiciones */}
        <Card style={estilos.card}>
          <Card.Content>
            <Text style={estilos.tituloCard}>Términos y Condiciones</Text>
            <Button   title="Ver Términos"   onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/es/terms.html')}  />
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Barra inferior con un botón para ir al Home */}
      <View style={estilos.navbar}>
        <TouchableOpacity style={estilos.botonNav} onPress={() => navigation.navigate("Home")}>
          <IconButton icon="home"/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1,backgroundColor: "#f5f5f5",},
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: {width: 45, height: 45, marginRight: 10,},
  tituloHeader: { fontSize: 22, fontWeight: "bold", color: "#333",},
  scrollContenedor: {
    padding: 10,
    paddingBottom: 50, 
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginTop: 50,
    marginBottom: 15,
  },
  texto: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  card: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tituloCard: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  optionText: { fontSize: 16, color: "#333",},
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#c5d6e9ff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0, 
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 10,
  },
  botonNav: {
    flexDirection: "column",
    alignItems: "center",
  },
  navText: {
    color: "#0c0c0cff",
    marginTop: 5,
    fontSize: 12,
  },
  rating: {
    paddingVertical: 10,
    alignItems: "center",
  },
  textoRating: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 5,
    color: "#333",
  },
});