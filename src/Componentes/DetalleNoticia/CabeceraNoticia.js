import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { IconButton } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const CabeceraNoticia = ({ noticia, onCerrar, colorCategoria, onShare }) => {
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

      
      <View style={estilos.filaCategoriaShare}>
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

        <TouchableOpacity onPress={onShare} style={estilos.botonShare}>
          <Ionicons name="share-social-outline" size={22} color="#222" />
        </TouchableOpacity>
      </View>

      <Text style={estilos.titulo}>{noticia.titulo}</Text>

      <Text style={estilos.fuenteTiempo}>
        {noticia.fuente} • {noticia.tiempo}
      </Text>
    </View>
    
  );
  
};

const estilos = StyleSheet.create({
  contenedorImagen: { position: "relative" },
  imagen: {
    width: width,
    height: 250,
    resizeMode: "cover",
  },

  botonCerrar: {
    position: "absolute",
    top: 20,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 50,
    padding: 4,
  },

  /* NUEVO: fila categoría + botón share */
  filaCategoriaShare: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },

  etiquetaCategoria: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  textoCategoria: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  botonShare: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.05)",
  },

  titulo: {
    fontSize: 26,
    fontWeight: "700",
    marginHorizontal: 10,
    marginTop: 10,
    color: "#222",
  },

  fuenteTiempo: {
    fontSize: 14,
    color: "#888",
    marginHorizontal: 10,
    marginBottom: 12,
  },
});

export default CabeceraNoticia;
