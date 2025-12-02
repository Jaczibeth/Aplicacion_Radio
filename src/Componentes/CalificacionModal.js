import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CalificacionModal = ({ visible, onClose }) => {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (visible) checkLastRating();
  }, [visible]);


  const checkLastRating = async () => {
    const lastDate = await AsyncStorage.getItem("lastRatingDate");
    if (lastDate) {
      const diffDays = Math.floor((Date.now() - parseInt(lastDate)) / (1000 * 60 * 60 * 24));
      if (diffDays < 30) {
        setIsBlocked(true);
        setDaysLeft(30 - diffDays);
      } else {
        setIsBlocked(false);
      }

  const fetchResumen = async () => {
    try {
      const response = await axios.get("http://192.168.1.66:8080/api/calificacion/resumen");
      setPromedio(response.data.promedio);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error al obtener resumen:", error);

    }
  };

  const handleSubmit = async () => {
    if (rating > 0 && !isSubmitting && !isBlocked) {
      setIsSubmitting(true);
      try {
        await axios.post("http://192.168.1.5:8080/api/calificacion", { valor: rating });
        await AsyncStorage.setItem("lastRatingDate", Date.now().toString());
        setIsBlocked(true);
        setDaysLeft(30);
        onClose();
      } catch (error) {
        alert("Error al enviar la calificación");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Botón para cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>

          <Text style={styles.title}>¿Qué te ha parecido la app?</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} disabled={isBlocked}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= rating ? "#FFB400" : "#D3D3D3"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {isBlocked && (
            <Text style={styles.infoText}>
              Podrás volver a calificar en {daysLeft} días.
            </Text>
          )}

          <TouchableOpacity
            style={[styles.button, { opacity: rating > 0 && !isSubmitting && !isBlocked ? 1 : 0.5 }]}
            onPress={handleSubmit}
            disabled={rating === 0 || isSubmitting || isBlocked}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Enviando..." : "Enviar calificación"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
    position: "relative"
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 20
  },
  button: {
    backgroundColor: "#FFB547",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  infoText: {
    marginBottom: 10,
    fontSize: 14,
    color: "#555"
  }
});

export default CalificacionModal;
