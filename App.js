import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { NoticiasProvider } from "./src/context/NoticiasContext";

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
      <NoticiasProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <NavegadorPrincipal />
        </NavigationContainer>
      </NoticiasProvider>
    </PaperProvider>
  );
}

