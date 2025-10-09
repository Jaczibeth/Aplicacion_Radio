import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider, DefaultTheme, DarkTheme } from "react-native-paper";
import Splash from "./src/Pages/Splash/Splash";
import Home from "./src/Pages/Home/Home";
import Configuracion from "./src/Pages/Configuracion/Configuracion";

import Noticia1 from "./src/Pages/Noticias/Noticia1";
import Noticia2 from "./src/Pages/Noticias/Noticia2";
import Noticia3 from "./src/Pages/Noticias/Noticia3";
import Noticia4 from "./src/Pages/Noticias/Noticia4";
import Noticia5 from "./src/Pages/Noticias/Noticia5";
import Noticia6 from "./src/Pages/Noticias/Noticia6";
// Crear el Stack Navigator
const Stack = createNativeStackNavigator();

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);


  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <PaperProvider theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Home">{(props) => <Home {...props} toggleTheme={toggleTheme} />}
          </Stack.Screen>
          <Stack.Screen name="Configuracion" component={Configuracion} />
          <Stack.Screen name="Noticia1" component={Noticia1} />
          <Stack.Screen name="Noticia2" component={Noticia2} />
          <Stack.Screen name="Noticia3" component={Noticia3} />
           <Stack.Screen name="Noticia4" component={Noticia4} />
          <Stack.Screen name="Noticia5" component={Noticia5} />
          <Stack.Screen name="Noticia6" component={Noticia6} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
