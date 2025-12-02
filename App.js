                                                                                                                                                                                                                                                   import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NoticiasProvider } from "./src/context/NoticiasContext";
import { AudioProvider } from "./src/context/AudioContext";
import NavegadorPrincipal from "./src/navegacion/NavegadorPrincipal";
import { temaPrincipal } from "./src/configuracion/colores";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}