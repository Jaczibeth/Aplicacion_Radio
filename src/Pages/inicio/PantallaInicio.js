import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Title, Searchbar, Avatar, IconButton } from "react-native-paper";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NOMBRE_APP, PESTANAS, MENSAJES } from "../../configuracion/constantes";
import BarraPestanas from "../../Componentes/BarraPestanas";
import TarjetaNoticia from "../../Componentes/TarjetaNoticia_temp";
import CarruselNoticias from "../../Componentes/CarruselNoticias"; 
import estilos from "./estilos";
import useAnimacionBuscar from "../../hooks/useAnimacionBuscar";
import useNoticias from "../../hooks/useNoticias";
import { useUbicacion } from "../../hooks/useUbicacion";

export default function PantallaInicio({ navigation }) {
  const [pestanaActiva, setPestanaActiva] = useState(PESTANAS.DESTACADAS);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [permisosYaSolicitados, setPermisosYaSolicitados] = useState(false);

  const { noticias, cargando, error, eliminarNoticia } = useNoticias();
  const textoAnimado = useAnimacionBuscar();
  const { solicitarPermisos } = useUbicacion();
  const [fuentesCargadas] = useFonts({ Poppins_400Regular, Poppins_600SemiBold });

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

  useEffect(() => {
    if (noticias.length > 0 && !permisosYaSolicitados && !cargando) {
      setPermisosYaSolicitados(true);
      setTimeout(() => solicitarPermisos(), 500);
    }
  }, [noticias, cargando, permisosYaSolicitados, solicitarPermisos]);

  
  const cambiarFavorito = useCallback(
    (noticia) => {
      const existe = favoritos.find((n) => n.id === noticia.id);
      if (existe) setFavoritos(favoritos.filter((n) => n.id !== noticia.id));
      else setFavoritos([...favoritos, noticia]);
    },
    [favoritos]
  );

  const estaEnFavoritos = useCallback((noticia) => favoritos.some((n) => n.id === noticia.id), [favoritos]);

  
  const noticiasFiltradas = useMemo(() => {
    if (!textoBusqueda) return noticias;
    return noticias.filter(
      (n) =>
        n.titulo.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        (n.descripcion && n.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase()))
    );
  }, [textoBusqueda, noticias]);

 
  const cabeceraMemo = useMemo(() => {
    switch (pestanaActiva) {
      case PESTANAS.DESTACADAS:
        return (
          <>
            <CarruselNoticias noticias={noticias} navigation={navigation} />
            <Text style={[estilos.tituloSeccion, { marginTop: 8 }]}>Noticias Destacadas</Text>
          </>
        );
      case PESTANAS.MARCADORES:
        return <Text style={estilos.tituloSeccion}>Guardados</Text>;
      case PESTANAS.DESCUBRIR:
        return <Text style={estilos.tituloSeccion}>Explora más noticias</Text>;
      default:
        return null;
    }
  }, [pestanaActiva, noticias, navigation]);

 
  const renderItem = useCallback(
    ({ item }) => {
      if (pestanaActiva === PESTANAS.DESCUBRIR) {
        return (
          <View style={{ width: "48%", marginBottom: 15 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("DetalleNoticia", { noticia: item })}
              style={{ borderRadius: 12, overflow: "hidden", backgroundColor: "#fff", elevation: 4 }}
            >
              <Image source={{ uri: item.imagen }} style={{ width: "100%", height: 120 }} />
              <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 14, padding: 6, color: "#333" }} numberOfLines={2}>
                {item.titulo}
              </Text>
              <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 12, paddingHorizontal: 6, paddingBottom: 6, color: "#888" }}>
                {item.categoria}
              </Text>
              <IconButton
                icon="delete"
                iconColor="#d33939ff"
                size={20}
                onPress={() => eliminarNoticia(item.id)}
                style={{
                  position: "absolute",
                  bottom: 1,
                  right: 1,
                  backgroundColor: "#d8cfcf33",
                  borderRadius: 25,
                  padding: 10,
                  elevation: 5,
                }}
              />
            </TouchableOpacity>
          </View>
        );
      }

      return (
        <View style={{ paddingHorizontal: 10, marginBottom: 12 }}>
          <TarjetaNoticia
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
      );
    },
    [pestanaActiva, navigation, estaEnFavoritos, cambiarFavorito, eliminarNoticia]
  );

  
  if (!fuentesCargadas) return null;
  if (cargando) return <Text style={{ textAlign: "center", marginTop: 50 }}>Cargando noticias...</Text>;
  if (error) return <Text style={{ textAlign: "center", marginTop: 50 }}>Error: {error}</Text>;

  const dataAMostrar =
    pestanaActiva === PESTANAS.MARCADORES
      ? favoritos
      : pestanaActiva === PESTANAS.DESCUBRIR
      ? noticiasFiltradas
      : noticiasFiltradas;

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

      <BarraPestanas pestanaActiva={pestanaActiva} alCambiarPestana={(nuevaPestana) => setPestanaActiva(nuevaPestana)} />

      <FlatList
        data={dataAMostrar}
        keyExtractor={(item) => item.id.toString()}
        extraData={favoritos}
        ListHeaderComponent={cabeceraMemo}
        renderItem={renderItem}
        ListEmptyComponent={
          pestanaActiva === PESTANAS.MARCADORES ? (
            <Text style={estilos.textoVacio}>{MENSAJES.SIN_FAVORITOS}</Text>
          ) : (
            <Text style={estilos.textoVacio}>No se encontraron resultados</Text>
          )
        }
        numColumns={pestanaActiva === PESTANAS.DESCUBRIR ? 2 : 1}
        columnWrapperStyle={pestanaActiva === PESTANAS.DESCUBRIR ? { justifyContent: "space-between", paddingHorizontal: 15 } : null}
        contentContainerStyle={{ paddingBottom: 90, paddingHorizontal: pestanaActiva === PESTANAS.DESCUBRIR ? 0 : 15 }}
        showsVerticalScrollIndicator={false}
        key={pestanaActiva}
        
        initialNumToRender={6}
        windowSize={10}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}
