import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

// Navegación
import NavegadorPrincipal from "./src/navegacion/NavegadorPrincipal";

// Configuración
import { temaPrincipal } from "./src/configuracion/colores";

/**
 * APLICACIÓN PRINCIPAL
 * La Tlaxiaqueña - App de Noticias
 */
export default function App() {
  return (
    <PaperProvider theme={temaPrincipal}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <NavegadorPrincipal />
      </NavigationContainer>
    </PaperProvider>
  );
}
