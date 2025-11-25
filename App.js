
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { NoticiasProvider } from "./src/context/NoticiasContext";
import { AudioProvider } from "./src/context/AudioContext"; // <-- Importa el contexto global de audio

// Navegación
import NavegadorPrincipal from "./src/navegacion/NavegadorPrincipal";

// Configuración
import { temaPrincipal } from "./src/configuracion/colores";

export default function App() {
  return (
    <PaperProvider theme={temaPrincipal}>
      <NoticiasProvider>
        <AudioProvider> 
          <NavigationContainer>
            <StatusBar style="dark" />
            <NavegadorPrincipal />
          </NavigationContainer>
        </AudioProvider>
      </NoticiasProvider>
    </PaperProvider>
  );
}
