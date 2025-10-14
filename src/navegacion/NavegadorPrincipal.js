import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
<<<<<<< HEAD

// Pantallas
import PantallaCarga from "../Pages/carga/PantallaCarga";
import PantallaInicio from "../Pages/inicio/PantallaInicio";

const Pila = createNativeStackNavigator();

/**
 * NAVEGADOR PRINCIPAL
 * Maneja la navegación entre pantallas
 */
=======
import { temaPrincipal } from "./src/configuracion/colores";
// Pantallas
import PantallaCarga from "../pantallas/carga/PantallaCarga";
import PantallaInicio from "../pantallas/inicio/PantallaInicio";

const Pila = createNativeStackNavigator();

>>>>>>> 8271e3094fb30905c56ed696bfaeb7daf644f112
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
<<<<<<< HEAD



=======
>>>>>>> 8271e3094fb30905c56ed696bfaeb7daf644f112
