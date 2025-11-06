import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get("window");

const SeccionComentarios = ({
  mostrarComentarios,
  setMostrarComentarios,
  comentarios,
  setComentarioEditando,
  setTextoEditando,
  setVisibleDialog,
  manejarEliminarComentario,
}) => {
  return (
    <>
      <TouchableOpacity onPress={() => setMostrarComentarios(!mostrarComentarios)}>
        <Text style={estilos.subtitulo}>
          Comentarios {mostrarComentarios ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {mostrarComentarios && (
        <View style={estilos.contenedorComentarios}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {comentarios.length === 0 ? (
              <Text style={{ fontStyle: "italic", color: "#888", marginBottom: 20 }}>
                No hay comentarios aún.
              </Text>
            ) : (
              comentarios.map((c, i) => (
                <View key={i} style={estilos.comentario}>
                  <Text style={estilos.autorComentario}>{c.autor}</Text>
                  <Text style={estilos.textoComentario}>{c.texto}</Text>
                  <Text style={estilos.fechaComentario}>{c.fecha}</Text>
                  {c.editable && (
                    <View style={estilos.accionesComentario}>
                      <TouchableOpacity
                        onPress={() => {
                          setComentarioEditando(i);
                          setTextoEditando(c.texto);
                          setVisibleDialog(true);
                        }}
                      >
                        <Text style={estilos.botonEditar}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => manejarEliminarComentario(i)}>
                        <Text style={estilos.botonEliminar}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const estilos = StyleSheet.create({
  subtitulo: {fontSize: 18,fontWeight: "600",marginVertical: 10,marginHorizontal: 10,color: "#111",},
  contenedorComentarios: { maxHeight: height * 0.4, marginHorizontal: 10,borderWidth: 1, borderColor: "#ddd",borderRadius: 10, padding: 10, backgroundColor: "#fafafa",},
  comentario: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginVertical: 5, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,},
  autorComentario: { fontWeight: "bold", color: "#333", marginBottom: 3,},
  textoComentario: { fontSize: 15, color: "#333",},
  fechaComentario: {fontSize: 12,color: "#999",marginTop: 4,textAlign: "right",},
  accionesComentario: {flexDirection: "row", marginTop: 5, justifyContent: "flex-end",},
  botonEditar: { color: "#007BFF", marginRight: 10,},
  botonEliminar: { color: "#FF0000",},});

export default SeccionComentarios;