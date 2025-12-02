import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "http://192.168.108.46:8080/api/noticias";



export const NoticiasContext = createContext();

export const NoticiasProvider = ({ children }) => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);


  const cargarNoticias = async () => {
    try {
      setCargando(true);
      const response = await axios.get(BASE_URL);
      let noticiasData = response.data;

      // Cargar conteos guardados localmente
      const storedCounts = await AsyncStorage.getItem("comentarios_updates");
      if (storedCounts) {
        const parsedCounts = JSON.parse(storedCounts);
        noticiasData = noticiasData.map(n => {
          if (parsedCounts[n.id] !== undefined) {
            return { ...n, cantidadComentarios: parsedCounts[n.id] };
          }
          return n;
        });
      }

      setNoticias(noticiasData);
      setError(null);
    } catch (err) {
      console.error(" Error cargando noticias:", err.message);
      setError(err.message || "Error cargando noticias");
    } finally {
      setCargando(false);
    }
  };

  const actualizarComentariosNoticia = async (id, cantidad) => {
    // Actualizar estado local
    setNoticias(prev => prev.map(n => n.id === id ? { ...n, cantidadComentarios: cantidad } : n));

    // Guardar en AsyncStorage
    try {
      const storedCounts = await AsyncStorage.getItem("comentarios_updates");
      const parsedCounts = storedCounts ? JSON.parse(storedCounts) : {};
      parsedCounts[id] = cantidad;
      await AsyncStorage.setItem("comentarios_updates", JSON.stringify(parsedCounts));
    } catch (err) {
      console.error("Error guardando conteo comentarios:", err);
    }
  };

  const eliminarNoticia = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setNoticias((prev) => prev.filter((n) => n.id !== id));
      console.log(` Noticia ${id} eliminada`);
    } catch (err) {
      console.error(" Error eliminando noticia:", err.message);
    }
  };


  useEffect(() => {

    cargarNoticias();
  }, []);

  return (
    <NoticiasContext.Provider
      value={{
        noticias,
        cargando,
        error,
        cargarNoticias,
        eliminarNoticia,
        actualizarComentariosNoticia,
      }}
    >
      {children}
    </NoticiasContext.Provider>
  );
};
