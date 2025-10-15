import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Pantallas
import PantallaCarga from "../Pages/carga/PantallaCarga";
import PantallaInicio from "../Pages/inicio/PantallaInicio";

const Pila = createNativeStackNavigator();

/**
 * NAVEGADOR PRINCIPAL
 * Maneja la navegación entre pantallas
 */
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
