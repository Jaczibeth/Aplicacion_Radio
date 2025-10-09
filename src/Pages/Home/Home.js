import React, { useRef, useState } from "react";
import { View, ScrollView, Dimensions, Animated, FlatList, Platform, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph, Searchbar, Avatar, IconButton } from "react-native-paper";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

// Definimos el ancho de la pantalla
const { width } = Dimensions.get("window");

const categories = ["Nuevas Noticias"];

export default function Home() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedCategory, setSelectedCategory] = useState("Nuevas Noticias");
  const [showSaved, setShowSaved] = useState(false);
  const [savedNews, setSavedNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const allNews = [
    {
      id: 1,
      category: "Política",
      title: "Multa a los que saquen memes a politicos",
      image: "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/FSY2SUE4NYI6TA7DIX663DUNFY.jpg&w=1800&h=1800",
      source: "Presidenta De mexico",
      time: "2h Hoy",
    },
    {
      id: 2,
      category: "Cultural",
      title: "Fiestas Patronales en tlaxiaco",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKmYPD9f8iWwdabLlzsePIL-gzLgvezfvwMw&s",
      source: "Tlaxiaco",
      time: "1h Hoy",
    },
    {
      id: 3,
      category: "Educación",
      title: "Fechas para Becas Rita",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYUPi9vHpCfVVNXYW7owFImREiWuXEtKHCeg&s",
      source: "Educacion media superior",
      time: "3h Hoy",
    },
    {
      id: 4,
      category: "Política",
      title: "Reporte de decisiones presidenciales",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyz5XNTQBWIi0eRP3uwBPw8SUHNq6ddqti1g&s",
      source: "Importante",
      time: "4h Hoy",
    },
    {
      id: 5,
      category: "History",
      title: "Descubrimientos en ruinas antiguas",
      image: "https://media.cnn.com/api/v1/images/stellar/prod/cnne-1346917-una-zona-residencial-el-mas-reciente-descubrimiento-arqueologico-en-chichen-itza.jpg?c=original",
      source: "History jax",
      time: "5h Hoy",
      description: "Explora las civilizaciones antiguas.",
    },
    {
      id: 6,
      category: "Deportes",
      title: "Resultados de los partidos",
      image: "https://play-lh.googleusercontent.com/Z3686VO4ILSGo_UiDPSk3i2oPf6KzCRNZhpOo5_7pTTq3JYhcUNsm1EMrK6mG_xiOBQg=w526-h296-rw",
      source: "LuisVega",
      time: "2h Hoy",
      description: "Resumen completo de los partidos de hoy.",
    },
  ];

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) return null;

  // Filtrar noticias según si estamos mostrando guardadas o no
  const filteredNews = showSaved
    ? savedNews
    : selectedCategory === "Nuevas Noticias"
    ? allNews
    : allNews.filter((n) => n.category === selectedCategory);

  // Filtro de búsqueda
  const searchedNews = filteredNews.filter(
    (newsItem) =>
      newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsItem.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separación de las noticias para el carrusel y la lista
  const carouselNews = showSaved ? [] : searchedNews.slice(0, 3);
  const listNews = showSaved ? searchedNews : searchedNews.slice(3);

  const toggleSaveNews = (newsItem) => {
    const exists = savedNews.find((n) => n.id === newsItem.id);
    if (exists) {
      setSavedNews(savedNews.filter((n) => n.id !== newsItem.id));
    } else {
      setSavedNews([...savedNews, newsItem]);
    }
  };

  const isSaved = (newsItem) => savedNews.some((n) => n.id === newsItem.id);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? 35 : 0,
      }}
    >
      {/* Encabezado */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}>
        <View>
          <Paragraph style={{ fontFamily: "Poppins_400Regular", color: "#666" }}>Bienvenid@s</Paragraph>
          <Title style={{ fontFamily: "Poppins_600SemiBold" }}>LA TLAXIAQUEÑA</Title>
        </View>
        <Avatar.Image size={45} source={require("../../../assets/Logos/nt-el-reloj.gif")} />
      </View>

      {/* Buscador */}
      <Searchbar
        placeholder="¿Qué deseas buscar hoy?"
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
        style={{
          marginHorizontal: 15,
          borderRadius: 10,
          marginBottom: 10,
          backgroundColor: "#f0f0f0",
        }}
      />
      <ScrollView>
        {/* Título: Lo más reciente */}
        <View style={{ marginHorizontal: 15, marginBottom: 5 }}>
          <Title style={{ fontFamily: "Poppins_600SemiBold", fontSize: 22 }}>Lo más reciente</Title>
        </View>
        {/* Carrusel de noticias */}
        {!showSaved && (
          <Animated.FlatList
            data={carouselNews}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }  )}
            style={{ paddingBottom: 15 }}
            renderItem={({ item }) => (
              <Card style={{ marginHorizontal: 15, width: width - 40, borderRadius: 10 }}>
                <Card.Cover source={{ uri: item.image }} style={{ height: 200, width: "100%", resizeMode: "cover" }} />
                <Card.Content>
                  <Paragraph style={{ fontFamily: "Poppins_400Regular", fontSize: 12, color: "#888" }}>
                    {item.source} - {item.time}
                  </Paragraph>
                  <Title style={{ fontFamily: "Poppins_600SemiBold", fontSize: 16 }}>{item.title}</Title>
                </Card.Content>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, paddingBottom: 10 }}>
                  <IconButton icon="eye" onPress={() => {}} />
                  <IconButton icon={isSaved(item) ? "bookmark" : "bookmark-outline"} onPress={() => toggleSaveNews(item)} />
                </View>
              </Card>   )} /> )}
        {/* Categorías horizontales (Solo "Nuevas Noticias") */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }} contentContainerStyle={{ paddingHorizontal: 10 }}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedCategory(cat);
                setShowSaved(false);
              }}
              style={{
                backgroundColor: selectedCategory === cat ? "#222" : "#eee",
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
              }}>
              <Paragraph style={{ color: selectedCategory === cat ? "#fff" : "#333", fontFamily: "Poppins_400Regular" }}>
                {cat}
              </Paragraph>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de noticias */}
        <View style={{ marginBottom: 80 }}>
          {listNews.length === 0 ? (
            <Paragraph style={{ textAlign: "center", marginTop: 20 }}>No hay noticias en esta categoría o guardadas.</Paragraph>
          ) : (
            listNews.map((item) => (
              <Card key={item.id} style={{ marginHorizontal: 15, marginBottom: 10 }}>
                <Card.Cover source={{ uri: item.image }} style={{ height: 200, width: "100%", resizeMode: "cover" }} />
                <Card.Content>
                  <Paragraph style={{ fontFamily: "Poppins_400Regular", fontSize: 12, color: "#888" }}>
                    {item.source} - {item.time}
                  </Paragraph>
                  <Title style={{ fontFamily: "Poppins_600SemiBold", fontSize: 16 }}>{item.title}</Title>
                  <Paragraph style={{ fontFamily: "Poppins_400Regular", fontSize: 14, color: "#555" }}>
                    {item.description}
                  </Paragraph>
                </Card.Content>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, paddingBottom: 10 }}>
                  <IconButton icon="eye" onPress={() => {}} />
                  <IconButton icon={isSaved(item) ? "bookmark" : "bookmark-outline"} onPress={() => toggleSaveNews(item)} />
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
      {/* Navbar inferior */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 10,
        }}  >
        <IconButton icon="home" onPress={() => { setShowSaved(false); setSelectedCategory("Nuevas Noticias"); }} />
        <IconButton icon="bookmark" onPress={() => setShowSaved(true)} />
        <IconButton icon="cog" onPress={() => alert("Configuración")} />
      </View>
</View>
);
}
