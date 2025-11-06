import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CuerpoNoticia = ({ noticia }) => {
  return (
    <View>
      <Text style={estilos.descripcion}>{noticia.descripcion}</Text>
      {noticia.descripcionCompleta && (
        <>
          <Text style={estilos.subtitulo}>Detalles</Text>
          <Text style={estilos.detalle}>{noticia.descripcionCompleta}</Text>
        </>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({descripcion: {fontSize: 16,lineHeight: 24, color: "#333", marginHorizontal: 10,},
  subtitulo: { fontSize: 18, fontWeight: "600", marginVertical: 10, marginHorizontal: 10, color: "#111", },
  detalle: { fontSize: 16, color: "#444", lineHeight: 24, marginHorizontal: 10,marginBottom: 10, },});

export default CuerpoNoticia;