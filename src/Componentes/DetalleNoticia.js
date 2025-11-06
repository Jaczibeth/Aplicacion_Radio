import React, { useState, useEffect } from "react";
import { View, StyleSheet, Share, KeyboardAvoidingView, Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Dialog from "react-native-dialog";
import { coloresCategorias } from "../configuracion/colores";
import CabeceraNoticia from "./DetalleNoticia/CabeceraNoticia";
import CuerpoNoticia from "./DetalleNoticia/CuerpoNoticia";
import SeccionComentarios from "./DetalleNoticia/SeccionComentarios";
import BarraComentarios from "./DetalleNoticia/BarraComentarios";

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
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={estilos.scrollPrincipal}>
        <CabeceraNoticia
          noticia={noticia}
          onCerrar={onCerrar}
          colorCategoria={colorCategoria}
        />

        <CuerpoNoticia noticia={noticia} />

        <SeccionComentarios
          mostrarComentarios={mostrarComentarios}
          setMostrarComentarios={setMostrarComentarios}
          comentarios={comentarios}
          setComentarioEditando={setComentarioEditando}
          setTextoEditando={setTextoEditando}
          setVisibleDialog={setVisibleDialog}
          manejarEliminarComentario={manejarEliminarComentario}
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
  scrollPrincipal: { flex: 1 }
});