import { StyleSheet, Platform } from "react-native";
import { colores, tamanosTexto, espaciado, bordesRedondeados } from "../../configuracion/colores";
import { ALTURA_NAVBAR } from "../../configuracion/constantes";

export const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondoGrisClaro,
  },
  
  // ENCABEZADO
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: espaciado.mediano,
    paddingVertical: espaciado.normal,
    backgroundColor: colores.fondoBlanco,
    borderBottomWidth: 1,
    borderBottomColor: colores.bordeClaro,
  },
  contenedorTitulo: {
    flexDirection: "row",
    alignItems: "center",
  },
  tituloApp: {
    fontSize: tamanosTexto.grande,
    fontWeight: "700",
    color: colores.textoOscuro,
    marginLeft: espaciado.normal,
    letterSpacing: 0.5,
  },
  
  // BUSCADOR
  buscador: {
    margin: espaciado.mediano,
    borderRadius: bordesRedondeados.mediano,
    backgroundColor: colores.fondoBlanco,
  },
  
  // CONTENIDO
  contenido: {
    flex: 1,
    marginBottom: ALTURA_NAVBAR,
  },
  tituloSeccion: {
    fontSize: tamanosTexto.grande,
    fontWeight: "700",
    color: colores.textoOscuro,
    marginTop: espaciado.grande,
    marginBottom: espaciado.normal,
    marginHorizontal: espaciado.mediano,
  },
  textoVacio: {
    textAlign: "center",
    fontSize: tamanosTexto.mediano,
    color: colores.textoGris,
    marginTop: espaciado.enorme,
    paddingHorizontal: espaciado.mediano,
  },
  
  // BARRA DE NAVEGACIÓN INFERIOR
  barraNavegacion: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: ALTURA_NAVBAR,
    backgroundColor: colores.fondoBlanco,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colores.bordeClaro,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});