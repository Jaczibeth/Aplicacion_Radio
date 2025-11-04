import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { IconButton } from "react-native-paper";

const { width } = Dimensions.get("window");

const CabeceraNoticia = ({ noticia, onCerrar, colorCategoria }) => {
  return (
    <View>
      <View style={estilos.contenedorImagen}>
        {noticia.imagen && (
          <Image source={{ uri: noticia.imagen }} style={estilos.imagen} />
        )}
        <TouchableOpacity style={estilos.botonCerrar} onPress={onCerrar}>
          <IconButton icon="close-thick" iconColor="#d50e0eff" size={38} />
        </TouchableOpacity>
      </View>
      {noticia.categoria && (
        <View
          style={[
            estilos.etiquetaCategoria,
            { backgroundColor: colorCategoria },
          ]}
        >
          <Text style={estilos.textoCategoria}>{noticia.categoria}</Text>
        </View>
      )}
      <Text style={estilos.titulo}>{noticia.titulo}</Text>
      <Text style={estilos.fuenteTiempo}>
        {noticia.fuente} • {noticia.tiempo}
      </Text>
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedorImagen: { position: "relative",},
  imagen: {  width: width,  height: 250,  resizeMode: "cover",},
  botonCerrar: {
  position: "absolute",
  top: 20,
  right: 0,
  backgroundColor: "rgba(226, 221, 221, 0.21)",
  borderRadius: 50,
  padding: 6,
  backdropFilter: "blur(5px)", 
  borderWidth: 1,
  borderColor: "rgba(233, 231, 231, 0.08)",
},

  etiquetaCategoria: {alignSelf: "flex-start",paddingHorizontal: 12,paddingVertical: 6,borderRadius: 20,margin: 10,},
  textoCategoria: {color: "#fff",fontWeight: "bold",fontSize: 14,},
  titulo: {fontSize: 26,fontWeight: "700",marginHorizontal: 10,marginBottom: 8, color: "#222",},
  fuenteTiempo: {fontSize: 14,color: "#888",marginHorizontal: 10, marginBottom: 12, },});

export default CabeceraNoticia;