import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Title, Searchbar, Avatar } from "react-native-paper";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import { noticias } from "../../Data/noticias";
import { NOMBRE_APP, PESTANAS, MENSAJES } from "../../configuracion/constantes";
import BarraPestanas from "../../Componentes/BarraPestanas";
import TarjetaNoticia from "../../Componentes/TarjetaNoticia_temp";
import estilos from "./estilos";
export default function PantallaInicio({ navigation }) {
  const [pestanaActiva, setPestanaActiva] = useState(PESTANAS.DESTACADAS);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [recargar, setRecargar] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      setRecargar(prev => !prev);
    }, [])
  );

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
  ? noticias.filter((noticia) =>
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

  const renderizarCabeceraLista = () => {
    if (pestanaActiva === PESTANAS.DESTACADAS) {
      return (
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
      );
    }
    if (pestanaActiva === PESTANAS.MARCADORES) {
      return <Text style={estilos.tituloSeccion}>Guardados</Text>;
    }
    return null;
  };

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
        placeholder={MENSAJES.BUSCAR_PLACEHOLDER}
        value={textoBusqueda}
        onChangeText={setTextoBusqueda}
        style={estilos.buscador}
        elevation={1} />

      <BarraPestanas
        pestanaActiva={pestanaActiva}
        alCambiarPestana={(nuevaPestana) => {
          if (nuevaPestana === PESTANAS.DESCUBRIR) {
            navigation.navigate("Descubrir");
          } else {
            setPestanaActiva(nuevaPestana);
          }
        }} />

      <FlatList
        data={pestanaActiva === PESTANAS.MARCADORES ? favoritos : noticiasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        extraData={recargar}
        ListHeaderComponent={renderizarCabeceraLista}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 10, marginBottom: 12 }}>
            <TarjetaNoticia
              key={`${item.id}-${recargar}`} 
              noticia={item}
              estaGuardada={estaEnFavoritos(item)}
              alCambiarGuardado={cambiarFavorito}
              alVerDetalle={({ mostrarComentarios }) => {
                navigation.navigate("DetalleNoticia", {
                  noticia: item,
                  mostrarComentarios: mostrarComentarios ?? false,
                });
              }}
              recargar={recargar} 
            />
          </View>
        )}
        ListEmptyComponent={
          pestanaActiva === PESTANAS.MARCADORES ? (
            <Text style={estilos.textoVacio}>{MENSAJES.SIN_FAVORITOS}</Text>
          ) : <Text style={estilos.textoVacio}>No se encontraron resultados para tu búsqueda.</Text>
        }
        contentContainerStyle={{ paddingBottom: 90 }}  />
    </SafeAreaView>
  );
}
