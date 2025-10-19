import { StyleSheet } from "react-native";

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f5f5f5", 
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  contenedorTitulo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tituloApp: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 22,
    marginLeft: 10,
    color: "#144784",
  },
  buscador: {
    borderRadius: 50,
    marginHorizontal: 10,
    marginBottom: 10,
    backfaceVisibility: "hidden",
  },
  contenido: {
    flex: 1,
  },
  tituloSeccion: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    marginTop: 15,
    color: "#144784",
    marginLeft: 15, // Alinear con el resto del contenido
  },
  textoVacio: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    color: "#0a0a0aff",
  },
  tituloImagenCarrusel: {
    position: "absolute",
    bottom: 25,
    left: 15,
    right: 15,
    color: "#fff",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default estilos;
