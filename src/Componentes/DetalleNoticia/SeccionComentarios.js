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
  const abrirEditarComentario = (comentario) => {
    setComentarioEditando(comentario.id);
    setTextoEditando(comentario.texto);
    setVisibleDialog(true);
  };

  return (
    <>
    
      <TouchableOpacity onPress={() => setMostrarComentarios(!mostrarComentarios)}>
        <Text style={estilos.subtitulo}>
          Comentarios ({comentarios.length}) {mostrarComentarios ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      {mostrarComentarios && (
        <View style={estilos.contenedorComentarios}>
          <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ paddingBottom: 10 }}>
            {comentarios.length === 0 ? (
              <Text style={{ fontStyle: "italic", color: "#888", marginBottom: 20 }}>
                No hay comentarios aún.
              </Text>
            ) : (
              comentarios.map((c) => (
                <View key={c.id} style={estilos.comentario}>
                  <Text style={estilos.autorComentario}>{c.autor || "Anónimo"}</Text>
                  <Text style={estilos.textoComentario}>{c.texto}</Text>

                  
         

                  <Text style={estilos.autorComentario}>
                    {c.autor || "Anónimo"}
                  </Text>

                  <Text style={estilos.textoComentario}>{c.contenido}</Text>

                  <Text style={estilos.fechaComentario}>
                    {c.fecha ? new Date(c.fecha).toLocaleString() : ""}
                  </Text>
                  <View style={estilos.accionesComentario}>
                    <TouchableOpacity onPress={() => abrirEditarComentario(c)}>
                      <Text style={estilos.botonEditar}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => manejarEliminarComentario(c)}>
                      <Text style={estilos.botonEliminar}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
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
  subtitulo: { fontSize: 18, fontWeight: "600", marginVertical: 10, color: "#111" },
  contenedorComentarios: {
    maxHeight: height * 0.4,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fafafa"
  },
  comentario: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    elevation: 2
  },
  autorComentario: { fontWeight: "bold", color: "#333", marginBottom: 3 },
  textoComentario: { fontSize: 15, color: "#333" },
  fechaComentario: { fontSize: 12, color: "#999", marginTop: 4, textAlign: "right" },
  accionesComentario: { flexDirection: "row", marginTop: 5, justifyContent: "flex-end" },
  botonEditar: { color: "#007BFF", marginRight: 10 },
  botonEliminar: { color: "#FF0000" },
});

export default SeccionComentarios;
