import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, Dimensions, Share, KeyboardAvoidingView, Platform, Alert, } from "react-native";
import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dialog from "react-native-dialog";
import { coloresCategorias } from "../configuracion/colores";

export default function DetalleNoticia({ noticia, onCerrar }) {
  if (!noticia) return null;
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const colorCategoria = coloresCategorias[noticia.categoria] || coloresCategorias["Otro"];
  const storageComentariosKey = `comentariosNoticia_${noticia.id}`;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const almacenados = await AsyncStorage.getItem(storageComentariosKey);
        if (almacenados) setComentarios(JSON.parse(almacenados));


      } catch (error) {
        console.log("Error al cargar datos en detalle:", error);
      }
    };
    cargarDatos();
  }, [noticia.id]);

  const guardarComentarios = async (nuevosComentarios) => {
    try {
      await AsyncStorage.setItem(
        storageComentariosKey,
        JSON.stringify(nuevosComentarios)
      );
    } catch (error) {
      console.log("Error al guardar comentarios:", error);
    }
  };

  const manejarAgregarComentario = async () => {
    if (nuevoComentario.trim() === "") return;
    const nuevo = {
      autor: "Anónimo",
      texto: nuevoComentario.trim(),
      fecha: new Date().toLocaleString(),
      editable: true,
    };
    const nuevosComentarios = [nuevo, ...comentarios];
    setComentarios(nuevosComentarios);
    await guardarComentarios(nuevosComentarios);
    setNuevoComentario("");
  };

  const manejarEditarComentario = async () => {
    const copia = [...comentarios];
    copia[comentarioEditando].texto = textoEditando;
    setComentarios(copia);
    await guardarComentarios(copia);
    setVisibleDialog(false);
  };

  const manejarEliminarComentario = async (index) => {
    Alert.alert("Eliminar comentario", "¿Seguro que quieres eliminar este comentario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const copia = comentarios.filter((_, i) => i !== index);
          setComentarios(copia);
          await guardarComentarios(copia);
        },
      },]);
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `${noticia.titulo}\n\n${noticia.descripcion}\n\nFuente: ${noticia.fuente}`,
        url: noticia.imagen,
        title: noticia.titulo,
      });
    } catch (error) {
      alert("Error al compartir: " + error.message);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} >
      <ScrollView style={estilos.scrollPrincipal} showsVerticalScrollIndicator={false}>
        <View style={estilos.contenedorImagen}>
          {noticia.imagen && (
            <Image source={{ uri: noticia.imagen }} style={estilos.imagen} />
          )}
          <TouchableOpacity style={estilos.botonCerrar} onPress={onCerrar}>
            <IconButton icon="close" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
        {noticia.categoria && (
          <View
            style={[
              estilos.etiquetaCategoria,
              { backgroundColor: colorCategoria },]}  >
            <Text style={estilos.textoCategoria}>{noticia.categoria}</Text>
          </View>)}

        <Text style={estilos.titulo}>{noticia.titulo}</Text>
        <Text style={estilos.fuenteTiempo}>  {noticia.fuente} • {noticia.tiempo} </Text>
        <Text style={estilos.descripcion}>{noticia.descripcion}</Text>

        {noticia.descripcionCompleta && (<>
          <Text style={estilos.subtitulo}>Detalles</Text>
          <Text style={estilos.detalle}>{noticia.descripcionCompleta}</Text>
        </>
        )}
        <TouchableOpacity onPress={() => setMostrarComentarios(!mostrarComentarios)}>
          <Text style={estilos.subtitulo}>  Comentarios {mostrarComentarios ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>

        {mostrarComentarios && (
          <View style={estilos.contenedorComentarios}>
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 10 }}>
              {comentarios.length === 0 ? (
                <Text style={{ fontStyle: "italic", color: "#888", marginBottom: 20 }}>  No hay comentarios aún. </Text>) : (
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
                      </View>)}
                  </View>)))}
            </ScrollView>
          </View>)}
      </ScrollView>

      <View style={estilos.barraComentario}>
        <TextInput
          style={estilos.inputComentario}
          placeholder="Comentar..."
          value={nuevoComentario}
          onChangeText={setNuevoComentario}
          onSubmitEditing={manejarAgregarComentario}
          returnKeyType="send" />
        <TouchableOpacity onPress={manejarAgregarComentario} style={estilos.botonEnviar}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onShare} style={estilos.botonIcono}>
          <IconButton icon="share" color="#e3d8d8ff" size={24} />
        </TouchableOpacity>
      </View>

      <Dialog.Container visible={visibleDialog}>
        <Dialog.Title>Editar comentario</Dialog.Title>
        <Dialog.Input value={textoEditando} onChangeText={setTextoEditando} />
        <Dialog.Button label="Cancelar" onPress={() => setVisibleDialog(false)} />
        <Dialog.Button label="Guardar" onPress={manejarEditarComentario} />
      </Dialog.Container>
    </KeyboardAvoidingView>
  );
}
const { width, height } = Dimensions.get("window");
const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" }, scrollPrincipal: { flex: 1 },
  contenedorImagen: { position: "relative", },
  imagen: { width: width, height: 250, resizeMode: "cover" },
  botonCerrar: { position: "absolute", top: 40, right: 15, backgroundColor: "rgba(237, 223, 223, 0.5)", borderRadius: 30, },
  etiquetaCategoria: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, margin: 10, },
  textoCategoria: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  titulo: { fontSize: 26, fontWeight: "700", marginHorizontal: 10, marginBottom: 8, color: "#222", },
  fuenteTiempo: { fontSize: 14, color: "#888", marginHorizontal: 10, marginBottom: 12 },
  descripcion: { fontSize: 16, lineHeight: 24, color: "#333", marginHorizontal: 10 },
  subtitulo: { fontSize: 18, fontWeight: "600", marginVertical: 10, marginHorizontal: 10, color: "#111", },
  detalle: { fontSize: 16, color: "#444", lineHeight: 24, marginHorizontal: 10, marginBottom: 10, },
  contenedorComentarios: { maxHeight: height * 0.4, marginHorizontal: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, backgroundColor: "#fafafa", },
  comentario: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginVertical: 5, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, },
  autorComentario: { fontWeight: "bold", color: "#333", marginBottom: 3 },
  textoComentario: { fontSize: 15, color: "#333" },
  fechaComentario: { fontSize: 12, color: "#999", marginTop: 4, textAlign: "right" },
  accionesComentario: { flexDirection: "row", marginTop: 5, justifyContent: "flex-end" },
  botonEditar: { color: "#007BFF", marginRight: 10 },
  botonEliminar: { color: "#FF0000" },
  barraComentario: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 8, borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff", },
  inputComentario: { flex: 1, height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 15, fontSize: 14, },
  botonEnviar: { backgroundColor: "#6394B5", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 25, marginLeft: 8, shadowColor: "#6394B5", shadowOpacity: 0.9, shadowRadius: 12, elevation: 10, },
  botonIcono: { alignItems: "center", justifyContent: "center", marginLeft: 12, flexDirection: "row", },
});