import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";

import PantallaCarga from "../Pages/carga/PantallaCarga";
import PantallaInicio from "../Pages/inicio/PantallaInicio";
import Pantallaconfiguracion from "../configuracion/Pantallaconfiguracion";
import NavegacionInferior from "../Componentes/NavegacionInferior";
import DescubrirScreen from "../Pages/Descubrir/DescubrirScreen";
import DetalleNoticiaScreen from "../Pages/inicio/DetalleNoticiaScreen";
import AudioPlayerScreen from "../Pages/Descubrir/AudioPlayerScreen";
const Pila = createNativeStackNavigator();

export default function NavegadorPrincipal() {

  const PantallasConNavegacion = ({ Component, ...props }) => (
    <View style={{ flex: 1 }}>
      <Component {...props} />
      <NavegacionInferior navigation={props.navigation} />
    </View>
  );

  return (
    <Pila.Navigator
      initialRouteName="Carga"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Pila.Screen name="Carga" component={PantallaCarga} />
      <Pila.Screen name="Inicio">
        {(props) => <PantallasConNavegacion Component={PantallaInicio} {...props} />}
      </Pila.Screen>
      <Pila.Screen name="Descubrir">
        {(props) => <PantallasConNavegacion Component={DescubrirScreen} {...props} />}
      </Pila.Screen>
      <Pila.Screen name="DetalleNoticia" component={DetalleNoticiaScreen} />
      <Pila.Screen name="AudioPlayer" component={AudioPlayerScreen} />
      <Pila.Screen name="Configuracion" component={Pantallaconfiguracion} />
    </Pila.Navigator>
  );
}
