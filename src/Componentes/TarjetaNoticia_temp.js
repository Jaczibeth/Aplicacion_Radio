import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, StyleSheet, Animated, Text, Share, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from "react-native";
import { Title, Paragraph, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colores, tamanosTexto, espaciado, coloresCategorias } from "../configuracion/colores";

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
    <View style={estilosAccion.contenedor}>
      <TouchableWithoutFeedback onPress={animar}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={{ alignItems: "center" }}>
            <View style={estilosAccion.rowIcono}>
              <View style={estilosAccion.botonCircular}>
                <IconButton icon={icon} iconColor={iconColor} size={22} />
              </View>
              <Text style={estilosAccion.contador}>{contador}</Text>
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
                <Text style={estilosAccion.textoTooltip}>{texto}</Text>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default function TarjetaNoticia({ noticia, estaGuardada, alCambiarGuardado, alVerDetalle, recargar }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [contadorLecturas, setContadorLecturas] = useState(0);
  const [contadorLikes, setContadorLikes] = useState(0);
  const [contadorFavoritos, setContadorFavoritos] = useState(0);
  const [contadorComentarios, setContadorComentarios] = useState(0);
  const [contadorCompartidos, setContadorCompartidos] = useState(0);

  const storageKey = `contadorNoticia_${noticia.id}`;
  const storageComentariosKey = `comentariosNoticia_${noticia.id}`;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datosContadores = await AsyncStorage.getItem(storageKey);
        const datosComentarios = await AsyncStorage.getItem(storageComentariosKey);

        if (datosContadores) {
          const parsed = JSON.parse(datosContadores);
          setContadorLecturas(parsed.lecturas || 0);
          setContadorFavoritos(parsed.favoritos || 0);
          setContadorLikes(parsed.likes || 0);
          setContadorCompartidos(parsed.compartidos || 0);
        }

        if (datosComentarios) {
          setContadorComentarios(JSON.parse(datosComentarios).length);
        } else {
          setContadorComentarios(0);
        }
      } catch (error) {
        console.log("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, [noticia, recargar]);

  useEffect(() => {
    const guardarContadores = async () => {
      try {
        const data = {
          lecturas: contadorLecturas,
          favoritos: contadorFavoritos,
          likes: contadorLikes,
          compartidos: contadorCompartidos,
        };
        await AsyncStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.log("Error al guardar contadores:", error);
      }
    };
    guardarContadores();
  }, [contadorLecturas, contadorFavoritos, contadorLikes, contadorCompartidos]);

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [noticia]);

  const irADetalle = useCallback(() => {
    if (alVerDetalle) alVerDetalle({ mostrarComentarios: false });
    setContadorLecturas((prev) => prev + 1);
  }, [alVerDetalle]);

  const manejarFavorito = useCallback(() => {
    if (!estaGuardada) setContadorFavoritos((prev) => prev + 1);
    alCambiarGuardado(noticia);
  }, [estaGuardada, alCambiarGuardado, noticia]);

  const manejarCompartir = useCallback(async () => {
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
  }, [noticia]);

  const manejarLike = useCallback(async () => {
    const nuevoTotalLikes = contadorLikes + 1;
    setContadorLikes(nuevoTotalLikes);
    const contadoresActuales = await AsyncStorage.getItem(storageKey);
    const parsedContadores = contadoresActuales ? JSON.parse(contadoresActuales) : {};
    const nuevosContadores = { ...parsedContadores, likes: nuevoTotalLikes };
    await AsyncStorage.setItem(storageKey, JSON.stringify(nuevosContadores));
  }, [contadorLikes, storageKey]);

  return (
    <Animated.View style={[estilos.tarjeta, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity activeOpacity={0.95} onPress={irADetalle}>
        <View style={estilos.row}>
          <View style={estilos.left}>
            {noticia.categoria && (
              <View
                style={[
                  estilos.etiquetaCategoria,
                  { backgroundColor: coloresCategorias[noticia.categoria] || coloresCategorias.Otro },
                ]}
              >
                <Text style={estilos.textoCategoria}>{noticia.categoria}</Text>
              </View>
            )}
            <Title style={estilos.titulo} numberOfLines={2}>
              {noticia.titulo}
            </Title>
            <Paragraph style={estilos.descripcion} numberOfLines={3}>
              {noticia.descripcion}
            </Paragraph>
          </View>
          <Image source={{ uri: noticia.imagen }} style={estilos.imagenRight} />
        </View>
      </TouchableOpacity>

      <View style={estilos.contenedorAcciones}>
        <Accion icon="eye" iconColor={colores.textoGris} contador={contadorLecturas} onPress={irADetalle} texto="Ver" />
        <Accion icon="comment" iconColor={colores.principal} contador={contadorComentarios} onPress={() => { if (alVerDetalle) alVerDetalle({ mostrarComentarios: true }); setContadorLecturas((prev) => prev + 1); }} texto="Comentar" />
        <Accion icon={estaGuardada ? "bookmark" : "bookmark"} iconColor={estaGuardada ? colores.rojoPrimario : colores.textoGrisClaro} contador={contadorFavoritos} onPress={manejarFavorito} texto="Guardar" />
        <Accion icon="thumb-up" iconColor={colores.rojoPrimario} contador={contadorLikes} onPress={manejarLike} texto="Me gusta" />
        <Accion icon="share-variant" iconColor={colores.principal} contador={contadorCompartidos} onPress={manejarCompartir} texto="Compartir" />
      </View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    marginBottom: espaciado.normal,
    borderRadius: 12,
    overflow: "visible", 
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
    padding: espaciado.normal,
  },
  left: {
    flex: 1,
    paddingRight: espaciado.normal,
    justifyContent: "flex-start",
  },
  titulo: {
    fontSize: tamanosTexto.grande,
    fontWeight: "700",
    color: colores.textoOscuro,
  },
  descripcion: {
    fontSize: tamanosTexto.normal,
    color: colores.textoGris,
  },
  contenedorAcciones: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: espaciado.pequeno,
  },
  imagenRight: {
    width: 110,
    height: 110,
    borderRadius: 8, 
    backgroundColor: "#eee",
    marginTop: 35,
    flexShrink: 0,
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
    fontSize: tamanosTexto.grande,
    fontWeight: "700",
  },
});
const estilosAccion = StyleSheet.create({
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
  tooltip: {
    position: "absolute",
    bottom: 65,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  textoTooltip: {
    color: "#000",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
});

