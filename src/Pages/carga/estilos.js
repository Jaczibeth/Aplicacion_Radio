import { StyleSheet } from "react-native";
import { colores, tamanosTexto, espaciado, bordesRedondeados } from "../../configuracion/colores";

export const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondoBlanco,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: espaciado.enorme,
  },
  contenedorLogo: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
  nombreApp: {
    fontSize: tamanosTexto.tituloGrande,
    fontWeight: "800",
    color: colores.rojoPrimario,
    marginTop: espaciado.grande,
    letterSpacing: 1.5,
  },
  subtitulo: {
    fontSize: tamanosTexto.mediano,
    color: colores.textoGris,
    marginTop: espaciado.pequeno,
  },
  contenedorBarra: {
    width: "100%",
    height: 8,
    backgroundColor: colores.bordeClaro,
    borderRadius: bordesRedondeados.pequeno,
    overflow: "hidden",
    marginTop: espaciado.enorme,
  },
  barraCarga: {
    height: "100%",
    backgroundColor: colores.principal,
    borderRadius: bordesRedondeados.pequeno,
  },
});
