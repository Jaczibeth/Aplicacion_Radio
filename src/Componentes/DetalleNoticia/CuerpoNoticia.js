import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const CuerpoNoticia = ({ noticia}) => {
  if (!noticia) return null;

  const descripcion = noticia.descripcionCompleta || noticia.descripcion || 'Descripción no disponible';

  return (
    <View style={estilos.container}>
     
    

    
      <Text style={estilos.descripcion}>{descripcion}</Text>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  categoria: {
    backgroundColor: "#0364ff",
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 14,
  },

 

  descripcion: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});

export default CuerpoNoticia;