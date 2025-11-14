import React, { useState, useEffect, useCallback,useMemo,useRef,} from "react";
import { View, Text, FlatList, Image, TouchableOpacity,  Dimensions, Animated,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Title, Searchbar, Avatar } from "react-native-paper";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold,} from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { NOMBRE_APP, PESTANAS, MENSAJES } from "../../configuracion/constantes";
import BarraPestanas from "../../Componentes/BarraPestanas";
import TarjetaNoticia from "../../Componentes/TarjetaNoticia_temp";
import estilos from "./estilos";
import useAnimacionBuscar from "../../Componentes/AnimacionBuscar";
import useNoticias from "../../hooks/useNoticias";
import { useUbicacion } from "../../hooks/useUbicacion";
import NotificacionFondo from "../../Componentes/NotificacionFondo";

export default function PantallaInicio({ navigation }) {
  const [pestanaActiva, setPestanaActiva] = useState(PESTANAS.DESTACADAS);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [permisosYaSolicitados, setPermisosYaSolicitados] = useState(false);

  const { noticias, cargando, error, eliminarNoticia, recargar } = useNoticias();
  const textoAnimado = useAnimacionBuscar();
  const {
    ubicacion,
    permisoConcedido,
    mostrarNotificacion,
    solicitarPermisos,
    setMostrarNotificacion,
  } = useUbicacion();

  const [fuentesCargadas] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const cargarFavoritos = async () => {
      try {
        const guardados = await AsyncStorage.getItem("favoritos");
        if (guardados) setFavoritos(JSON.parse(guardados));
      } catch (err) {
        console.error("Error al cargar favoritos:", err);
      }
    };
    cargarFavoritos();
  }, []);
  useEffect(() => {
    const guardarFavoritos = async () => {
      try {
        await AsyncStorage.setItem("favoritos", JSON.stringify(favoritos));
      } catch (err) {
        console.error("Error al guardar favoritos:", err);
      }
    };
    guardarFavoritos();
  }, [favoritos]);

  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [])
  );

  // Solicitar permisos después de que las noticias se carguen
  useEffect(() => {
    if (noticias.length > 0 && !permisosYaSolicitados && !cargando) {
      setPermisosYaSolicitados(true);
      // Pequeño delay para asegurar que la interfaz esté lista
      setTimeout(() => {
        solicitarPermisos();
      }, 500);
    }
  }, [noticias, cargando, permisosYaSolicitados]);

  //  CONFIGURACIÓN DEL CARRUSEL 
  const anchoPantalla = Dimensions.get("window").width;
  const itemAncho = Math.round(anchoPantalla * 0.95); // ancho 
  const itemMargen = (anchoPantalla - itemAncho) / 10;

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [puntosAnim, setPuntosAnim] = useState([]);

  // Crear animaciones de los puntos cuando haya noticias
  useEffect(() => {
    if (noticias.length > 0) {
      const nuevosAnim = noticias.slice(0, 3).map(() => new Animated.Value(0));
      setPuntosAnim(nuevosAnim);
      // activar el primero
      nuevosAnim[0].setValue(1);
    }
  }, [noticias]);

  const animarPunto = (index) => {
    puntosAnim.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === index ? 1 : 0,
        useNativeDriver: false,
        friction: 5,
      }).start();
    });
  };

  //  Autoplay del carrusel
  useEffect(() => {
    if (!noticias.length || puntosAnim.length === 0) return;

    const interval = setInterval(() => {
      const siguienteIndex = (currentIndex + 1) % Math.min(noticias.length, 3);
      setCurrentIndex(siguienteIndex);
      carouselRef.current?.scrollToIndex({
        index: siguienteIndex,
        animated: true,
      });
      animarPunto(siguienteIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, noticias, puntosAnim]);

  const renderItemCarrusel = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("DetalleNoticia", { noticia: item })}
      style={{
        width: itemAncho,
        marginHorizontal: 10,
        borderRadius: 12,
        overflow: "hidden",
      }}>
      <Image
        source={{ uri: item.imagen }}
        style={{ width: "100%", height: 220, borderRadius: 12 }}
        resizeMode="cover"/>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: 10,
        }}>
        <Text style={{ color: "#fff", fontWeight: "600" }} numberOfLines={2}>
          {item.titulo}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Cabecera con carrusel
  const renderizarCabeceraLista = () => {
    if (pestanaActiva === PESTANAS.DESTACADAS) {
      return (
        <>
          <Text style={estilos.tituloSeccion}>Tendencia</Text>
          <FlatList
            ref={carouselRef}
            data={noticias.slice(0, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            pagingEnabled
            snapToInterval={itemAncho}
            contentContainerStyle={{ paddingHorizontal: itemMargen }}
            renderItem={renderItemCarrusel}
            keyExtractor={(item) => `carrusel-${item.id}`}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / itemAncho
              );
              setCurrentIndex(index);
              animarPunto(index);
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 8,
              marginBottom: 16,
            }}>
            {puntosAnim.map((anim, index) => {
              const scale = anim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.6],
              });
              const color = anim.interpolate({
                inputRange: [0, 1],
                outputRange: ["#ccc", "#144784"],
              });
              return (
                <Animated.View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 5,
                    backgroundColor: color,
                    transform: [{ scale }],
                  }}/>
              );
            })}
          </View>
          <Text style={[estilos.tituloSeccion, { marginTop: 8 }]}>Noticias Destacadas</Text>
        </>
      );
    }
    if (pestanaActiva === PESTANAS.MARCADORES)
      return <Text style={estilos.tituloSeccion}>Guardados</Text>;
    return null;
  };




  const cabeceraMemo = useMemo(
    () => renderizarCabeceraLista(),
    [pestanaActiva, noticias, puntosAnim]
  );

  if (!fuentesCargadas) return null;
  if (cargando)
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>
        Cargando noticias...
      </Text>
    );
  if (error)
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>Error: {error}</Text>
    );

  const cambiarFavorito = (noticia) => {
    const existe = favoritos.find((n) => n.id === noticia.id);
    if (existe) {
      setFavoritos(favoritos.filter((n) => n.id !== noticia.id));
    } else {
      setFavoritos([...favoritos, noticia]);
    }
  };

  const estaEnFavoritos = (noticia) =>
    favoritos.some((n) => n.id === noticia.id);

  const noticiasFiltradas = textoBusqueda
    ? noticias.filter(
        (n) =>
          n.titulo.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
          (n.descripcion &&
            n.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase()))
      )
    : noticias;

  return (
    <SafeAreaView style={estilos.contenedor}>
      <View style={estilos.encabezado}>
        <View style={estilos.contenedorTitulo}>
          <Avatar.Image
            size={45}
            source={require("../../assets/Logos/nt-el-reloj.gif")}
            style={{ backgroundColor: "transparent" }}
          />
          <Title style={estilos.tituloApp}>{NOMBRE_APP}</Title>
        </View>
      </View>
      <Searchbar
        placeholder={textoAnimado}
        value={textoBusqueda}
        onChangeText={setTextoBusqueda}
        style={estilos.buscador}
        elevation={1}
        inputStyle={{ fontFamily: "Poppins_400Regular" }} />
      <BarraPestanas
        pestanaActiva={pestanaActiva}
        alCambiarPestana={(nuevaPestana) => {
          if (nuevaPestana === PESTANAS.DESCUBRIR)
            navigation.navigate("Descubrir");
          else setPestanaActiva(nuevaPestana);
        }} />
      <FlatList
        data={pestanaActiva === PESTANAS.MARCADORES ? favoritos : noticiasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        extraData={favoritos}
        ListHeaderComponent={cabeceraMemo}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 10, marginBottom: 12 }}>
            <TarjetaNoticia
              key={item.id}
              noticia={item}
              estaGuardada={estaEnFavoritos(item)}
              alCambiarGuardado={cambiarFavorito}
              alVerDetalle={({ mostrarComentarios }) => {
                navigation.navigate("DetalleNoticia", {
                  noticia: item,
                  mostrarComentarios: mostrarComentarios ?? false,
                });
              }}
              eliminarNoticia={eliminarNoticia}
            />
          </View>
        )}
        ListEmptyComponent={
          pestanaActiva === PESTANAS.MARCADORES ? (
            <Text style={estilos.textoVacio}>{MENSAJES.SIN_FAVORITOS}</Text>
          ) : (
            <Text style={estilos.textoVacio}>
              No se encontraron resultados para tu búsqueda.
            </Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      />
      <NotificacionFondo
        visible={mostrarNotificacion}
        onHide={() => setMostrarNotificacion(false)}
      />
    </SafeAreaView>
  );
}