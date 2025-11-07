import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

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
      <TouchableOpacity style={estilos.boton} onPress={manejarAgregarComentario}>
        <Text style={estilos.texto}>Enviar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.botonShare} onPress={onShare}>
        <Text style={estilos.texto}> compartir</Text>
      </TouchableOpacity>
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
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8 },
  boton: {
    backgroundColor: "#007AFF",
    marginLeft: 5,
    padding: 10,
    borderRadius: 8,
  },
  botonShare: {
    backgroundColor: "#28a745",
    marginLeft: 5,
    padding: 10,
    borderRadius: 8,
  },
  texto: { color: "white" },
});
