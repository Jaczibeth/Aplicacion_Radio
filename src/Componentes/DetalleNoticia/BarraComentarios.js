import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { IconButton } from "react-native-paper";

const BarraComentarios = ({
  nuevoComentario,
  setNuevoComentario,
  manejarAgregarComentario,
  onShare,
}) => {
  return (
    <View style={estilos.barraComentario}>
      <TextInput
        style={estilos.inputComentario}
        placeholder="Comentar..."
        value={nuevoComentario}
        onChangeText={setNuevoComentario}
        onSubmitEditing={manejarAgregarComentario}
        returnKeyType="send"
      />
      <TouchableOpacity
        onPress={manejarAgregarComentario}
        style={estilos.botonEnviar}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onShare} style={estilos.botonIcono}>
        <IconButton icon="share" color="#e3d8d8ff" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const estilos = StyleSheet.create({
  barraComentario: {flexDirection: "row",alignItems: "center",paddingHorizontal: 8,paddingVertical: 8,borderTopWidth: 1,borderColor: "#ddd",backgroundColor: "#fff",},
  inputComentario: {flex: 1,height: 40,borderWidth: 1,borderColor: "#ccc",borderRadius: 20,paddingHorizontal: 15,fontSize: 14,},
  botonEnviar: {backgroundColor: "#6394B5",paddingVertical: 10,paddingHorizontal: 16,borderRadius: 25,marginLeft: 8,shadowColor: "#6394B5",shadowOpacity: 0.9,shadowRadius: 12, elevation: 10,},
  botonIcono: {alignItems: "center",justifyContent: "center", marginLeft: 12,  flexDirection: "row", },});

export default BarraComentarios;