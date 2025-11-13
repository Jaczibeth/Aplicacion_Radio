import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const CuerpoNoticia = ({ noticia }) => {
  return (
    <ScrollView style={estilos.container}>
      <Text style={estilos.descripcion}>
        {noticia.descripcionCompleta || noticia.descripcion}
      </Text>
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  descripcion: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});

export default CuerpoNoticia;