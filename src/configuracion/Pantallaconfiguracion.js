import React, { useEffect, useRef, useState } from "react";
import { View, Animated, StyleSheet, ScrollView, Linking, TouchableOpacity, TextInput,  Text,  Image,} from "react-native";
import { IconButton } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import NavegacionInferior from "../Componentes/NavegacionInferior";

export default function PantallaConfiguracion({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [comentario, setComentario] = useState("");
  const [mostrarAlumnos, setMostrarAlumnos] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Animación para lista de alumnos
  const [animLista] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (mostrarAlumnos) {
      Animated.timing(animLista, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animLista, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [mostrarAlumnos]);

  const handleCalificacion = (rating) => setCalificacion(rating);

  const handleSendComment = () => {
    if (comentario.trim() === "") {
      alert("Por favor, ingresa un comentario antes de enviarlo.");
    } else {
      Linking.openURL(
        `mailto:jaczicruz@gmail.com?subject=Comentario%20sobre%20la%20App&body=${comentario}`
      );
      setComentario("");
    }
  };

  const handleSupport = () =>
    Linking.openURL(
      "mailto:jaczicruz@gmail.com?subject=Soporte%20y%20Mantenimiento"
    );

  const redesSociales = [
    { nombre: "Facebook", url: "https://www.facebook.com/share/1gNuX9RpDQ/", icon: "facebook", color: "#1877F2" },
    { nombre: "Instagram", url: "https://www.instagram.com/ntelreloj?igsh=MXZhcmQ1czZsdTVkeQ==", icon: "instagram", color: "#E1306C" },
    { nombre: "X", url: "https://x.com/LaTlaxiaquenaOn?t=jGFVMeHrWWSEZTei-chq1w&s=09", icon: "twitter", color: "#000000" },
    { nombre: "YouTube", url: "https://youtube.com/@noticieroselrelojdetlaxiaco?si=8e8oi5BFxuZTvMjA", icon: "youtube-play", color: "#FF0000" },
    { nombre: "Ubicación", url: "https://maps.app.goo.gl/7pduto4TCMH5xGbF9", icon: "map-marker", color: "#34A853" },
  ];

  const alumnos = [
    "Los desarrolladores de esta aplicación son alumnos de la carrera en INGENIERÍA EN SISTEMAS COMPUTACIONALES del Instituto Tecnológico de Tlaxiaco, cursando el séptimo semestre del grupo B:",
    "Jaczibeth Cruz Ramirez",
    "Edgar Mauricio Sarmiento Ruiz",
    "Ameli Reyes Hernández",
    "Ana Kimberly Hernandez Perez",
    "Daniel Velasco López",
  ];

  const itemAncho = 70;
  const itemMargen = 12;

  // Auto-scroll del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % redesSociales.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * (itemAncho + itemMargen * 2),
        animated: true,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItemCarrusel = ({ item, index }) => {
    const inputRange = [
      (index - 1) * (itemAncho + itemMargen * 2),
      index * (itemAncho + itemMargen * 2),
      (index + 1) * (itemAncho + itemMargen * 2),
    ];

    const scaleScroll = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });
    const pressAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 1.2,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => Linking.openURL(item.url)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: itemAncho,
          marginHorizontal: itemMargen,
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: Animated.multiply(scaleScroll, pressAnim) }],
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome name={item.icon} size={40} color={item.color} />
        </Animated.View>
        <Text style={{ marginTop: 6, fontSize: 14, fontWeight: "600", color: "#144784" }}>
          {item.nombre}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDots = () => (
    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
      {redesSociales.map((_, index) => (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 4,
            backgroundColor: index === currentIndex ? "#144784" : "#ccc",
          }}
        />
      ))}
    </View>
  );

  const animStyle = {
    opacity: animLista,
    transform: [
      {
        translateY: animLista.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Configuración</Text>
        <Image
          source={require("../assets/Logos/nt-el-reloj-circular.gif")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
        

          <Text style={styles.sectionTitle}>Comentarios sobre la App</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Escribe tu comentario aquí..."
            value={comentario}
            onChangeText={setComentario}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity onPress={handleSendComment} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Enviar comentario</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Soporte y Mantenimiento</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>¿Necesitas ayuda?</Text>
            <TouchableOpacity onPress={handleSupport}>
              <Text style={styles.supportText}>Contáctanos</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Síguenos en Redes Sociales</Text>
          <Animated.FlatList
            ref={flatListRef}
            data={redesSociales}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.nombre}
            contentContainerStyle={{ paddingHorizontal: itemMargen }}
            renderItem={renderItemCarrusel}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          />
          {renderDots()}

          <Text style={styles.sectionTitle}>Acerca de</Text>
          <TouchableOpacity
            onPress={() => setMostrarAlumnos(!mostrarAlumnos)}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#144784",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 30,
              elevation: 4,
              marginVertical: 8,
            }}
          >
            <FontAwesome
              name={mostrarAlumnos ? "chevron-up" : "chevron-down"}
              size={18}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              {mostrarAlumnos ? "Ocultar información" : "Ver más información"}
            </Text>
          </TouchableOpacity>

          {mostrarAlumnos && (
            <Animated.View style={[styles.listaAlumnos, animStyle]}>
              <Text style={styles.descripcionTexto}>
                Los desarrolladores de esta aplicación son alumnos de la carrera en
                <Text style={{ fontWeight: "bold" }}> INGENIERÍA EN SISTEMAS COMPUTACIONALES </Text>
                del Instituto Tecnológico de Tlaxiaco, cursando el séptimo semestre del grupo B:
              </Text>

              {alumnos.slice(1).map((nombre, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.alumnoCard,
                    {
                      opacity: animLista,
                      transform: [
                        {
                          translateY: animLista.interpolate({
                            inputRange: [0, 1],
                            outputRange: [10 * (index + 1), 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <FontAwesome name="user" size={18} color="#144784" style={{ marginRight: 8 }} />
                  <Text style={styles.alumnoTexto}>{nombre}</Text>
                </Animated.View>
              ))}
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
      <NavegacionInferior navigation={navigation} />
    </SafeAreaView>
   
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#e3e9f2ff",
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#161515ff",
    textAlign: "center",
    flex: 1,
  },
  logo: { width: 50, height: 50 },
  content: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#144784",
    marginTop: 24,
    marginBottom: 8,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: { fontSize: 16, color: "#333" },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#144784",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  supportText: { fontSize: 16, color: "#144784" },
  stars: { flexDirection: "row", justifyContent: "center" },
  listaAlumnos: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    elevation: 2,
  },
  descripcionTexto: {
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
    textAlign: "justify",
  },
  alumnoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6f9",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    elevation: 2,
  },
  alumnoTexto: {
    fontSize: 15,
    color: "#144784",
    fontWeight: "600",
  },
});