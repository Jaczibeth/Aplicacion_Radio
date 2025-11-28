import React, { useState, useRef, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const CalificacionModal = ({ visible, onClose, onRatingSuccess }) => {
  const [rating, setRating] = useState(0);
  const ratingRef = useRef(0);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [promedio, setPromedio] = useState(0);
  const [total, setTotal] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

 
  useEffect(() => {
    if (visible) {
      setRating(0);
      ratingRef.current = 0;
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      fetchResumen(); 
    }
  }, [visible]);

  const fetchResumen = async () => {
    try {
      const response = await axios.get("http://192.168.1.66:8080/api/calificacion/resumen");
      setPromedio(response.data.promedio);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error al obtener resumen:", error);
    }
  };

  const handleStarPress = (star) => {
    setRating(star);
    ratingRef.current = star;
  };

  const handleSubmit = async () => {
    const currentRating = ratingRef.current;
    if (currentRating > 0 && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await axios.post("http://192.168.1.66:8080/api/calificacion", {
          valor: currentRating, 
        });
        onRatingSuccess();
        fetchResumen();
      } catch (error) {
        console.error("Error al enviar la calificación:", error);
        alert("Hubo un error al enviar tu calificación. Inténtalo de nuevo.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          
          
          <Text style={styles.score}>{promedio.toFixed(1)}</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= Math.round(promedio) ? "star" : "star-outline"}
                size={24}
                color="#FFB400"
              />
            ))}
            <Text style={styles.totalText}>{total} Ratings</Text>
          </View>

          
          <Ionicons name="happy-outline" size={60} color="#FFB547" style={{ marginTop: 10 }} />
          <Text style={styles.title}>¿Qué te ha parecido la app?</Text>
          <Text style={styles.text}>Tu opinión nos ayuda a mejorar la experiencia.</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= rating ? "#FFB400" : "#D3D3D3"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, { opacity: rating > 0 && !isSubmitting ? 1 : 0.5 }]}
            onPress={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? "Enviando..." : "Enviar calificación"}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default CalificacionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  score: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  totalText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
    color: "#333",
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    color: "#555",
    marginVertical: 15,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 5,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FFB547",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
