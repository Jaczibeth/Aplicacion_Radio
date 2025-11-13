import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

export const useUbicacion = () => {
  const [ubicacion, setUbicacion] = useState(null);
  const [error, setError] = useState(null);
  const [permisoConcedido, setPermisoConcedido] = useState(false);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);

  const solicitarPermisos = async () => {
    try {
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === "granted") {
        setPermisoConcedido(true);
        // Mostrar notificación por 5 segundos
        setMostrarNotificacion(true);
        setTimeout(() => {
          setMostrarNotificacion(false);
        }, 5000);
        
        // Obtener ubicación actual
        const ubicacionActual = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUbicacion(ubicacionActual);
      } else {
        // Mostrar diálogo para abrir configuración
        Alert.alert(
          "Permiso denegado",
          "Es necesario que actives los permisos de ubicación en la configuración del teléfono.",
          [
            {
              text: "Cancelar",
              onPress: () => console.log("Cancelado"),
              style: "cancel",
            },
            {
              text: "Ir a Configuración",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
        setPermisoConcedido(false);
        setError("Permisos de ubicación denegados");
      }
    } catch (err) {
      console.error("Error al solicitar permisos:", err);
      setError(err.message);
    }
  };

  return {
    ubicacion,
    error,
    permisoConcedido,
    mostrarNotificacion,
    solicitarPermisos,
    setMostrarNotificacion,
  };
};
