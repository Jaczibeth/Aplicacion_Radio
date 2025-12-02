import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text, Share, Image, TouchableOpacity } from "react-native";
import { Title, Paragraph, IconButton } from "react-native-paper";
import { coloresCategorias } from "../configuracion/colores";
import axios from "axios";

const Accion = ({ icon, iconColor, contador, onPress, texto }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const tooltipAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);

  const animarClick = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.15, friction: 4, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    setVisible(true);
    Animated.timing(tooltipAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(tooltipAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setVisible(false));
      }, 800);
    });
    if (onPress) onPress();
  };

  return (
    <View style={styles.contenedorAccion}>
      {visible && (
        <Animated.View
          style={[
            styles.tooltip,
            { opacity: tooltipAnim, transform: [{ translateY: tooltipAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] },
          ]}
        >
          <Text style={styles.textoTooltip} numberOfLines={1} ellipsizeMode="clip">{texto}</Text>
        </Animated.View>
      )}
      <TouchableOpacity onPress={animarClick} activeOpacity={0.8}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View style={styles.botonCircular}>
            <IconButton icon={icon} iconColor={iconColor} size={24} />
          </View>
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.contador}>{contador}</Text>
    </View>
  );
};

const TarjetaNoticia_temp = ({
  noticia,
  alVerDetalle,
  alCambiarGuardado,
  estaGuardada,
   totalComentarios,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [contadorLecturas, setContadorLecturas] = useState(0);
  const [contadorLikes, setContadorLikes] = useState(0);
  const [contadorCompartidos, setContadorCompartidos] = useState(0);
  const [contadorComentarios, setContadorComentarios] = useState(0);
  const [contadorGuardados, setContadorGuardados] = useState(0);
  const [calificacionUsuario, setCalificacionUsuario] = useState(noticia?.calificacionUsuario || 0);

  useEffect(() => {
    if (typeof totalComentarios === "number") {
      setContadorComentarios(totalComentarios);
    } else if (noticia?.cantidadComentarios !== undefined) {
      setContadorComentarios(noticia.cantidadComentarios);
    }
  }, [totalComentarios, noticia?.cantidadComentarios]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [noticia]);

  
  const fetchTotales = async () => {
    try {

      const response = await axios.get(`http://192.168.1.5:8080/api/interacciones/totales/${noticia.id}`);

      setContadorLecturas(response.data.vistas);
      setContadorComentarios(response.data.comentarios);
      setContadorLikes(response.data.likes);
      setContadorGuardados(response.data.guardados);
      setContadorCompartidos(response.data.compartidos);
    } catch (error) {
      console.error("Error al obtener totales:", error);
    }
  };
  useEffect(() => {
    if (typeof totalComentarios === "number") {
      setContadorComentarios(totalComentarios);
    } else if (noticia?.cantidadComentarios !== undefined) {
      setContadorComentarios(noticia.cantidadComentarios);
    }
  }, [totalComentarios, noticia?.cantidadComentarios]);

  useEffect(() => {
    fetchTotales();
  }, [noticia.id]);

  const registrarInteraccion = async (tipo) => {
    try {

      await axios.post("http://192.168.1.5:8080/api/interacciones", {

        noticiaId: noticia.id,
        tipo: tipo,
      });
      fetchTotales(); 
    } catch (error) {
      console.error("Error al registrar interacción:", error);
    }
  };

  const manejarVer = () => {
    registrarInteraccion("ver");
    alVerDetalle({ ...noticia, mostrarComentarios: true });
  };

  const manejarComentarios = () => {
    registrarInteraccion("comentario");
    alVerDetalle({ ...noticia, mostrarComentarios: true });
  };

  const manejarLike = () => registrarInteraccion("like");

  const manejarFavorito = () => {
    alCambiarGuardado(noticia);
    registrarInteraccion("guardar");
  };

  const manejarCompartir = async () => {
    try {
      await Share.share({
        title: noticia.titulo,
        message: `${noticia.titulo}\n\n${noticia.descripcion}\n\nFuente: ${noticia.fuente || ""}`,
        url: noticia.imagen,
      });
      registrarInteraccion("compartir");
    } catch (error) {
      console.log("Error al compartir:", error);
    }
  };
  const manejarCalificacion = async (estrella) => {
    setCalificacionUsuario(estrella);
    try {
      await axios.post(`http://192.168.1.5:8080/api/calificacion/${noticia.id}`, { valor: estrella });
    } catch (err) {
      console.error("Error al guardar calificación:", err);
    }
  };


  return (
    <TouchableOpacity activeOpacity={0.9} onPress={manejarVer}>
      <Animated.View style={[styles.tarjeta, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.row}>
          <View style={styles.left}>
            {noticia.categoria && (
              <View style={[styles.etiquetaCategoria, { backgroundColor: coloresCategorias[noticia.categoria] || coloresCategorias.Otro }]}>
                <Text style={styles.textoCategoria}>{noticia.categoria}</Text>
              </View>
            )}
            <Title style={styles.titulo} numberOfLines={2}>{noticia.titulo}</Title>
            <Paragraph style={styles.descripcion} numberOfLines={3}>{noticia.descripcion}</Paragraph>
          </View>
          <Image source={{ uri: noticia.imagen }} style={styles.imagenRight} />
        </View>

        {/* Acciones */}
        <View style={styles.filaAcciones}>
          <Accion icon="eye" iconColor="#660909ff" contador={contadorLecturas} onPress={manejarVer} texto="Ver" />
      <Accion
            icon="comment"
            iconColor="#2196F3"
            contador={contadorComentarios}
            onPress={() =>
              alVerDetalle({
                ...noticia,
                mostrarComentarios: true,
              })
            }
            texto="Comentarios"
          />
          <Accion icon="thumb-up" iconColor="#f44336" contador={contadorLikes} onPress={manejarLike} texto="Me gusta" />
          <Accion icon="bookmark" iconColor={estaGuardada ? "#FFC107" : "#0d93e681"} contador={contadorGuardados} onPress={manejarFavorito} texto="Guardar" />
          <Accion icon="share-variant" iconColor="#2196F3" contador={contadorCompartidos} onPress={manejarCompartir} texto="Compartir" />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tarjeta: { marginBottom: 20, borderRadius: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3, paddingBottom: 10 },
  row: { flexDirection: "row", alignItems: "flex-start", padding: 10 },
  left: { flex: 1, paddingRight: 10, justifyContent: "flex-start" },
  titulo: { fontSize: 16, fontWeight: "700", color: "#333" },
  descripcion: { fontSize: 14, color: "#666" },
  imagenRight: { width: 110, height: 110, borderRadius: 8, backgroundColor: "#eee", marginTop: 20 },
  etiquetaCategoria: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 8 },
  textoCategoria: { color: "#fff", fontSize: 12, fontWeight: "700" },
  filaAcciones: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 10 },
  contenedorAccion: { alignItems: "center", justifyContent: "center", width: 55 },
  botonCircular: { backgroundColor: "#f3f3f3", borderRadius: 40, width: 46, height: 46, justifyContent: "center", alignItems: "center" },
  contador: { fontSize: 12, color: "#555", fontWeight: "600", marginTop: 3 },
  tooltip: { position: "absolute", bottom: 60, backgroundColor: "#144784", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, zIndex: 10, alignItems: "center", justifyContent: "center", minWidth: 70, maxWidth: 90 },
  textoTooltip: { color: "#fff", fontSize: 11, fontWeight: "600", textAlign: "center" },
});

export default TarjetaNoticia_temp;




 
