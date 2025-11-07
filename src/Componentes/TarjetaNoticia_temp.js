import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text, Share, Image, TouchableOpacity, Dimensions, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Title, Paragraph, IconButton } from "react-native-paper";

import { coloresCategorias } from "../configuracion/colores"; 

const { width } = Dimensions.get("window");


const Accion = ({ icon, iconColor, contador, onPress, texto }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-2)).current;
  const [mostrarTexto, setMostrarTexto] = useState(false);

  const animar = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.2, friction: 4, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    setMostrarTexto(true);
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(translateYAnim, { toValue: 2, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
          Animated.timing(translateYAnim, { toValue: -2, duration: 150, useNativeDriver: true }),
        ]).start(() => setMostrarTexto(false));
      }, 800);
    });

    if (onPress) onPress();
  };

  return (
    <View style={styles.contenedor}>
      <TouchableOpacity onPress={animar}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={{ alignItems: "center" }}>
            <View style={styles.rowIcono}>
              <View style={styles.botonCircular}>
                <IconButton icon={icon} iconColor={iconColor} size={22} />
              </View>
              <Text style={styles.contador}>{contador}</Text>
            </View>
            {mostrarTexto && (
              <Animated.View
                style={{
                  position: "absolute",
                  top: 50,
                  opacity: opacityAnim,
                  transform: [{ translateY: translateYAnim }],
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 999,
                  width: 80,
                }}
              >
                <Text style={styles.textoTooltip}>{texto}</Text>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const TarjetaNoticia_temp = ({ noticia, eliminarNoticia, alVerDetalle, alCambiarGuardado, estaGuardada }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [contadorLecturas, setContadorLecturas] = useState(0);
  const [contadorLikes, setContadorLikes] = useState(0);

  const [contadorCompartidos, setContadorCompartidos] = useState(0);
  const [contadorComentarios, setContadorComentarios] = useState(0);

  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const almacenados = await AsyncStorage.getItem(`comentariosNoticia_${noticia.id}`);
        if (almacenados) {
          setContadorComentarios(JSON.parse(almacenados).length);
        }
      } catch (error) {
        console.log("Error al cargar comentarios en tarjeta:", error);
      }
    };
    cargarComentarios();
  }, [noticia.id]);

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [noticia]);

  const manejarLike = () => setContadorLikes(prev => prev + 1);
  const manejarFavorito = () => alCambiarGuardado(noticia);
  const manejarCompartir = async () => {
    try {
      await Share.share({
        title: noticia.titulo,
        message: `${noticia.titulo}\n\n${noticia.descripcion || ""}\n\nFuente: ${noticia.fuente || ""}`,
        url: noticia.imagen,
      });
      setContadorCompartidos(prev => prev + 1);
    } catch (error) {
      console.log("Error al compartir:", error);
    }
  };

  const manejarEliminar = () => {
    Alert.alert(
      "Eliminar noticia",
      "¿Estás seguro que quieres eliminar esta noticia?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => eliminarNoticia(noticia.id),
        },
      ]
    );
  };

    return (
      <Animated.View style={[styles.tarjeta, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.row}>
          <View style={styles.left}>
            {noticia.categoria && (
              <View
                style={[
                  styles.etiquetaCategoria,
                  { backgroundColor: coloresCategorias[noticia.categoria] || coloresCategorias.Otro },
                ]}
              >
                <Text style={styles.textoCategoria}>{noticia.categoria}</Text>
              </View>
            )}
            <Title style={styles.titulo} numberOfLines={2}>{noticia.titulo}</Title>
            <Paragraph style={styles.descripcion} numberOfLines={3}>{noticia.descripcion}</Paragraph>
          </View>
          <Image source={{ uri: noticia.imagen }} style={styles.imagenRight} />
        </View>
  
        <View style={styles.contenedorAcciones}>
          <Accion icon="eye" iconColor="#660909ff" contador={contadorLecturas} onPress={() => { setContadorLecturas(prev => prev + 1); alVerDetalle({}); }} texto="Ver" />
          <Accion icon="comment" iconColor="#2196F3" contador={contadorComentarios} onPress={() => alVerDetalle({ mostrarComentarios: true })} texto="Comentarios" />
          <Accion icon="thumb-up" iconColor="#f44336" contador={contadorLikes} onPress={manejarLike} texto="Me gusta" />
          <Accion icon="bookmark" iconColor={estaGuardada ? "#FFC107" : "#0d93e681"} contador={estaGuardada ? 1 : 0} onPress={manejarFavorito} texto="Guardar" />
          <Accion icon="share-variant" iconColor="#2196F3" contador={contadorCompartidos} onPress={manejarCompartir} texto="Compartir" />
          <Accion icon="delete" iconColor="#f44336" contador={0} onPress={manejarEliminar} texto="Eliminar" />
        </View>
      </Animated.View>
    );};

const styles = StyleSheet.create({
  tarjeta: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
  },
  left: {
    flex: 1,
    paddingRight: 10,
    justifyContent: "flex-start",
  },
  titulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  descripcion: {
    fontSize: 14,
    color: "#666",
  },
  contenedorAcciones: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
  },
  imagenRight: {
    width: 110,
    height: 110,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginTop: 20,
  },
  etiquetaCategoria: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  textoCategoria: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  contenedor: {
    alignItems: "center",
    justifyContent: "center",
  },
  rowIcono: {
    flexDirection: "row",
    alignItems: "center",
  },
  botonCircular: {
    backgroundColor: "#f2f2f2",
    borderRadius: 40,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  contador: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginLeft: 6,
  },
  textoTooltip: {
    color: "#000",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default TarjetaNoticia_temp;
