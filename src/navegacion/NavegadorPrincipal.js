import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Pantallas
import PantallaCarga from "../Pages/carga/PantallaCarga";

const Pila = createNativeStackNavigator();

/**
 * Maneja la navegación entre pantallas
 */
export default function NavegadorPrincipal() {
  return (
    <Pila.Navigator
      initialRouteName="Carga"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}>
      <Pila.Screen name="Carga" component={PantallaCarga} />
    </Pila.Navigator>
  );
}