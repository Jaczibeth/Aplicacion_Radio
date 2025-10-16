import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const estaciones = [
  { id: 1, nombre: "Latina Bandit" },
  { id: 2, nombre: "80s ALIVE" },
  { id: 3, nombre: "Radio Pig" },
  { id: 4, nombre: "Smooth Jazz" },
  { id: 5, nombre: "Chillout Vibes" },
  { id: 6, nombre: "Classic Rock" },
  { id: 7, nombre: "2 Love Radio" },
  { id: 8, nombre: "Dance Machine" },
  { id: 9, nombre: "Top 90’s" },
  { id: 10, nombre: "Beam FM" },
  { id: 11, nombre: "Soft Rock" },
  { id: 12, nombre: "101 Smooth" },
  { id: 13, nombre: "Classical Mix" },
  { id: 14, nombre: "80s Pop" },
  { id: 15, nombre: "Hip Hop" },
];

export default function DescubrirScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {estaciones.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>📻</Text>
            </View>
            <Text style={styles.cardText}>{item.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "30%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconPlaceholder: {
    backgroundColor: "#e0e0e0",
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  iconText: {
    fontSize: 22,
  },
  cardText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 12,
  },
});
