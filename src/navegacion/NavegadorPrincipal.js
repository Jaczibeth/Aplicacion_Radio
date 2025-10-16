import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Pantallas principales
import PantallaCarga from "../Pages/carga/PantallaCarga";
import PantallaInicio from "../Pages/inicio/PantallaInicio";
import Pantallaconfiguracion from "../config/Pantallaconfiguracion";

// Otras pantallas
import DescubrirScreen from "../Pages/Descubrir/DescubrirScreen";

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

      <Pila.Screen name="Descubrir" component={DescubrirScreen} />
      <Pila.Screen name="Configuracion" component={Pantallaconfiguracion} />
    </Pila.Navigator>
  );
}
