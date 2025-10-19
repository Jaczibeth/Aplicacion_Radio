import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { useRoute } from '@react-navigation/native';

export default function NavegacionInferior({ navigation }) {
  const items = [
    // La ruta 'Inicio' puede representar tanto 'Destacadas' como 'Marcadores'
    { icon: "home", label: "Inicio", ruta: "Inicio" },
    { icon: "compass", label: "Todas", ruta: "Descubrir" },
    { icon: "cog", label: "Ajustes", ruta: "Configuracion" },
  ];

  // El hook useRoute() debe llamarse una sola vez en el nivel superior del componente.
  const rutaActual = useRoute();

  return (
    <View style={estilos.barraNavegacion}>
      {items.map((item) => {
        const activo = rutaActual.name === item.ruta;

        return (
          <View key={item.ruta} style={estilos.itemNavegacion}>
            <IconButton
              icon={item.icon}
              size={26}
              iconColor={activo ? "#144784" : "#000000ff"}
              onPress={() => {
                if (item.ruta) {
                  navigation.navigate(item.ruta);
                }
              }}
            />
            <Text
              style={[
                estilos.textoNavegacion,
                { color: activo ? "#144784" : "#000000ff" },
              ]}
            >
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  barraNavegacion: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 80,
    borderTopWidth: 1,
    borderTopColor: "#eee7e7ff",
    backgroundColor: "#fcfafae8",
    paddingBottom: 5,
    position: 'absolute',
    bottom: 0, 
    left: 0,
    right: 0,
  },
  itemNavegacion: {
    flex: 1,
    alignItems: "center",
  },
  textoNavegacion: {
    fontSize: 12,
    marginTop: -6,
  },
});
