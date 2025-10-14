import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Title, Searchbar, Avatar, IconButton } from "react-native-paper";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

// Componentes
import BarraPestanas from "../../componentes/BarraPestanas";
import ListaNoticias from "../../componentes/ListaNoticias";

// Datos
import { noticias } from "../../datos/noticias";

// Configuración
import { NOMBRE_APP, PESTANAS, MENSAJES } from "../../configuracion/constantes";
import { estilos } from "./estilos";

/**
 * PANTALLA DE INICIO
 */
export default function PantallaInicio({ navigation }) {
  const [pestanaActiva, setPestanaActiva] = useState(PESTANAS.DESTACADAS);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [favoritos, setFavoritos] = useState([]);

  const [fuentesCargadas] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fuentesCargadas) return null;

  // Cambiar favorito
  const cambiarFavorito = (noticia) => {
    const existe = favoritos.find((n) => n.id === noticia.id);
    if (existe) {
      setFavoritos(favoritos.filter((n) => n.id !== noticia.id));
    } else {
      setFavoritos([...favoritos, noticia]);
    }
  };

  // Verificar favorito
  const estaEnFavoritos = (noticia) => {
    return favoritos.some((n) => n.id === noticia.id);
  };

  // Filtrar por búsqueda
  const noticiasFiltradas = textoBusqueda
    ? noticias.filter(
        (noticia) =>
          noticia.titulo.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
          noticia.descripcion?.toLowerCase().includes(textoBusqueda.toLowerCase())
      )
    : noticias;

  // Renderizar contenido por pestaña
  const renderizarContenido = () => {
    switch (pestanaActiva) {
      case PESTANAS.MARCADORES:
        return (
          <View>
            <Text style={estilos.tituloSeccion}>Favoritos</Text>
            {favoritos.length === 0 ? (
              <Text style={estilos.textoVacio}>{MENSAJES.SIN_FAVORITOS}</Text>
            ) : (
              <ListaNoticias
                noticias={favoritos}
                estaGuardada={estaEnFavoritos}
                alCambiarGuardado={cambiarFavorito}
                alVerDetalle={(noticia) => navigation.navigate("DetalleNoticia", { noticia })}
              />
            )}
          </View>
        );

      case PESTANAS.DESTACADAS:
        return (
          <View>
            <Text style={estilos.tituloSeccion}>Noticias Destacadas</Text>
            <ListaNoticias
              noticias={noticiasFiltradas}
              estaGuardada={estaEnFavoritos}
              alCambiarGuardado={cambiarFavorito}
              alVerDetalle={(noticia) => navigation.navigate("DetalleNoticia", { noticia })}
            />

            <Text style={estilos.tituloSeccion}>Recientes</Text>
            <ListaNoticias
              noticias={noticias.slice(0, 3)}
              estaGuardada={estaEnFavoritos}
              alCambiarGuardado={cambiarFavorito}
              alVerDetalle={(noticia) => navigation.navigate("DetalleNoticia", { noticia })}
            />
          </View>
        );

      default:
        return <Text style={estilos.textoVacio}>Sección en desarrollo...</Text>;
    }
  };

  return (
    <SafeAreaView style={estilos.contenedor}>
      {/* ENCABEZADO */}
      <View style={estilos.encabezado}>
        <View style={estilos.contenedorTitulo}>
          <Avatar.Image
            size={45}
            source={require("../../../assets/Logos/nt-el-reloj.gif")}
          />
          <Title style={estilos.tituloApp}>{NOMBRE_APP}</Title>
        </View>
        <IconButton
          icon="bell-outline"
          size={24}
          onPress={() => console.log("Notificaciones")}
        />
      </View>

      {/* BUSCADOR */}
      <Searchbar
        placeholder={MENSAJES.BUSCAR_PLACEHOLDER}
        value={textoBusqueda}
        onChangeText={setTextoBusqueda}
        style={estilos.buscador}
        elevation={1}
      />

      {/* CONTENIDO */}
      <ScrollView style={estilos.contenido} showsVerticalScrollIndicator={false}>
        <BarraPestanas
          pestanaActiva={pestanaActiva}
          alCambiarPestana={setPestanaActiva}
        />

        {renderizarContenido()}
      </ScrollView>

      {/* NAVEGACIÓN INFERIOR */}
      <View style={estilos.barraNavegacion}>
        <IconButton
          icon="home"
          size={26}
          iconColor={pestanaActiva === PESTANAS.DESTACADAS ? "#0059ff" : "#888"}
          onPress={() => setPestanaActiva(PESTANAS.DESTACADAS)}
        />
        <IconButton
          icon="compass-outline"
          size={26}
          iconColor={pestanaActiva === PESTANAS.DESCUBRIR ? "#0059ff" : "#888"}
          onPress={() => setPestanaActiva(PESTANAS.DESCUBRIR)}
        />
        <IconButton
          icon="bookmark"
          size={26}
          iconColor={pestanaActiva === PESTANAS.MARCADORES ? "#0059ff" : "#888"}
          onPress={() => setPestanaActiva(PESTANAS.MARCADORES)}
        />
        <IconButton
          icon="cog-outline"
          size={26}
          iconColor="#888"
          onPress={() => console.log("Configuración")}
        />
      </View>
    </SafeAreaView>
  );
}
