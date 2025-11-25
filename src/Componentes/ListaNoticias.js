import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, Modal, StyleSheet } from "react-native";
import TarjetaNoticia from "./TarjetaNoticia_temp"; 
import DetalleNoticia from "./DetalleNoticia"; 
import Api from "../Data/Api";

export default function ListaNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  const cargarNoticias = async () => {
    try {
      const data = await Api.getNoticias();
      console.log("ListaNoticias: Datos iniciales de noticias de la API:", data);

      const noticiasConConteoComentarios = await Promise.all(
        data.map(async (noticia) => {
          const comentarios = await Api.getComentariosPorNoticia(noticia.id);
          console.log(`ListaNoticias: Noticia ID ${noticia.id}, comentarios.length: ${comentarios.length}`);
          return {
            ...noticia,
            comentariosCount: comentarios.length,
          };
        })
      );
      console.log("ListaNoticias: Noticias con conteo de comentarios:", noticiasConConteoComentarios);
      setNoticias(noticiasConConteoComentarios);
    } catch (error) {
      console.error("ListaNoticias: Error al cargar noticias con conteo de comentarios:", error);
      const data = await Api.getNoticias();
      setNoticias(data.map(n => ({ ...n, comentariosCount: n.comentariosCount || 0 })));
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);


  const actualizarContador = useCallback((idNoticia, nuevoTotalComentarios) => {
    console.log(`ListaNoticias: Actualizando contador para Noticia ID ${idNoticia} a ${nuevoTotalComentarios}`);
    setNoticias((prevNoticias) =>
      prevNoticias.map((n) =>
        n.id === idNoticia ? { ...n, comentariosCount: nuevoTotalComentarios } : n
      )
    );
  }, []);

 
  const renderItem = ({ item }) => (
    <TarjetaNoticia
      noticia={item}
      alVerDetalle={() => setNoticiaSeleccionada(item)}
      alCambiarGuardado={(noticia) => {
    
      }}
      estaGuardada={false} 
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={noticias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

    
      <Modal visible={!!noticiaSeleccionada} animationType="slide">
        {noticiaSeleccionada && (
          <DetalleNoticia
            noticia={noticiaSeleccionada}
            onCerrar={() => setNoticiaSeleccionada(null)}
            actualizarContador={actualizarContador} 
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});
