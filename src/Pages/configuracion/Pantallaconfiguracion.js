import React, { useEffect, useRef, useState } from "react";
import {View,Animated, StyleSheet, ScrollView, Linking,TouchableOpacity,TextInput,Text,Image,} from "react-native";
import { IconButton } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import NavegacionInferior from "../../Componentes/NavegacionInferior";
import CalificacionModal from "../../Componentes/CalificacionModal";
import RatingSummary from "../../Componentes/RatingSummary";

export default function PantallaConfiguracion({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [comentario, setComentario] = useState("");
  const [mostrarAlumnos, setMostrarAlumnos] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [diasRestantes, setDiasRestantes] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);

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

  const verificarBloqueo = async () => {
    try {
      const fechaGuardada = await AsyncStorage.getItem("fechaProximaCalificacion");

      if (!fechaGuardada) return;

      const fechaActual = new Date();
      const fechaProxima = new Date(fechaGuardada);

      const diferencia = Math.ceil(
        (fechaProxima - fechaActual) / (1000 * 60 * 60 * 24)
      );

      if (diferencia > 0) {
        setBloqueado(true);
        setDiasRestantes(diferencia);
      } else {
        setBloqueado(false);
        setDiasRestantes(null);
        await AsyncStorage.removeItem("fechaProximaCalificacion");
      }
    } catch (e) {
      console.log("Error verificando bloqueo:", e);
    }
  };

  useEffect(() => {
    verificarBloqueo();
  }, [refreshKey]);

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
    Linking.openURL("mailto:jaczicruz@gmail.com?subject=Soporte%20y%20Mantenimiento");

  const redesSociales = [
    { nombre: "Facebook", url: "https://www.facebook.com/share/1gNuX9RpDQ/", icon: "facebook", color: "#1877F2" },
    { nombre: "Instagram", url: "https://www.instagram.com/ntelreloj?igsh=MXZhcmQ1czZsdTVkeQ==", icon: "instagram", color: "#E1306C" },
    { nombre: "X", url: "https://x.com/LaTlaxiaquenaOn?t=jGFVMeHrWWSEZTei-chq1w&s=09", icon: "twitter", color: "#000" },
    { nombre: "YouTube", url: "https://youtube.com/@noticieroselrelojdetlaxiaco?si=8e8oi5BFxuZTvMjA", icon: "youtube-play", color: "#FF0000" },
    { nombre: "Ubicación", url: "https://maps.app.goo.gl/7pduto4TCMH5xGbF9", icon: "map-marker", color: "#34A853" },
  ];

  const alumnos = [
    "Los desarrolladores de esta aplicación son alumnos de la carrera en INGENIERÍA EN SISTEMAS COMPUTACIONALES del Instituto Tecnológico de Tlaxiaco, cursando el séptimo semestre del grupo B:",
    "Jaczibeth Cruz Ramirez",
    "Edgar Mauricio Sarmiento Ruiz",
    "Ameli Reyes Hernández",
    "Ana Kimberly Hernandez Pérez",
    "Daniel Velasco López",
  ];

  const itemAncho = 70;
  const itemMargen = 12;

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

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => Linking.openURL(item.url)}
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
        <Text
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: "600",
            color: "#144784",
          }}
        >
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

 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 50}}
        showsVerticalScrollIndicator={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Configuración</Text>
          <Image
            source={require("../../assets/Logos/nt-el-reloj-circular.gif")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <Animated.View style={{ opacity: fadeAnim }}>
         
            <Text style={styles.sectionTitle}>Comentarios sobre la App</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Escribe tu comentario aquí..."
              value={comentario}
              onChangeText={setComentario}
              multiline
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

        
            <Text style={styles.sectionTitle}>Calificar App</Text>
            <RatingSummary key={refreshKey} />

            <View style={styles.option}>
              <Text style={styles.optionText}>Danos tu opinión</Text>

              {bloqueado ? (
                <View>
                  
                  <Text style={{ fontSize: 12, color: "#e63946" }}>
                    Podrás calificar en {diasRestantes} días
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.botonCalificar}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.botonCalificarTexto}>Calificar </Text>
                </TouchableOpacity>
              )}
            </View>

         
            <Text style={styles.sectionTitle}>Síguenos en Redes Sociales</Text>

            <Animated.FlatList
              ref={flatListRef}
              data={redesSociales}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.nombre}
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
              style={styles.verMasBtn}
            >
              <FontAwesome
                name={mostrarAlumnos ? "chevron-up" : "chevron-down"}
                size={18}
                color="#fff"
              />
              <Text style={styles.verMasTexto}>
                {mostrarAlumnos ? "Ocultar información" : "Ver más información"}
              </Text>
            </TouchableOpacity>

            {mostrarAlumnos && (
              <Animated.View style={[styles.listaAlumnos, { opacity: animLista }]}>
                <ScrollView
                  style={{ maxHeight: 250 }}
                  nestedScrollEnabled={true}   
                >
                  {alumnos.map((nombre, index) => (
                    <View key={index} style={styles.alumnoCard}>
                      <FontAwesome
                        name="user"
                        size={18}
                        color="#144784"
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.alumnoTexto}>{nombre}</Text>
                    </View>
                  ))}
                </ScrollView>
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </ScrollView>

      {/* Modal */}
      <CalificacionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRatingSuccess={async () => {
          setModalVisible(false);

          const fechaActual = new Date();
          const fechaProxima = new Date();
          fechaProxima.setDate(fechaActual.getDate() + 30);

          await AsyncStorage.setItem(
            "fechaProximaCalificacion",
            fechaProxima.toISOString()
          );

          setRefreshKey((prevKey) => prevKey + 1);
        }}
      />

      <NavegacionInferior navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  scrollContainer: { flex: 1 },
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
  content: { paddingHorizontal: 16 },
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
    backgroundColor: "#fff",
    minHeight: 80,
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
  listaAlumnos: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  alumnoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6f9",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
alumnoTexto: {
  fontSize: 15,
  color: "#144784",
  fontWeight: "600",
  textAlign: "justify",
  padding:20,
},
botonCalificar: {
    backgroundColor: "#144784",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
  },
  botonCalificarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  verMasBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#144784",
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
    marginVertical: 8,
  },
  verMasTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});