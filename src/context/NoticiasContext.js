
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


const BASE_URL = "http://192.168.40.80:8080/api/noticias";

export const NoticiasContext = createContext();

export const NoticiasProvider = ({ children }) => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  //  Cargar noticias desde el backend
  const cargarNoticias = async () => {
    try {
      setCargando(true);
      const response = await axios.get(BASE_URL);

      setNoticias(response.data);
      setError(null);
    } catch (err) {
      console.error(" Error cargando noticias:", err.message);
      setError(err.message || "Error cargando noticias");
    } finally {
      setCargando(false);
    }
  };

  //  Eliminar noticia por ID
  const eliminarNoticia = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setNoticias((prev) => prev.filter((n) => n.id !== id));
      console.log(` Noticia ${id} eliminada`);
    } catch (err) {
      console.error(" Error eliminando noticia:", err.message);
    }
  };

  // Cargar noticias al iniciar
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
      }}
    >
      {children}
    </NoticiasContext.Provider>
  );
};
