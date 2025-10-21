import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, StyleSheet, Animated, Text, Share,Image, TouchableOpacity, Dimensions} from "react-native";
import { Title, Paragraph, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colores, tamanosTexto, espaciado, coloresCategorias } from "../configuracion/colores";

const { width } = Dimensions.get("window");

const Accion = ({ icon, iconColor, contador, onPress, texto, estaGuardada }) => (
  <TouchableOpacity onPress={onPress} style={estilos.accion}>
    <View style={estilos.filaIconoContador}>
      <IconButton icon={icon} iconColor={iconColor} size={20} style={estilos.icono} />
      <Text style={[estilos.contador, { color: iconColor }]}>{contador}</Text>
    </View>
    <Text style={estilos.textoAccion}>{texto}</Text>
  </TouchableOpacity>
);

export default function TarjetaNoticia({ noticia, estaGuardada, alCambiarGuardado, alVerDetalle, recargar }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [contadorLecturas, setContadorLecturas] = useState(0);
  const [contadorLikes, setContadorLikes] = useState(0);
  const [contadorFavoritos, setContadorFavoritos] = useState(0);
  const [contadorComentarios, setContadorComentarios] = useState(0);
  const [contadorCompartidos, setContadorCompartidos] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");

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

  const abrirModalComentarios = async () => {
    try {
      const almacenados = await AsyncStorage.getItem(storageComentariosKey);
      if (almacenados) {
        setComentarios(JSON.parse(almacenados));
      } else {
        setComentarios([]);
      }
    } catch (error) {
      console.log("Error al cargar comentarios:", error);
    }
    setModalVisible(true);
  };
  const guardarComentarios = async (comentariosAGuardar) => {
    try {
      await AsyncStorage.setItem(storageComentariosKey, JSON.stringify(comentariosAGuardar));
    } catch (error) {
      console.log("Error al guardar comentarios:", error);
    }
  };
  const agregarComentario = () => {
    if (nuevoComentario.trim() !== "") {
      const nuevo = { texto: nuevoComentario.trim(), fecha: new Date().toLocaleString() };
      const nuevosComentarios = [...comentarios, nuevo];
      setComentarios(nuevosComentarios);
      setNuevoComentario("");
      setContadorComentarios(nuevosComentarios.length);
      guardarComentarios(nuevosComentarios);
    }
  };
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
                ]} >
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
        <Accion icon="comment" iconColor={colores.principal} contador={contadorComentarios} onPress={() => {if (alVerDetalle) alVerDetalle({ mostrarComentarios: true });   setContadorLecturas((prev) => prev + 1); }} texto="Comentar"/>
        <Accion icon={estaGuardada ? "bookmark" : "bookmark"} iconColor={estaGuardada ? colores.rojoPrimario : colores.textoGrisClaro} contador={contadorFavoritos} onPress={manejarFavorito} texto="Guardar" />
        <Accion icon={contadorLikes > 0 ? "thumb-up" : "thumb-up"} iconColor={colores.rojoPrimario} contador={contadorLikes} onPress={manejarLike} texto="Me gusta" />
        <Accion icon="share-variant-outline" iconColor={colores.principal} contador={contadorCompartidos} onPress={manejarCompartir} texto="Compartir" />
      </View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    marginBottom: espaciado.normal,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: espaciado.normal,
  },
  left: {
    flex: 1,
    paddingRight: espaciado.normal,
    justifyContent: 'flex-start',
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: espaciado.minimo,
    paddingHorizontal: espaciado.normal,
    width: "100%",
  },
  accion: {
    alignItems: 'center',
    flex: 1,
  },
  filaIconoContador: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icono: {
    margin: 0,
    height: 22, 
  },
  contador: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2,
  },
  textoAccion: {
    fontSize: 12,
    color: colores.textoGris,
    textAlign: "center",
    marginTop: -4,
  },
  imagenRight: {
    width: 110,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginTop: 35,
    flexShrink: 0,
  },
  etiquetaCategoria: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  textoCategoria: {
    color: '#fff',
    fontSize: tamanosTexto.muyPequeno,
    fontWeight: '700',
  },
  tituloComentarios: { fontSize: tamanosTexto.mediano, fontWeight: "700", marginBottom: espaciado.pequeno,color: colores.textoOscuro,},
  noComentarios: { color: colores.textoGris,},
  comentario: { backgroundColor: "#f8f8f8",padding: espaciado.pequeno,borderRadius: 8,marginBottom: espaciado.minimo,},
  fechaComentario: { fontSize: 11, color: colores.textoGris, marginTop: 2,textAlign: "right", },
  inputComentario: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginTop: 10,},
  modalFondo: { flex: 1,backgroundColor: "rgba(0, 0, 0, 0.5)",justifyContent: "flex-end", },
  modalContenido: {  backgroundColor: "#fff", padding: espaciado.normal,borderTopLeftRadius: 16,borderTopRightRadius: 16, maxHeight: "80%", }, 
  botonCerrar: { alignSelf: "flex-end", marginBottom: 10,},
});
