import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PESTANAS } from "../configuracion/constantes"
export default function BarraPestanas({ pestanaActiva, alCambiarPestana }) {
  return (
    <View style={styles.contenedor}>
      {Object.values(PESTANAS).map((pestana) => {
        const activo = pestana === pestanaActiva;
        return (
          <TouchableOpacity
            key={pestana}
            style={[styles.pestana, activo && styles.pestanaActiva]}
            onPress={() => alCambiarPestana(pestana)}  
          >
            <Text style={[styles.texto, activo && styles.textoActivo]}>
              {pestana.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  pestana: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  pestanaActiva: {
    borderBottomColor: "#144784",  
  },
  texto: {
    fontSize: 16,
    color: "#777",
    fontWeight: "600",
  },
  textoActivo: {
    color: "#144784", 
  },
});
