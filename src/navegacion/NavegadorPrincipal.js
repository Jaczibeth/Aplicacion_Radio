import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { temaPrincipal } from "./src/configuracion/colores";
// Pantallas
import PantallaCarga from "../pantallas/carga/PantallaCarga";
import PantallaInicio from "../pantallas/inicio/PantallaInicio";

const Pila = createNativeStackNavigator();

export default function NavegadorPrincipal() {
  return (
    <Pila.Navigator
      initialRouteName="Carga"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Pila.Screen name="Carga" component={PantallaCarga} />
      <Pila.Screen name="Inicio" component={PantallaInicio} />
    </Pila.Navigator>
  );
}
