import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const RatingSummary = () => {
  const [promedio, setPromedio] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await axios.get("http://192.168.1.5:8080/api/calificacion/resumen");
        setPromedio(response.data.promedio);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Error al obtener resumen:", error);
      }
    };
    fetchResumen();
  }, []);

  return (
    <View style={styles.container}>
     
      <Text style={styles.score}>{promedio.toFixed(1)}</Text>

     
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= Math.round(promedio) ? "star" : "star-outline"}
            size={28}
            color="#FFB400"
          />
        ))}
        <Text style={styles.totalText}>{total} Ratings</Text>
      </View>
    </View>
  );
};

export default RatingSummary;

const styles = StyleSheet.create({
  container: { alignItems: "center",marginVertical: 20,},
  score: {fontSize: 48,fontWeight: "bold",color: "#000",},
  starsRow: {flexDirection: "row",alignItems: "center",marginTop: 8,},
  totalText: {marginLeft: 10,fontSize: 16,color: "#555", },});
