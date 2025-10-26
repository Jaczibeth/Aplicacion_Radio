import React, { useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, Dimensions, Share, KeyboardAvoidingView, Platform, Alert, } from "react-native";
import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dialog from "react-native-dialog"; //libreria para modal de dialogo
import { colores, coloresCategorias } from "../configuracion/colores";

export default function DetalleNoticia({ noticia, onCerrar }) {
  if (!noticia) return null;

  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [likes, setLikes] = useState(0);
  const [yaDioLike, setYaDioLike] = useState(false);

  //  Estados para edición
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");

  const colorCategoria = coloresCategorias[noticia.categoria] || coloresCategorias["Otro"];
  const storageComentariosKey = `comentariosNoticia_${noticia.id}`;
  const storageContadoresKey = `contadorNoticia_${noticia.id}`;

  React.useEffect(() => {
    const cargarDatos = async () => {
      try {
        const almacenados = await AsyncStorage.getItem(storageComentariosKey);
        if (almacenados) setComentarios(JSON.parse(almacenados));

        const contadoresAlmacenados = await AsyncStorage.getItem(storageContadoresKey);
        if (contadoresAlmacenados) {
          const parsed = JSON.parse(contadoresAlmacenados);
          setLikes(parsed.likes || 0);
          const likeKey = `like_${noticia.id}`;
          const liked = await AsyncStorage.getItem(likeKey);
          if (liked) setYaDioLike(true);
        }
      } catch (error) {
        console.log("Error al cargar datos en detalle:", error);
      }
    };
    cargarDatos();
  }, [noticia.id]);

  const guardarComentarios = async (nuevosComentarios) => {
    try {
      await AsyncStorage.setItem(storageComentariosKey, JSON.stringify(nuevosComentarios));
    } catch (error) {
      console.log("Error al guardar comentarios:", error);
    }
  };

  const manejarAgregarComentario = async () => {
    if (nuevoComentario.trim() === "") return;
    const nuevo = {
      texto: nuevoComentario.trim(),
      fecha: new Date().toLocaleString(),
      editable: true, // Marca que indica  el comentario ingresado por  el usuario
    };
    const nuevosComentarios = [nuevo, ...comentarios];
    setComentarios(nuevosComentarios);
    await guardarComentarios(nuevosComentarios);
    setNuevoComentario("");
  };

  // Editacion de  comentario
  const manejarEditarComentario = async () => {
    const copia = [...comentarios];
    copia[comentarioEditando].texto = textoEditando;
    setComentarios(copia);
    await guardarComentarios(copia);
    setVisibleDialog(false);
  };

  // Eliminacion de su propio comentarios
  const manejarEliminarComentario = async (index) => {
    Alert.alert("Eliminar comentario", "¿Seguro que quieres eliminar este comentario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const copia = comentarios.filter((_, i) => i !== index);
          setComentarios(copia);
          await guardarComentarios(copia);  },}, ]); };
  const onLike = async () => {
    if (yaDioLike) return;
    const nuevoTotalLikes = likes + 1;
    setLikes(nuevoTotalLikes);
    setYaDioLike(true);
    try {
      const contadoresActuales = await AsyncStorage.getItem(storageContadoresKey);
      const parsedContadores = contadoresActuales ? JSON.parse(contadoresActuales) : {};
      const nuevosContadores = { ...parsedContadores, likes: nuevoTotalLikes };
      await AsyncStorage.setItem(storageContadoresKey, JSON.stringify(nuevosContadores));
      const likeKey = `like_${noticia.id}`;
      await AsyncStorage.setItem(likeKey, "true");
    } catch (error) {
      console.log("Error al guardar like:", error);
    }
  };
  const onShare = async () => {
    try {
      await Share.share({
        message: `${noticia.titulo}\n\n${noticia.descripcion}\n\nFuente: ${noticia.fuente}`,
        url: noticia.imagen,
        title: noticia.titulo,
      }
    );
    } catch (error) {
      alert("Error al compartir: " + error.message);
    }
  }
  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
      <TouchableOpacity onPress={onCerrar} style={estilos.botonCerrar}>
        <IconButton icon="close" color="#fff" size={28} />
      </TouchableOpacity>
      {noticia.imagen && <Image source={{ uri: noticia.imagen }} style={estilos.imagen} />}
      <ScrollView style={estilos.contenido} showsVerticalScrollIndicator={false}>
        {noticia.categoria && (
          <View style={[estilos.etiquetaCategoria, { backgroundColor: colorCategoria }]}>
            <Text style={estilos.textoCategoria}>{noticia.categoria}</Text>
          </View>)}
        <Text style={estilos.titulo}>{noticia.titulo}</Text>
        <Text style={estilos.fuenteTiempo}>
          {noticia.fuente} • {noticia.tiempo}
        </Text>
        <Text style={estilos.descripcion}>{noticia.descripcion}</Text>
        {noticia.descripcionCompleta && (<>
          <Text style={estilos.subtitulo}>Detalles</Text>
          <Text style={estilos.detalle}>{noticia.descripcionCompleta}</Text></>)}
        <Text style={estilos.subtitulo}>Comentarios</Text>
        {comentarios.length === 0 && (
          <Text style={{ fontStyle: "italic", color: "#888", marginBottom: 20 }}>
            No hay comentarios aún.
          </Text>)}
        {comentarios.map((c, i) => (
          <View key={i} style={estilos.comentario}>
            <Text>{c.texto}</Text>
            <Text style={estilos.fechaComentario}>{c.fecha}</Text>

            {c.editable && (
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <TouchableOpacity
                  onPress={() => {
                    setComentarioEditando(i);
                    setTextoEditando(c.texto);
                    setVisibleDialog(true);
                  }}
                  style={{ marginRight: 10 }}  >
                  <Text style={{ color: "#007BFF" }}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => manejarEliminarComentario(i)}>
                  <Text style={{ color: "#FF0000" }}>Eliminar</Text>
                </TouchableOpacity>
              </View>)}
          </View>))}
        <View style={{ height: 100 }} />
      </ScrollView>
      <View style={estilos.barraComentario}>
        <TextInput
          style={estilos.inputComentario}
          placeholder="Comentar"
          value={nuevoComentario} onChangeText={setNuevoComentario} onSubmitEditing={manejarAgregarComentario} returnKeyType="send" multiline={false} />
        <TouchableOpacity onPress={manejarAgregarComentario} style={estilos.botonEnviar} activeOpacity={0.7} > <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text> </TouchableOpacity>

        <TouchableOpacity onPress={onLike} style={estilos.botonIcono}>
          <IconButton icon="thumb-up" color={yaDioLike ? colores.rojoPrimario : "#b9b0b0ff"} size={24} />
          <Text style={estilos.contador}>{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onShare} style={estilos.botonIcono}>
          <IconButton icon="share" color="#555" size={24} />
        </TouchableOpacity>
      </View>
      {/*  Modal para editar comentario */}
      <Dialog.Container visible={visibleDialog}>
        <Dialog.Title>Editar comentario</Dialog.Title>
        <Dialog.Input value={textoEditando} onChangeText={setTextoEditando} />
        <Dialog.Button label="Cancelar" onPress={() => setVisibleDialog(false)} />
        <Dialog.Button label="Guardar" onPress={manejarEditarComentario} />
      </Dialog.Container>
    </KeyboardAvoidingView>
  );
}

