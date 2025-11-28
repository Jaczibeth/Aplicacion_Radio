import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  TextInput,
  Text,
  Image,
} from "react-native";
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
  const [modoModificar, setModoModificar] = useState(false);
  const [diasRestantes, setDiasRestantes] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [calificado, setCalificado] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const verificarBloqueo = async () => {
    try {
      const fechaGuardada = await AsyncStorage.getItem("fechaProximaCalificacion");
      if (!fechaGuardada) {
        setBloqueado(false);
        setCalificado(false);
        setDiasRestantes(null);
        return;
      }
      const fechaActual = new Date();
      const fechaProxima = new Date(fechaGuardada);
      const diferencia = Math.ceil((fechaProxima - fechaActual) / (1000 * 60 * 60 * 24));
      if (diferencia > 0) {
        setBloqueado(true);
        setCalificado(true);
        setDiasRestantes(diferencia);
      } else {
        setBloqueado(false);
        setCalificado(false);
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
      Linking.openURL(`mailto:jaczicruz@gmail.com?subject=Comentario&body=${comentario}`);
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
    "Los desarrolladores de esta aplicación son alumnos de la carrera en INGENIERÍA EN SISTEMAS COMPUTACIONALES del Instituto Tecnológico de Tlaxiaco:",
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

  const handleDesbloquear = async () => {
    try {
      await AsyncStorage.removeItem("fechaProximaCalificacion");
      setBloqueado(false);
      setCalificado(false);
      setDiasRestantes(null);
      setModoModificar(false);
      setRefreshKey((p) => p + 1);
    } catch (e) {
      console.log("Error desbloqueando:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ★★★ AQUI ESTÁ TU SCROLL LIMITADO ★★★ */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 10,
        }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ flexGrow: 0, maxHeight: "86%" }}
      >

        <View style={styles.header}>
          <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Configuración</Text>
          <Image source={require("../../assets/Logos/nt-el-reloj-circular.gif")} style={styles.logo} />
        </View>

        <View style={styles.content}>
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

          <TouchableOpacity
            style={styles.modificarBtn}
            onPress={() => setModoModificar((prev) => !prev)}
          >
            <Text style={styles.modificarTxt}>{modoModificar ? "Modo Normal" : "Modificar"}</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Calificar App</Text>

          <RatingSummary key={refreshKey} />

          <View style={styles.option}>
            <Text style={styles.optionText}>Danos tu opinión</Text>

            {bloqueado && !modoModificar ? (
              <View>
                <Text style={{ color: "gray", fontWeight: "bold" }}>⛔ Bloqueado</Text>
                <Text style={{ fontSize: 12, color: "#e63946" }}>
                  Podrás calificar en {diasRestantes} {diasRestantes === 1 ? "día" : "días"}
                </Text>
              </View>
            ) : bloqueado && modoModificar ? (
              <TouchableOpacity style={styles.desbloquearBtn} onPress={handleDesbloquear}>
                <Text style={styles.desbloquearTxt}>Desbloquear calificación</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.botonCalificar}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.botonCalificarTexto}>Calificar ⭐</Text>
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
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ width: itemAncho, marginHorizontal: itemMargen }}
                onPress={() => Linking.openURL(item.url)}
              >
                <FontAwesome name={item.icon} size={40} color={item.color} />
                <Text style={{ textAlign: "center", marginTop: 6 }}>{item.nombre}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.sectionTitle}>Acerca de</Text>

          <TouchableOpacity onPress={() => setMostrarAlumnos((p) => !p)} style={styles.verMasBtn}>
            <FontAwesome name={mostrarAlumnos ? "chevron-up" : "chevron-down"} size={18} color="#fff" />
            <Text style={styles.verMasTexto}>{mostrarAlumnos ? "Ocultar información" : "Ver más información"}</Text>
          </TouchableOpacity>

          {mostrarAlumnos && (
            <View style={styles.listaAlumnos}>
              <ScrollView
                style={{ maxHeight: 220 }}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {alumnos.map((nombre, index) => (
                  <View key={index} style={styles.alumnoCard}>
                    <FontAwesome name="user" size={18} color="#144784" style={{ marginRight: 8 }} />
                    <Text style={styles.alumnoTexto}>{nombre}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

        </View>
      </ScrollView>

      <CalificacionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onRatingSuccess={async () => {
          setModalVisible(false);
          const fechaActual = new Date();
          const fechaProxima = new Date();
          fechaProxima.setDate(fechaActual.getDate() + 30);
          await AsyncStorage.setItem("fechaProximaCalificacion", fechaProxima.toISOString());
          setBloqueado(true);
          setCalificado(true);
          const diferencia = Math.ceil((fechaProxima - fechaActual) / (1000 * 60 * 60 * 24));
          setDiasRestantes(diferencia);
          alert("Has calificado exitosamente. Podrás volver a calificar en 30 días.");
          setRefreshKey((prev) => prev + 1);
        }}
      />

      <NavegacionInferior navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  scrollContainer: { flexGrow: 0 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#e3e9f2",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#161515",
    flex: 1,
    textAlign: "center",
  },
  logo: { width: 50, height: 50 },
  content: { paddingHorizontal: 16 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#144784",
    marginTop: 24,
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  optionText: { fontSize: 16, color: "#333" },

  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
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
  sendButtonText: { color: "#fff", fontWeight: "bold" },

  supportText: { color: "#144784", fontWeight: "bold" },

  modificarBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#d62828",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modificarTxt: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  botonCalificar: {
    backgroundColor: "#144784",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  botonCalificarTexto: { color: "#fff", fontWeight: "bold" },

  desbloquearBtn: {
    backgroundColor: "#f4a261",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  desbloquearTxt: { color: "#fff", fontWeight: "bold" },

  listaAlumnos: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    maxHeight: 220,
  },

  alumnoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  alumnoTexto: { color: "#144784", fontWeight: "600" },

  verMasBtn: {
    flexDirection: "row",
    backgroundColor: "#144784",
    paddingVertical: 12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  verMasTexto: { color: "#fff", marginLeft: 8, fontWeight: "bold" },
});
