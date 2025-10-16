import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Platform, Text, Share, Image } from "react-native";
import { Card, Title, Paragraph, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colores, tamanosTexto, espaciado, bordesRedondeados } from "../configuracion/colores";

export default function TarjetaNoticia({
  noticia,
  estaGuardada,
  alCambiarGuardado,
  alVerDetalle,
  navigation,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [contadorLecturas, setContadorLecturas] = useState(0);
  const [contadorFavoritos, setContadorFavoritos] = useState(0);
  const [contadorComentarios, setContadorComentarios] = useState(0);
  const [contadorCompartidos, setContadorCompartidos] = useState(0);

  const storageKey = 'contadorNoticia_${noticia.id}';

  // Cargar contadores desde AsyncStorage al montar el componente
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

  // Guardar contadores en AsyncStorage cuando se actualizan
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
  }, [contadorLecturas, contadorFavoritos, contadorComentarios, contadorCompartidos]);

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

  // Funciones para incrementar los contadores
  const irADetalle = () => {
    setContadorLecturas((prev) => prev + 1);
    if (typeof alVerDetalle === "function") {
      alVerDetalle();
    } else if (navigation?.navigate) {
      navigation.navigate("DetalleNoticia", { noticia });
    }
  };

  const manejarFavorito = () => {
    if (!estaGuardada) {
      setContadorFavoritos((prev) => prev + 1);
    }
    alCambiarGuardado(noticia);
  };

  const manejarComentario = () => {
    setContadorComentarios((prev) => prev + 1);
  };

  const manejarCompartir = async () => {
    try {
      const resultado = await Share.share({
        title: noticia.titulo,
        message: '${noticia.titulo}\n\n${noticia.descripcion || ""}\n\nFuente: ${noticia.fuente}',
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
            {noticia.categoria ? (
              <View style={estilos.etiquetaCategoria}>
                <Text style={estilos.textoCategoria}>{noticia.categoria}</Text>
              </View>
            ) : null}
            <Title style={estilos.titulo} numberOfLines={2}>
              {noticia.titulo || ""}
            </Title>
            <Paragraph style={estilos.descripcion} numberOfLines={3}>
              {noticia.descripcion || ""}
            </Paragraph>
          </View>

          <View style={estilos.contenedorAcciones}>
            <TouchableOpacity style={estilos.botonAccion} onPress={irADetalle}>
              <View style={estilos.contenedorIconoTexto}>
                <IconButton
                  icon="eye"
                  iconColor={colores.principal}
                  size={20}
                  style={estilos.icono}
                />
                <Text style={estilos.contador}>{contadorLecturas}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botonAccion} onPress={manejarComentario}>
              <View style={estilos.contenedorIconoTexto}>
                <IconButton
                  icon="comment-outline"
                  iconColor={colores.azul}
                  size={20}
                  style={estilos.icono}
                />
                <Text style={estilos.contador}>{contadorComentarios}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botonAccion} onPress={manejarFavorito}>
              <View style={estilos.contenedorIconoTexto}>
                <IconButton
                  icon={estaGuardada ? "bookmark" : "bookmark-outline"}
                  iconColor={estaGuardada ? colores.rojoPrimario : colores.textoGrisClaro}
                  size={20}
                  style={estilos.icono}
                />
                <Text style={estilos.contador}>{contadorFavoritos}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botonAccion} onPress={manejarCompartir}>
              <View style={estilos.contenedorIconoTexto}>
                <IconButton
                  icon="share-variant"
                  iconColor={colores.azul}
                  size={20}
                  style={estilos.icono}
                />
                <Text style={estilos.contador}>{contadorCompartidos}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  cardAnimada: {
    width: 320,
    marginRight: espaciado.mediano,
  },
  tarjeta: {
    height: 480,
    borderRadius: bordesRedondeados.mediano,
    backgroundColor: colores.fondoTarjeta,
    overflow: "hidden",
    ...Platform.select({
      android: { elevation: 8 },
    
    }),
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
    borderRadius: bordesRedondeados.pequeno,
    marginBottom: espaciado.pequeno,
  },
  textoCategoria: {
    fontSize: tamanosTexto.muyPequeno,
    color: colores.textoBlanco,
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
    borderTopWidth: 1,
    borderTopColor: colores.bordeClaro,
    borderTopColor: colores.textoGrisClaro + '20',
  },
  botonAccion: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
  },
  contenedorIconoTexto: {
    alignItems: "center",
    justifyContent: "center",
  },
  icono: {
    margin: 0,
    padding: 0,
    width: 42,
    height: 42,
  },
  contador: {
    fontSize: tamanosTexto.muyPequeno,
    color: colores.textoGris,
    marginTop: 2,
    fontWeight: "600",
  },
});