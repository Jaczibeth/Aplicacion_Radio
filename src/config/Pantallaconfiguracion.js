import React, { useEffect, useRef, useState } from "react";
import { View, Animated, StyleSheet, ScrollView, Linking, TouchableOpacity, TextInput } from "react-native";
import { Title, IconButton, Switch, Text } from "react-native-paper";  // Usando react-native-paper
import { SafeAreaView } from 'react-native-safe-area-context';  // Importación correcta

export default function PantallaConfiguracion({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;  // Animación de entrada
  const [modoOscuro, setModoOscuro] = useState(false);  // Estado para el modo oscuro
  const [notificaciones, setNotificaciones] = useState(true); // Estado para notificaciones
  const [comentario, setComentario] = useState(""); // Estado para los comentarios
  const [calificacion, setCalificacion] = useState(0); // Estado para la calificación

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Funciones de cambio para los switches
  const toggleModoOscuro = () => setModoOscuro((prev) => !prev);
  const toggleNotificaciones = () => setNotificaciones((prev) => !prev);

  // Función para abrir el correo de soporte
  const handleSupport = () => {
    Linking.openURL("mailto:jaczicruz@gmail.com?subject=Soporte%20y%20Mantenimiento");  // Ajusta tu correo de soporte
  };

  // Función para manejar la calificación
  const handleCalificacion = (rating) => {
    setCalificacion(rating);
  };

  // Función para enviar comentarios
  const handleSendComment = () => {
    if (comentario.trim() === "") {
      alert("Por favor, ingresa un comentario antes de enviarlo.");
    } else {
      // Aquí puedes agregar la lógica para enviar el comentario (por ejemplo, enviarlo a un correo electrónico)
      Linking.openURL(`mailto:jaczicruz@gmail.com?subject=Comentario%20sobre%20la%20App&body=${comentario}`);
      setComentario("");  // Limpiar el campo de comentarios después de enviarlo
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          color={styles.icon.color}  // Color del icono
        />
        <Title style={styles.title}>Configuración</Title>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Sección de notificaciones */}
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>Recibir alertas</Text>
            <Switch
              value={notificaciones}
              onValueChange={toggleNotificaciones}
              thumbColor={notificaciones ? "#144784" : "#B3B3B3"} 
              trackColor={{ false: "#B3B3B3", true: "#144784" }}  
            />
          </View>

          {/* Sección de calificación */}
          <Text style={styles.sectionTitle}>Califica nuestra App</Text>
          <View style={styles.option}>
            
            {/* Botones de calificación */}
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

          {/* Sección de comentarios */}
          <Text style={styles.sectionTitle}>Comentarios sobre la App</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Escribe tu comentario aquí"
            value={comentario}
            onChangeText={setComentario}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity onPress={handleSendComment} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Enviar comentario</Text>
          </TouchableOpacity>

          {/* Sección de Soporte y Mantenimiento */}
          <Text style={styles.sectionTitle}>Soporte y Mantenimiento</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>¿Necesitas ayuda?</Text>
            <TouchableOpacity onPress={handleSupport}>
              <Text style={styles.supportText}>Contáctanos</Text>  
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
    backgroundColor: "#f5f5f5",  // Color de fondo
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,  // Espaciado ajustado
    paddingVertical: 12,  // Espaciado ajustado
    backgroundColor: "#f8f1f1ff",  // Color de fondo del header
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 20,  // Tamaño de texto
    fontWeight: "700",
    color: "#144784",  // Azul formal y profesional
    marginLeft: 8,  // Margen ajustado
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,  // Espaciado ajustado
  },
  sectionTitle: {
    fontSize: 16,  // Tamaño de texto ajustado
    fontWeight: "600",
    color: "#144784",  // Azul formal
    marginTop: 32,  // Espaciado ajustado
    marginBottom: 8,  // Espaciado ajustado
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,  // Espaciado ajustado
    borderBottomWidth: 1,
    borderBottomColor: "#B3B3B3",  // Gris claro para bordes
  },
  optionText: {
    fontSize: 14,  // Tamaño de texto ajustado
    color: "#7aadf8ff",  // Color de texto ajustado
  },
  stars: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    alignContent: "center",
    alignItems: "center",
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
    backgroundColor: "#FF0000",  // Rojo brillante para llamar la atención
    padding: 12,
    marginTop: 16,
    borderRadius: 50,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#050505ff",
    fontSize: 16,
  },
  supportText: {
    fontSize: 14,
    color: "#FF0000",  // Rojo brillante para el enlace de contacto
    textDecorationLine: "underline",  // Hace que el texto parezca un enlace
  },
  icon: {
    color: "#144784",  // Color azul para el icono de flecha
  },
});