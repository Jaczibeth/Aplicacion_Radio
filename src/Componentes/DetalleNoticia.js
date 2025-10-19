import React from "react";
import { View,Text,  ScrollView,Image,StyleSheet, Modal,  TouchableOpacity,} from "react-native";
import { IconButton } from "react-native-paper";
import { colores, espaciado, tamanosTexto, bordesRedondeados,} from "../configuracion/colores";

export default function DetalleNoticia({ noticia, visible, onCerrar }) {
  if (!noticia) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={estilos.overlay}>
        <View style={estilos.modal}>
          <View style={estilos.header}>
            <Text style={estilos.headerTitulo}>Detalle de Noticia</Text>
            <IconButton   icon="close"    size={26} color="#fff" onPress={onCerrar} style={estilos.botonCerrar}  />  </View>
          <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false} >
            <Image source={{ uri: noticia.imagen }} style={estilos.imagen} />
            <View style={estilos.seccion}>
              {noticia.categoria && (
                <View style={estilos.etiquetaCategoria}>
                  <Text style={estilos.textoCategoria}>
                    {noticia.categoria}
                  </Text>
                </View>
              )}

              <Text style={estilos.titulo}>{noticia.titulo}</Text>
              <Text style={estilos.fuenteTiempo}>
                {noticia.fuente} • {noticia.tiempo}
              </Text>
            </View>

            <View style={estilos.seccion}>
              <Text style={estilos.descripcion}> {noticia.descripcion || "Sin descripción disponible."}
              </Text>
            </View>

            {noticia["descripcion Completa"] && (
              <View style={estilos.seccion}>
                <Text style={estilos.subtitulo}> Detalles</Text>
                <Text style={estilos.detalle}> {noticia["descripcion Completa"]}
                </Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={estilos.botonCerrarAbajo} onPress={onCerrar}>
            <Text style={estilos.textoBoton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    height: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colores.principal || "#2a7de1",
    paddingHorizontal: espaciado.normal,
    paddingVertical: espaciado.pequeno,
  },
  headerTitulo: {
    fontSize: tamanosTexto.mediano,
    fontWeight: "700",
    color: "#fff",
  },
  botonCerrar: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
  },
  scroll: {
    flex: 1,
    padding: espaciado.normal,
  },
  imagen: {
    width: "100%",
    height: 220,
    borderRadius: bordesRedondeados.mediano,
    marginBottom: espaciado.mediano,
  },
  seccion: {
    marginBottom: espaciado.mediano,
    backgroundColor: "#fafafa",
    borderRadius: bordesRedondeados.pequeno,
    padding: espaciado.normal,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  etiquetaCategoria: {
    backgroundColor: colores.principal || "#2a7de1",
    alignSelf: "flex-start",
    paddingHorizontal: espaciado.pequeno,
    paddingVertical: espaciado.minimo,
    borderRadius: 20,
    marginBottom: espaciado.minimo,
  },
  textoCategoria: {
    fontSize: tamanosTexto.pequeno,
    color: "#fff",
    fontWeight: "600",
  },
  titulo: {
    fontSize: tamanosTexto.grande,
    fontWeight: "700",
    color: colores.textoOscuro || "#222",
    marginBottom: espaciado.minimo,
  },
  fuenteTiempo: {
    color: colores.textoGris || "#666",
    fontSize: tamanosTexto.pequeno,
  },
  descripcion: {
    fontSize: tamanosTexto.normal,
    color: "#333",
    lineHeight: 22,
    textAlign: "justify",
  },
  subtitulo: {
    fontSize: tamanosTexto.mediano,
    fontWeight: "600",
    color: colores.textoOscuro || "#222",
    marginBottom: espaciado.pequeno,
  },
  detalle: {
    fontSize: tamanosTexto.normal,
    color: "#444",
    lineHeight: 24,
    textAlign: "justify",
  },
  botonCerrarAbajo: {
    backgroundColor: colores.principal || "#2a7de1",
    paddingVertical: 12,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "600",
    fontSize: tamanosTexto.normal,
  },
});
