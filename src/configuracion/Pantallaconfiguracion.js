import React, { useEffect, useRef, useState } from "react";
import { View,  Animated,  StyleSheet,ScrollView, Linking,  TouchableOpacity,  TextInput,  Text,} from "react-native";
import { IconButton } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PantallaConfiguracion({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);

  // Nombre de red social visible al presionar un ícono
  const [redVisible, setRedVisible] = useState(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

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
    {nombre: "Facebook",url: "https://www.facebook.com/share/1gNuX9RpDQ/",icon: "facebook", },
    { nombre: "Instagram", url: "https://www.instagram.com/ntelreloj?igsh=MXZhcmQ1czZsdTVkeQ==", icon: "instagram",},
    { nombre: "X", url: "https://x.com/LaTlaxiaquenaOn?t=jGFVMeHrWWSEZTei-chq1w&s=09", icon: "twitter", },
    {nombre: "YouTube",url: "https://youtube.com/@noticieroselrelojdetlaxiaco?si=8e8oi5BFxuZTvMjA",icon: "youtube-play", },
    { nombre: "Ubicación", url: "https://maps.app.goo.gl/7pduto4TCMH5xGbF9", icon: "map-marker",},
  ];

  const itemAncho = 60; 
  const itemMargen = 10;

  const renderItemCarrusel = ({ item, index }) => {
    const inputRange = [
      (index - 1) * (itemAncho + itemMargen * 2),
      index * (itemAncho + itemMargen * 2),
      (index + 1) * (itemAncho + itemMargen * 2),
    ];

    const scaleScroll = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9], 
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => Linking.openURL(item.url)}
        onPressIn={() => setRedVisible(item.nombre)}  
        onPressOut={() => setRedVisible(null)}        
        style={{
          width: itemAncho,
          height: itemAncho,
          marginHorizontal: itemMargen,
          justifyContent: "center",
          alignItems: "center",
        }}   >
        <Animated.View
          style={{
            transform: [{ scale: scaleScroll }],
            backgroundColor: "#ffffff1e",
            width: itemAncho,
            height: itemAncho,
            borderRadius: itemAncho / 1,
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#efededff",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 4,
            elevation: 5,
          }}>
          <FontAwesome name={item.icon} size={28} color="#144784" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          color={styles.icon.color}
        />
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>Califica nuestra App</Text>
          <View style={styles.option}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <IconButton
                  key={rating}
                  icon={rating <= calificacion ? "star" : "star-outline"}
                  size={24}
                  color="#144784"
                  onPress={() => handleCalificacion(rating)}
                />
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Comentarios sobre la App</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Escribe tu comentario aquí ....."
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
            data={redesSociales}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.nombre}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={itemAncho + itemMargen * 2}
            contentContainerStyle={{ paddingHorizontal: itemMargen }}
            renderItem={renderItemCarrusel}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: true,
              }
            )}
            scrollEventThrottle={16}
          />

          {/* Mostrar nombre solo si hay uno visible */}
          {redVisible && (
            <View style={styles.nombreRedContainer}>
              <Text style={styles.nombreRedText}>{redVisible}</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3eded" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fbf9f9",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "700",
    color: "#000000ff",
    marginLeft: 8,
    alignSelf: "center",
  },
  content: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#144784",
    marginTop: 32,
    marginBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#B3B3B3",
  },
  optionText: { fontSize: 14, color: "#7aadf8" },
  stars: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    width: "100%",
  },
  commentInput: {
    height: 100,
    borderColor: "#9c9797ff",
    borderWidth: 1,
    padding: 8,
    marginTop: 8,
    borderRadius: 8,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "#a8a8a5",
    padding: 12,
    marginTop: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  sendButtonText: { color: "#121111ff", fontSize: 16 },
  supportText: {
    fontSize: 14,
    color: "#FF0000",
    textDecorationLine: "underline",
  },
  icon: { color: "#144784" },
  nombreRedContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  nombreRedText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#144784",
  },
});