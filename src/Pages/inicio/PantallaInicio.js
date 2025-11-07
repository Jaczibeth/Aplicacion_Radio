import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Title, Searchbar, Avatar } from "react-native-paper";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { NOMBRE_APP, PESTANAS, MENSAJES } from "../../configuracion/constantes";
import BarraPestanas from "../../Componentes/BarraPestanas";
import TarjetaNoticia from "../../Componentes/TarjetaNoticia_temp";
import estilos from "./estilos";
import useAnimacionBuscar from "../../Componentes/AnimacionBuscar";
import useNoticias from "../../hooks/useNoticias";

export default function PantallaInicio({ navigation }) {
  // Estados principales
  const [pestanaActiva, setPestanaActiva] = useState(PESTANAS.DESTACADAS);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [favoritos, setFavoritos] = useState([]);

  // Hook de noticias
  const { noticias, cargando, error, eliminarNoticia, recargar } = useNoticias();

  // Animación del buscador
  const textoAnimado = useAnimacionBuscar();

  // Cargar fuentes
  const [fuentesCargadas] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  // Cargar favoritos al iniciar
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

  // Guardar favoritos cuando cambien
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

  // Recargar noticias cuando la pantalla vuelve a enfocarse
  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [])
  );

  // Configuración del carrusel
  const anchoPantalla = Dimensions.get("window").width;
  const itemAncho = Math.round(anchoPantalla * 0.9);
  const itemMargen = 10;

  // Refs para mantener/restaurar índice del carrusel aunque se recarguen los datos
  const carouselRef = useRef(null);
  const currentIndexRef = useRef(0);
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const first = viewableItems[0];
      // Guardar el índice actual visible
      currentIndexRef.current = first.index ?? 0;
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // Restaurar posición del carrusel después de recargas de datos
  useEffect(() => {
    // Sólo intentar restaurar si ya conocíamos un índice previo
    const idx = currentIndexRef.current ?? 0;
    const maxIndex = Math.max(0, Math.min(2, (noticias ? noticias.slice(0, 3).length - 1 : 0)));
    const toIndex = Math.min(idx, maxIndex);
    if (carouselRef.current && toIndex > 0) {
      // esperar un frame para asegurarnos que el FlatList interno ya montó
      const t = setTimeout(() => {
        try {
          carouselRef.current.scrollToIndex({ index: toIndex, animated: false });
        } catch (e) {
          // fall back silencioso
        }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [noticias]);

  const renderItemCarrusel = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("DetalleNoticia", { noticia: item })}
      style={{ width: itemAncho, marginHorizontal: itemMargen }}
    >
      <Image
        source={{ uri: item.imagen }}
        style={{ width: "100%", height: 200, borderRadius: 12 }}
        resizeMode="cover"
      />
      <Text style={estilos.tituloImagenCarrusel}>{item.titulo}</Text>
    </TouchableOpacity>
  );

  // Encabezado dinámico de la lista
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
            snapToInterval={itemAncho + itemMargen * 2}
            contentContainerStyle={{ paddingHorizontal: itemMargen }}
            renderItem={renderItemCarrusel}
            keyExtractor={(item) => `carrusel-${item.id}`}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
          />
          <Text style={[estilos.tituloSeccion, { marginTop: 16 }]}>
            Noticias Destacadas
          </Text>
        </>
      );
    }
    if (pestanaActiva === PESTANAS.MARCADORES) {
      return <Text style={estilos.tituloSeccion}>Guardados</Text>;
    }
    return null;
  };

  // Memoizar la cabecera para evitar reconstrucciones innecesarias
  const cabeceraMemo = useMemo(() => renderizarCabeceraLista(), [pestanaActiva, noticias]);

  // Mostrar mientras carga o hay error
  if (!fuentesCargadas) return null;
  if (cargando)
    return <Text style={{ textAlign: "center", marginTop: 50 }}>Cargando noticias...</Text>;
  if (error)
    return <Text style={{ textAlign: "center", marginTop: 50 }}>Error: {error}</Text>;

  //  Alternar favoritos
  const cambiarFavorito = (noticia) => {
    const existe = favoritos.find((n) => n.id === noticia.id);
    if (existe) {
      setFavoritos(favoritos.filter((n) => n.id !== noticia.id));
    } else {
      setFavoritos([...favoritos, noticia]);
    }
  };

  //  Verificar si una noticia está en favoritos
  const estaEnFavoritos = (noticia) => favoritos.some((n) => n.id === noticia.id);

  //  Filtrar noticias por texto
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
        inputStyle={{ fontFamily: "Poppins_400Regular" }}
      />

  
      <BarraPestanas
        pestanaActiva={pestanaActiva}
        alCambiarPestana={(nuevaPestana) => {
          if (nuevaPestana === PESTANAS.DESCUBRIR) navigation.navigate("Descubrir");
          else setPestanaActiva(nuevaPestana);
        }}
      />

    
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
    </SafeAreaView>
  );
}
