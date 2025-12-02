import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

export default function BarraComentarios({
  nuevoComentario,
  setNuevoComentario,
  manejarAgregarComentario,
 
}) {
  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.input}
        placeholder="Escribe un comentario aqui porfavor..."
        value={nuevoComentario}
        onChangeText={setNuevoComentario}
      />

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
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff",
  },
  botonIcono: {
    backgroundColor: "#007AFF",
    borderRadius: 50,
    marginLeft: 5,
  },
});
