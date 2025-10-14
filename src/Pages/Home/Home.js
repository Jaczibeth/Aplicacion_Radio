import React, { useRef, useState } from "react";
import { View, ScrollView, Dimensions, Animated, Platform, TouchableOpacity, StyleSheet, } from "react-native";
import { Card, Title, Paragraph, Searchbar, Avatar, IconButton, } from "react-native-paper";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, } from "@expo-google-fonts/poppins";

const { width } = Dimensions.get("window");

const categorias = ["Nuevas Noticias"];

export default function Home({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Nuevas Noticias");
  const [mostrarGuardadas, setMostrarGuardadas] = useState(false);
  const [noticiasGuardadas, setNoticiasGuardadas] = useState([]);
  const [consultaBusqueda, setConsultaBusqueda] = useState("");

  const todasLasNoticias = [
    {
      id: 1, categoria: "Política", titulo: "Multa a los que saquen memes a políticos",
      imagen: "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/FSY2SUE4NYI6TA7DIX663DUNFY.jpg&w=1800&h=1800",
      fuente: "Presidenta De México", tiempo: "2h Hoy", pantalla: "Noticia1",
    },
    {
      id: 2, categoria: "Cultural", titulo: "Fiestas Patronales en Tlaxiaco",
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKmYPD9f8iWwdabLlzsePIL-gzLgvezfvwMw&s",
      fuente: "Tlaxiaco", tiempo: "1h Hoy", pantalla: "Noticia2",
    },
    {
      id: 3, categoria: "Educación", titulo: "Fechas para Becas Rita", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYUPi9vHpCfVVNXYW7owFImREiWuXEtKHCeg&s",
      fuente: "Educación media superior", tiempo: "3h Hoy", pantalla: "Noticia3",
    },
    {
      id: 4,
      categoria: "Política", titulo: "Reporte de decisiones presidenciales", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyz5XNTQBWIi0eRP3uwBPw8SUHNq6ddqti1g&s",
      fuente: "Importante", tiempo: "4h Hoy", pantalla: "Noticia4",
    },
    {
      id: 5, categoria: "Historia", titulo: "Descubrimientos en ruinas antiguas", imagen: "https://media.cnn.com/api/v1/images/stellar/prod/cnne-1346917-una-zona-residencial-el-mas-reciente-descubrimiento-arqueologico-en-chichen-itza.jpg?c=original",
      fuente: "History Jax", tiempo: "5h Hoy", descripcion: "Explora las civilizaciones antiguas.", pantalla: "Noticia5",
    },
    {
      id: 6, categoria: "Deportes", titulo: "Resultados de  los partidos",
      imagen: "https://play-lh.googleusercontent.com/Z3686VO4ILSGo_UiDPSk3i2oPf6KzCRNZhpOo5_7pTTq3JYhcUNsm1EMrK6mG_xiOBQg=w526-h296-rw",
      fuente: "LuisVega",
      tiempo: "2h Hoy", descripcion: "Resumen completo de los partidos de hoy.", pantalla: "Noticia6",
    },
  ];

  const [fuentesCargadas] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, });

  if (!fuentesCargadas) return null;

  // Filtramos las noticias según si se  esta mostrando noticias  guardadas o no
  const noticiasFiltradas = mostrarGuardadas
    ? noticiasGuardadas
    : categoriaSeleccionada === "Nuevas Noticias"
      ? todasLasNoticias
      : todasLasNoticias.filter((n) => n.categoria === categoriaSeleccionada);

  // Filtro de búsqueda de noticias
  const noticiasBuscadas = noticiasFiltradas.filter(
    (noticia) =>
      noticia.titulo.toLowerCase().includes(consultaBusqueda.toLowerCase()) ||
      noticia.descripcion?.toLowerCase().includes(consultaBusqueda.toLowerCase())
  );

  // Separación de las noticias para el carrusel y la lista
  const noticiasCarrusel = mostrarGuardadas ? [] : noticiasBuscadas.slice(0, 3);
  const noticiasLista = mostrarGuardadas
    ? noticiasBuscadas
    : noticiasBuscadas.slice(3);

  const toggleGuardarNoticia = (noticia) => {
    const existe = noticiasGuardadas.find((n) => n.id === noticia.id);
    if (existe) {
      setNoticiasGuardadas(noticiasGuardadas.filter((n) => n.id !== noticia.id));
    } else { setNoticiasGuardadas([...noticiasGuardadas, noticia]); }
  };

  const esGuardada = (noticia) =>
    noticiasGuardadas.some((n) => n.id === noticia.id);

  return (
    <View style={estilos.contenedor}>
      {/* Encabezado */}
      <View style={estilos.encabezado}>
        <View>
          <Paragraph style={estilos.parrafoBienvenida}>Bienvenid@s</Paragraph>
          <Title style={estilos.tituloApp}>LA TLAXIAQUEÑA</Title>
        </View>
        <Avatar.Image size={45} source={require("../../../assets/Logos/nt-el-reloj.gif")} />
      </View>

      {/* Buscador */}
      <Searchbar placeholder="¿Qué deseas buscar hoy?" value={consultaBusqueda} onChangeText={(query) => setConsultaBusqueda(query)} style={estilos.buscador} />
      <ScrollView>
        {/* Título: Lo más reciente */}
        <View style={estilos.tituloReciente}>
          <Title style={estilos.tituloLoMasReciente}>Lo más reciente</Title>
        </View>
        {/* Carrusel de noticias */}
        {!mostrarGuardadas && (
          <Animated.FlatList
            data={noticiasCarrusel}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            style={estilos.listaCarrusel}
            renderItem={({ item, index }) => {
              // Animación de escala y opacidad para cada card
              const inputRange = [
                (index - 1) * (width - 40),
                index * (width - 40),
                (index + 1) * (width - 40),
              ];
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.9, 1, 0.9],
                extrapolate: "clamp",
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.6, 1, 0.6],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  style={[estilos.card, {
                    transform: [{ scale }],
                    opacity,
                    backgroundColor: "rgba(255, 255, 255, 0.85)", // Transparencia suave
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  },]} >
                  <Card.Cover source={{ uri: item.imagen }} style={estilos.imagen} />
                  <Card.Content>
                    <Paragraph style={estilos.parrafoFuenteTiempo}>
                      {item.fuente} - {item.tiempo}
                    </Paragraph>
                    <Title style={estilos.tituloNoticia}>{item.titulo}</Title>
                  </Card.Content>
                  <View style={estilos.botonesCard}>
                    <IconButton icon="eye" onPress={() => navigation.navigate(item.pantalla)} />
                    <IconButton icon={esGuardada(item) ? "bookmark" : "bookmark-outline"} onPress={() => toggleGuardarNoticia(item)} />
                  </View>
                </Animated.View>);
            }} />)}
        {/* Categorías horizontales (Solo "Nuevas Noticias en este caso aplica") */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false} style={estilos.categoriasScroll} >
          {categorias.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCategoriaSeleccionada(cat);
                setMostrarGuardadas(false);
              }} style={estilos.botonCategoria(categoriaSeleccionada === cat)} >
              <Paragraph style={estilos.textoCategoria(categoriaSeleccionada === cat)}>{cat} </Paragraph>
            </TouchableOpacity>))}
        </ScrollView>
        {/* Lista de noticias */}
        <View style={estilos.listaNoticias}>
          {noticiasLista.length === 0 ? (
            <Paragraph style={estilos.parrafoSinNoticias}>
              No hay noticias en esta categoría o guardadas.
            </Paragraph>
          ) : (
            noticiasLista.map((item) => (
              <Card
                key={item.id}
                style={[
                  estilos.cardLista,
                  {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 3,
                  },]}  >
                <Card.Cover source={{ uri: item.imagen }} style={estilos.imagen} />
                <Card.Content>
                  <Paragraph style={estilos.parrafoFuenteTiempo}>
                    {item.fuente} - {item.tiempo}
                  </Paragraph>
                  <Title style={estilos.tituloNoticia}>{item.titulo}</Title>
                  <Paragraph style={estilos.parrafoDescripcion}>
                    {item.descripcion}
                  </Paragraph>
                </Card.Content>
                <View style={estilos.botonesCard}>
                  <IconButton icon="eye" onPress={() => navigation.navigate(item.pantalla)} />
                  <IconButton icon={esGuardada(item) ? "bookmark" : "bookmark-outline"} onPress={() => toggleGuardarNoticia(item)} />
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* Navbar inferior */}
      <View style={estilos.navbar}>
        <IconButton icon="home" onPress={() => { setMostrarGuardadas(false); setCategoriaSeleccionada("Nuevas Noticias"); }} />
        <IconButton icon="bookmark" onPress={() => setMostrarGuardadas(true)} />
        <IconButton icon="cog" onPress={() => navigation.navigate("Configuracion")} />
      </View>
    </View>
  );
}
const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#cdf2f6ff", paddingTop: Platform.OS === "android" ? 35 : 0, },
  encabezado: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 10, },
  parrafoBienvenida: { fontFamily: "Poppins_400Regular", color: "#666", },
  tituloApp: { fontFamily: "Poppins_600SemiBold", },
  buscador: { marginHorizontal: 15, borderRadius: 10, marginBottom: 10, backgroundColor: "#f6e7e7ff", },
  tituloReciente: { marginHorizontal: 15, marginBottom: 5, },
  tituloLoMasReciente: { fontFamily: "Poppins_600SemiBold", fontSize: 22, },
  listaCarrusel: { paddingBottom: 15, },
  card: { marginHorizontal: 15, width: width - 40, borderRadius: 10, overflow: "hidden", },
  imagen: { height: 200, width: "100%", resizeMode: "cover", },
  parrafoFuenteTiempo: { fontFamily: "Poppins_400Regular", fontSize: 12, color: "#888", },
  tituloNoticia: { fontFamily: "Poppins_600SemiBold", fontSize: 16, },
  botonesCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  categoriasScroll: { marginBottom: 10, },
  botonCategoria: (activo) => ({
    backgroundColor: activo ? "#c3dbe5ff" : "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 50,
  }),
  textoCategoria: (activo) => ({
    color: activo ? "#080808ff" : "#333",
    fontFamily: "Poppins_400Regular",
  }),
  listaNoticias: {
    marginBottom: 80,
  },
  parrafoSinNoticias: { textAlign: "center", marginTop: 20, },
  cardLista: { marginHorizontal: 15, marginBottom: 10, borderRadius: 10, overflow: "hidden", },
  parrafoDescripcion: { fontFamily: "Poppins_400Regular", fontSize: 14, color: "#555", },
  navbar: {
    position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#edededff", flexDirection: "row", justifyContent: "space-around",
    paddingVertical: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 10,
    elevation: 10,
  },
});