import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity,Animated,Text, Share,Image, Modal, Button,ScrollView,} from "react-native";
import { Card, Title, Paragraph, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {colores,tamanosTexto,espaciado,} from "../configuracion/colores";

export default function TarjetaNoticia({
  noticia,
  estaGuardada,
  alCambiarGuardado,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [contadorLecturas, setContadorLecturas] = useState(0);
  const [contadorFavoritos, setContadorFavoritos] = useState(0);
  const [contadorComentarios, setContadorComentarios] = useState(0);
  const [contadorCompartidos, setContadorCompartidos] = useState(0);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const storageKey = `contadorNoticia_${noticia.id}`;

  useEffect(() => {
    async function cargarContadores() {
      try {
        const data = await AsyncStorage.getItem(storageKey);
        if (data) {
          const parsed = JSON.parse(data);
          setContadorLecturas(parsed.lecturas || 0);
          setContadorFavoritos(parsed.favoritos || 0);
          setContadorComentarios(parsed.comentarios || 0);
          setContadorCompartidos(parsed.compartidos || 0);
        }
      } catch (error) {
        console.log("Error al cargar contadores:", error);
      }
    }
    cargarContadores();
  }, [noticia]);

  useEffect(() => {
    async function guardarContadores() {
      try {
        const data = {
          lecturas: contadorLecturas,
          favoritos: contadorFavoritos,
          comentarios: contadorComentarios,
          compartidos: contadorCompartidos,
        };
        await AsyncStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.log("Error al guardar contadores:", error);
      }
    }
    guardarContadores();
  }, [
    contadorLecturas,
    contadorFavoritos,
    contadorComentarios,
    contadorCompartidos,
  ]);

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [noticia]);

  const irADetalle = () => {
    setContadorLecturas((prev) => prev + 1);
    setMostrarDetalle(true);
  };

  const manejarFavorito = () => {
    if (!estaGuardada) setContadorFavoritos((prev) => prev + 1);
    alCambiarGuardado(noticia);
  };

  const manejarComentario = () => setContadorComentarios((prev) => prev + 1);

  const manejarCompartir = async () => {
    try {
      const resultado = await Share.share({
        title: noticia.titulo,
        message: `${noticia.titulo}\n\n${noticia.descripcion || ""}\n\nFuente: ${noticia.fuente}`,
        url: noticia.imagen,
      });
      if (resultado.action === Share.sharedAction) {
        setContadorCompartidos((prev) => prev + 1);
      }
    } catch (error) {
      console.log("Error al compartir:", error);
    }
  };

  return (
    <>
      <Animated.View
        style={[
          estilos.cardAnimada,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Card style={estilos.tarjeta} elevation={4}>
          <TouchableOpacity onPress={irADetalle} activeOpacity={0.9}>
            <Image source={{ uri: noticia.imagen }} style={estilos.imagen} />
          </TouchableOpacity>

          <View style={estilos.cardContenido}>
            <View style={estilos.areaContenido}>
              <Text style={estilos.fuenteTiempo}>
                {noticia.fuente} • {noticia.tiempo}
              </Text>

              {noticia.categoria && (
                <View style={estilos.etiquetaCategoria}>
                  <Text style={estilos.textoCategoria}>
                    {noticia.categoria}
                  </Text>
                </View>
              )}

              <Title style={estilos.titulo} numberOfLines={2}>
                {noticia.titulo}
              </Title>
              <Paragraph style={estilos.descripcion} numberOfLines={3}>
                {noticia.descripcion || ""}
              </Paragraph>
            </View>

       
            <View style={estilos.contenedorAcciones}>
              <View style={estilos.accion}>
                <IconButton
                  icon="eye"
                  iconColor={colores.principal}
                  size={24}
                  onPress={irADetalle} />
                <Text style={estilos.contador}>{contadorLecturas}</Text>
              </View>

              <View style={estilos.accion}>
                <IconButton
                  icon="comment"
                  iconColor={colores.azul}
                  size={24}
                  onPress={manejarComentario}
                />
                <Text style={estilos.contador}>{contadorComentarios}</Text>
              </View>

              <View style={estilos.accion}>
                <IconButton
                  icon={estaGuardada ? "bookmark" : "bookmark"}
                  iconColor={
                    estaGuardada
                      ? colores.rojoPrimario
                      : colores.textoGrisClaro
                  }
                  size={24}
                  onPress={manejarFavorito}
                />
                <Text style={estilos.contador}>{contadorFavoritos}</Text>
              </View>

              <View style={estilos.accion}>
                <IconButton
                  icon="share-variant"
                  iconColor={colores.azul}
                  size={24}
                  onPress={manejarCompartir}
                />
                <Text style={estilos.contador}>{contadorCompartidos}</Text>
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Modal detalle */}
      <Modal visible={mostrarDetalle} animationType="slide">
        <ScrollView
          style={{
            flex: 1,
            padding: espaciado.normal,
            backgroundColor: "#fff",
          }}
        >
          <Button title="Cerrar" onPress={() => setMostrarDetalle(false)} />
          <Image
            source={{ uri: noticia.imagen }}
            style={{
              width: "100%",
              height: 250,
              borderRadius: 10,
              marginBottom: espaciado.normal,
            }}
          />
          {noticia.categoria && (
            <Text
              style={{
                color: colores.principal,
                fontWeight: "bold",
                marginBottom: espaciado.minimo,
              }}
            >
              {noticia.categoria}
            </Text>
          )}
          <Text
            style={{
              fontSize: tamanosTexto.grande,
              fontWeight: "700",
              marginBottom: espaciado.pequeno,
            }}
          >
            {noticia.titulo}
          </Text>
          <Text
            style={{
              color: colores.textoGris,
              fontSize: tamanosTexto.pequeno,
              marginBottom: espaciado.normal,
            }}
          >
            {noticia.fuente} • {noticia.tiempo}
          </Text>
          <Text
            style={{
              fontSize: tamanosTexto.normal,
              color: colores.textoGris,
              marginBottom: espaciado.normal,
            }}
          >
            {noticia.descripcion}
          </Text>
        </ScrollView>
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  cardAnimada: {
    width: 320,
    marginRight: espaciado.mediano,
  },
  tarjeta: {
    height: 540,
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: espaciado.mediano,
  },
  imagen: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  cardContenido: {
    flex: 1,
    justifyContent: "space-between",
  },
  areaContenido: {
    paddingHorizontal: espaciado.normal,
    paddingTop: espaciado.normal,
    flexShrink: 1,
    minHeight: 250,
  },
  fuenteTiempo: {
    fontSize: tamanosTexto.pequeno,
    color: colores.textoGrisClaro,
    marginBottom: espaciado.minimo,
  },
  etiquetaCategoria: {
    backgroundColor: colores.principal,
    alignSelf: "flex-start",
    paddingHorizontal: espaciado.pequeno,
    paddingVertical: espaciado.minimo,
    borderRadius: 5,
    marginBottom: espaciado.pequeno,
  },
  textoCategoria: {
    fontSize: tamanosTexto.muyPequeno,
    color: "#fff",
    fontWeight: "600",
  },
  titulo: {
    fontSize: tamanosTexto.mediano,
    fontWeight: "700",
    color: colores.textoOscuro,
    marginBottom: espaciado.pequeno,
  },
  descripcion: {
    fontSize: tamanosTexto.normal,
    color: colores.textoGris,
  },
  contenedorAcciones: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: espaciado.minimo,
    paddingHorizontal: espaciado.normal,
  },
accion: {
  alignItems: "center",
  justifyContent: "center",
  width: 70,
  marginTop: -8,
},

contador: {
  color: "#000",
  fontSize: 13,
  marginTop: -6, 
  fontWeight: "bold",
  textAlign: "center",
},

});
