
import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

export default function BarraComentarios({
  nuevoComentario,
  setNuevoComentario,
  manejarAgregarComentario,
  onShare,
}) {
  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.input}
        placeholder="Escribe un comentario..."
        value={nuevoComentario}
        onChangeText={setNuevoComentario}
      />

      {/* BOTÓN CON ÍCONO DE ENVIAR */}
      <IconButton
        icon="send"
        size={28}
        iconColor="white"
        style={estilos.botonIcono}
        onPress={manejarAgregarComentario}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
  },
  botonIcono: {
    backgroundColor: "#9ac6f5ff",
    borderRadius: 50,
    marginLeft: 5,
  },
  botonShare: {
    backgroundColor: "#28a745",
    marginLeft: 5,
    padding: 10,
    borderRadius: 8,
  },
  texto: { 
    color: "white" 
  },
});
