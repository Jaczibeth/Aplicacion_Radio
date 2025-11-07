import React, { useState, useEffect } from "react";
import { View, StyleSheet, Share, KeyboardAvoidingView, Platform, Alert } from "react-native";
import Dialog from "react-native-dialog";
import { coloresCategorias } from "../configuracion/colores";
import CabeceraNoticia from "./DetalleNoticia/CabeceraNoticia";
import CuerpoNoticia from "./DetalleNoticia/CuerpoNoticia";
import SeccionComentarios from "./DetalleNoticia/SeccionComentarios";
import BarraComentarios from "./DetalleNoticia/BarraComentarios";

import Api from "../Data/Api";

export default function DetalleNoticia({ noticia, onCerrar }) {
  if (!noticia) return null;

  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  const colorCategoria = coloresCategorias[noticia.categoria] || coloresCategorias["Otro"];

 
  const cargarComentarios = async () => {
    try {
      const data = await Api.getComentariosPorNoticia(noticia.id);
      setComentarios(data);
    } catch (error) {
      console.log("Error al cargar comentarios:", error);
    }
  };

  useEffect(() => {
    cargarComentarios();
  }, [noticia.id]);


  const manejarAgregarComentario = async () => {
    if (nuevoComentario.trim() === "") return;

    const comentario = {
      autor: "Anónimo",
      texto: nuevoComentario.trim(),
    };

    const nuevo = await Api.agregarComentarioAPI(noticia.id, comentario);

    if (nuevo) {
      setComentarios([nuevo, ...comentarios]);
      setNuevoComentario("");
    } else {
      Alert.alert("Error", "No se pudo agregar el comentario");
    }
  };


  const manejarEditarComentario = async () => {
    const copia = [...comentarios];
    copia[comentarioEditando].texto = textoEditando;
    setComentarios(copia);
    setVisibleDialog(false);
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={estilos.scrollPrincipal}>
        <CabeceraNoticia noticia={noticia} onCerrar={onCerrar} colorCategoria={colorCategoria} />

        <CuerpoNoticia noticia={noticia} />

        <SeccionComentarios
          mostrarComentarios={mostrarComentarios}
          setMostrarComentarios={setMostrarComentarios}
          comentarios={comentarios}
          setComentarioEditando={setComentarioEditando}
          setTextoEditando={setTextoEditando}
          setVisibleDialog={setVisibleDialog}
          noticiaId={noticia.id}
          recargarComentarios={cargarComentarios}
        />
      </View>

      <BarraComentarios
        nuevoComentario={nuevoComentario}
        setNuevoComentario={setNuevoComentario}
        manejarAgregarComentario={manejarAgregarComentario}
        onShare={onShare}
      />

      <Dialog.Container visible={visibleDialog}>
        <Dialog.Title>Editar comentario</Dialog.Title>
        <Dialog.Input value={textoEditando} onChangeText={setTextoEditando} />
        <Dialog.Button label="Cancelar" onPress={() => setVisibleDialog(false)} />
        <Dialog.Button label="Guardar" onPress={manejarEditarComentario} />
      </Dialog.Container>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollPrincipal: { flex: 1 },
});
