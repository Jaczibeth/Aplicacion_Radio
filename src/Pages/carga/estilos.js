import { StyleSheet } from "react-native";

export const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#e7edf5ff", 
    justifyContent: "center",
    alignItems: "center",
  },
  logoContenedor: {
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  logo: {
    width: 600, // Logo más grande
    height: 600,
    resizeMode: "contain",
  },
  contenedorPuntos: {
    flexDirection: "row",
    gap: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  punto: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#FF0000", // Rojo brillante de tu paleta
    opacity: 0.3,
  },
});