const { width } = Dimensions.get("window");

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  botonCerrar: { position: "absolute", top: 20, right: 10, zIndex: 10, backgroundColor: "#89878729", borderRadius: 20, },
  imagen: { width: width, height: 220, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, },
  contenido: { flex: 1, padding: 16 },
  etiquetaCategoria: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 8, },
  textoCategoria: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  titulo: { fontSize: 26, fontWeight: "700", marginBottom: 8, color: "#222" },
  fuenteTiempo: { fontSize: 14, color: "#888", marginBottom: 12 },
  descripcion: { fontSize: 16, lineHeight: 24, color: "#333" },
  subtitulo: { fontSize: 18, fontWeight: "600", marginVertical: 10, color: "#111" },
  detalle: { fontSize: 16, color: "#444", lineHeight: 24, marginBottom: 10 },
  comentario: { backgroundColor: "#f1f1f1", padding: 10, borderRadius: 8, marginVertical: 5, },
  fechaComentario: { fontSize: 12, color: "#999", marginTop: 4, textAlign: "right" },
  barraComentario: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 8, borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff", },
  inputComentario: { flex: 1, height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 15, fontSize: 14, },
  botonEnviar: { backgroundColor: "rgba(99, 148, 181, 1)", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, marginLeft: 8, },
  botonIcono: { alignItems: "center", justifyContent: "center", marginLeft: 12, flexDirection: "row", },
  contador: { fontSize: 14, color: "#555", textAlign: "center", marginLeft: 2 },
}
);