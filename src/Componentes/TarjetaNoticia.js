import React, { useEffect, useRef, useState, useCallback } from "react";
import {View,StyleSheet,Animated, Text,Share,Image, TouchableOpacity,Dimensions,TextInput,Button} from "react-native";
import {  Title, Paragraph, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colores, tamanosTexto, espaciado, coloresCategorias } from "../configuracion/colores";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 10;
const CARD_WIDTH = width * 0.99;

const Accion = ({ icon, iconColor, contador, onPress, texto }) => (
  <View style={estilos.accion}>
    <IconButton icon={icon} iconColor={iconColor} size={20} onPress={onPress} />
    <Text style={estilos.contador}>{contador}</Text>
    <Text style={estilos.textoAccion}>{texto}</Text>
  </View>
);

export default function TarjetaNoticia({ noticia, estaGuardada, alCambiarGuardado, alVerDetalle }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [contadorLecturas, setContadorLecturas] = useState(0);
  const [contadorFavoritos, setContadorFavoritos] = useState(0);
  const [contadorComentarios, setContadorComentarios] = useState(0);
  const [contadorCompartidos, setContadorCompartidos] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [comentariosVisibles, setComentariosVisibles] = useState(false);

  const storageKey = `contadorNoticia_${noticia.id}`;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datosContadores = await AsyncStorage.getItem(storageKey);
        if (datosContadores) {
          const parsed = JSON.parse(datosContadores);
          setContadorLecturas(parsed.lecturas || 0);
          setContadorFavoritos(parsed.favoritos || 0);
          setContadorComentarios(parsed.comentarios || 0);
          setContadorCompartidos(parsed.compartidos || 0);
        }
      } catch (error) {
        console.log("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, [noticia]);

  useEffect(() => {
    const guardarContadores = async () => {
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
    };
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

  const irADetalle = useCallback(() => {
    if (alVerDetalle) alVerDetalle();
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

  const toggleComentariosVisibles = () => {
    setComentariosVisibles((prev) => !prev);
  };

  const agregarComentario = () => {
    if (nuevoComentario.trim() !== "") {
      setComentarios((prev) => [
        ...prev,
        { texto: nuevoComentario, fecha: new Date().toLocaleString() },
      ]);
      setNuevoComentario("");
      setContadorComentarios((prev) => prev + 1);
    }
  };

  return (
    <Animated.View style={[estilos.tarjeta, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity activeOpacity={0.95} onPress={irADetalle}>
        <View style={estilos.row}>
          <View style={estilos.left}>
            {noticia.categoria && (
              <View style={[estilos.etiquetaCategoria, { backgroundColor: coloresCategorias[noticia.categoria] || coloresCategorias.Otro }]}>
                <Text style={estilos.textoCategoria}>{noticia.categoria}</Text>
              </View>
            )}
            <Title style={estilos.titulo} numberOfLines={2}>{noticia.titulo}</Title>
            <Paragraph style={estilos.descripcion} numberOfLines={3}>{noticia.descripcion}</Paragraph>

            <View style={estilos.contenedorAcciones}>
              <Accion icon="eye" iconColor={colores.textoGris} contador={contadorLecturas} onPress={irADetalle} texto="Ver" />
              <Accion icon="comment" iconColor={colores.azul || '#144784'} contador={contadorComentarios} onPress={toggleComentariosVisibles} texto="Comentar" />
              <Accion icon="bookmark" iconColor={estaGuardada ? colores.rojoPrimario : colores.textoGrisClaro} contador={contadorFavoritos} onPress={manejarFavorito} texto="Guardar" />
              <Accion icon="share-variant" iconColor={colores.azul || '#144784'} contador={contadorCompartidos} onPress={manejarCompartir} texto="Compartir" />
            </View>
          </View>

          <Image source={{ uri: noticia.imagen }} style={estilos.imagenRight} />
        </View>
      </TouchableOpacity>

      {comentariosVisibles && (
        <View style={estilos.seccionComentarios}>
          <Text style={estilos.tituloComentarios}>Comentarios</Text>
          {comentarios.length > 0 ? (
            comentarios.map((comentario, index) => (
              <View key={index} style={estilos.comentario}>
                <Text>{comentario.texto}</Text>
                <Text style={estilos.fechaComentario}>{comentario.fecha}</Text>
              </View>
            ))
          ) : (
            <Text style={estilos.noComentarios}>No hay comentarios aún.</Text>
          )}

          <TextInput
            style={estilos.inputComentario}
            placeholder="Escribe un comentario..."
            value={nuevoComentario}
            onChangeText={setNuevoComentario}
          />
          <Button title="Comentar" onPress={agregarComentario} />
        </View>
      )}
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: espaciado.normal,
  },
  left: {
    flex: 1,
    paddingRight: espaciado.normal,
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
    paddingVertical: espaciado.minimo,
    gap: 10,
  },
  accion: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contador: {
    fontSize: 12,
    color: colores.textoGris,
  },
  textoAccion: {
    fontSize: 12,
    color: colores.textoGris,
    textAlign: 'center',
    paddingTop: 5,
  },
  imagenRight: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
 


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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: espaciado.normal,
  },
  left: {
    flex: 1,
    paddingRight: espaciado.normal,
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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: espaciado.minimo,
    paddingHorizontal: 0,
    gap: 8,
  },
  accion: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    marginTop: 0,
  },
  contador: {
    color: "#000",
    fontSize: 16,
    marginTop: -6,
    fontWeight: "bold",
    textAlign: "center",
  },
  seccionComentarios: {
    marginTop: espaciado.grande,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: espaciado.normal,
  },
  tituloComentarios: {
    fontSize: tamanosTexto.mediano,
    fontWeight: "700",
    marginBottom: espaciado.pequeno,
    color: colores.textoOscuro,
  },
  noComentarios: {
    color: colores.textoGris,
  },
  comentario: {
    backgroundColor: "#f8f8f8",
    padding: espaciado.pequeno,
    borderRadius: 8,
    marginBottom: espaciado.minimo,
  },
  fechaComentario: {
    fontSize: 11,
    color: colores.textoGris,
    marginTop: 2,
    textAlign: "right",
  },
  inputComentario: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  imagenRight: {
    width: 110,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#eee',
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
});
