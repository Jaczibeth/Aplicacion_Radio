import React, { useEffect, useRef, useState } from "react";
import { View, Animated, StyleSheet, ScrollView, Linking, TouchableOpacity, TextInput } from "react-native";
import { Title, IconButton, Switch, Text } from "react-native-paper";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PantallaConfiguracion({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modoOscuro, setModoOscuro] = useState(false);
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  const toggleModoOscuro = () => setModoOscuro((prev) => !prev);
  const handleSupport = () => {
    Linking.openURL("mailto:jaczicruz@gmail.com?subject=Soporte%20y%20Mantenimiento");
  };

  const handleCalificacion = (rating) => {
    setCalificacion(rating);
  };
  const handleSendComment = () => {
    if (comentario.trim() === "") {
      alert("Por favor, ingresa un comentario antes de enviarlo.");
    } else {
      Linking.openURL(`mailto:jaczicruz@gmail.com?subject=Comentario%20sobre%20la%20App&body=${comentario}`);
      setComentario("");  
    }
  };
  return (
    <SafeAreaView style={[styles.container, modoOscuro && styles.darkContainer]}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          color={styles.icon.color} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>Modo Oscuro</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>Activar modo oscuro</Text>
            <Switch value={modoOscuro} onValueChange={toggleModoOscuro} />
          </View>
          <Text style={styles.sectionTitle}>Califica nuestra App</Text>
          <View style={styles.option}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <IconButton
                  key={rating}
                  icon={rating <= calificacion ? "star" : "star-outline"}
                  size={24}
                  color={modoOscuro ? "#9d3005ff" : "#144784"}  
                  onPress={() => handleCalificacion(rating)} />
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
            numberOfLines={4}  />
          <TouchableOpacity onPress={handleSendComment} style={[styles.sendButton, modoOscuro && styles.darkButton]}>
            <Text style={styles.sendButtonText}>Enviar comentario</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>Soporte y Mantenimiento</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>¿Necesitas ayuda?</Text>
            <TouchableOpacity onPress={handleSupport}>
              <Text style={[styles.supportText, modoOscuro && styles.darkSupportText]}>Contáctanos</Text>  
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3ededff",  
  },
  darkContainer: {
    backgroundColor: "#c6a8a8ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fbf9f9ff",  
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#144784",
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
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
  optionText: {
    fontSize: 14,
    color: "#7aadf8ff",
  },
  stars: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    width: "100%",
  },
  commentInput: {
    height: 100,
    borderColor: "#B3B3B3",
    borderWidth: 1,
    padding: 8,
    marginTop: 8,
    borderRadius: 8,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "#a8a8a5ff",
    padding: 12,
    marginTop: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  darkButton: {
    backgroundColor: "#444444",  // Botón oscuro
  },
  sendButtonText: {
    color: "#080707ff",
    fontSize: 16,
  },
  supportText: {
    fontSize: 14,
    color: "#FF0000",
    textDecorationLine: "underline",
  },
  darkSupportText: {
    color: "#FFD700",  // Texto de soporte dorado en modo oscuro
  },
  icon: {
    color: "#144784",
  },
});
