import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Title, Searchbar, Avatar } from "react-native-paper";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { noticias } from "../../Data/noticias";
import { NOMBRE_APP, PESTANAS, MENSAJES } from "../../configuracion/constantes";
import BarraPestanas from "../../Componentes/BarraPestanas";
import TarjetaNoticia from "../../Componentes/TarjetaNoticia";
import estilos from "./estilos";

export default function PantallaInicio({ navigation }) {
  const [pestanaActiva, setPestanaActiva] = useState(PESTANAS.DESTACADAS);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  const [fuentesCargadas] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const cargarFavoritos = async () => {
      try {
        const favoritosGuardados = await AsyncStorage.getItem('favoritos');
        if (favoritosGuardados !== null) {
          setFavoritos(JSON.parse(favoritosGuardados));
        }
      } catch (error) {
        console.error('Error al cargar los favoritos', error);
      }
    };
    cargarFavoritos();
  }, []);

  useEffect(() => {
    const guardarFavoritos = async () => {
      try {
        await AsyncStorage.setItem('favoritos', JSON.stringify(favoritos));
      } catch (error) {
        console.error('Error al guardar los favoritos', error);
      }
    };
    guardarFavoritos();
  }, [favoritos]);

  if (!fuentesCargadas) return null;

  const cambiarFavorito = (noticia) => {
    const existe = favoritos.find((n) => n.id === noticia.id);
    if (existe) {
      setFavoritos(favoritos.filter((n) => n.id !== noticia.id));
    } else {
      setFavoritos([...favoritos, noticia]);
    }
  };

  const estaEnFavoritos = (noticia) => {
    return favoritos.some((n) => n.id === noticia.id);
  };

  const noticiasFiltradas = textoBusqueda
    ? noticias.filter(
        (noticia) =>
          noticia.titulo.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
          (noticia.descripcion &&
            noticia.descripcion.toLowerCase().includes(textoBusqueda.toLowerCase()))
      )
    : noticias;

  const anchoPantalla = Dimensions.get("window").width;
  const itemAncho = Math.round(anchoPantalla * 0.9);
  const itemMargen = 10;

  const renderItemCarrusel = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("DetalleNoticia", { noticia: item })}
      style={{ width: itemAncho, marginHorizontal: itemMargen }}
    >
      <Image
        source={{ uri: item.imagen }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 12,
        }}
        resizeMode="cover"
      />
      <Text style={estilos.tituloImagenCarrusel}>{item.titulo}</Text>
    </TouchableOpacity>
  );

  const renderizarCabecera = () => (
    <>
      <View style={estilos.encabezado}>
        <View style={estilos.contenedorTitulo}>
          <Avatar.Image
            size={45}
            source={require("../../assets/Logos/nt-el-reloj.gif")}
          />
          <Title style={estilos.tituloApp}>{NOMBRE_APP}</Title>
        </View>
      </View>

      <Searchbar
        placeholder={MENSAJES.BUSCAR_PLACEHOLDER}
        value={textoBusqueda}
        onChangeText={setTextoBusqueda}
        style={estilos.buscador}
        elevation={1}
      />

      <BarraPestanas
        pestanaActiva={pestanaActiva}
        alCambiarPestana={(nuevaPestana) => {
          if (nuevaPestana === PESTANAS.DESCUBRIR) {
            navigation.navigate("Descubrir");
          } else {
            setPestanaActiva(nuevaPestana);
          }
        }}
      />

      {pestanaActiva === PESTANAS.DESTACADAS && (
        <>
          <Text style={estilos.tituloSeccion}>Tendencia</Text>
          <FlatList
            data={noticias.slice(0, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={itemAncho + itemMargen * 2}
            contentContainerStyle={{ paddingHorizontal: itemMargen }}
            renderItem={renderItemCarrusel}
            keyExtractor={(item) => `carrusel-${item.id}`}
          />
          <Text style={[estilos.tituloSeccion, { marginTop: 16 }]}>Noticias Destacadas</Text>
        </>
      )}

      {pestanaActiva === PESTANAS.MARCADORES && (
        <Text style={estilos.tituloSeccion}>Guardados</Text>
      )}
    </>
  );

  return (
    <SafeAreaView style={estilos.contenedor}>
      <FlatList
        data={pestanaActiva === PESTANAS.MARCADORES ? favoritos : noticiasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderizarCabecera}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 10, marginBottom: 12 }}>
            <TarjetaNoticia
              noticia={item}
              estaGuardada={estaEnFavoritos(item)}
              alCambiarGuardado={cambiarFavorito}
              alVerDetalle={() => navigation.navigate("DetalleNoticia", { noticia: item })}
            />
          </View>
        )}
        ListEmptyComponent={
          pestanaActiva === PESTANAS.MARCADORES ? (
            <Text style={estilos.textoVacio}>{MENSAJES.SIN_FAVORITOS}</Text>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      />
    </SafeAreaView>
  );
}
