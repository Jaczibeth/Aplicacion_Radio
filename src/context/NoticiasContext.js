import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = '192.168.137.244:8080/api/noticias';

export const NoticiasContext = createContext();

export const NoticiasProvider = ({ children }) => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarNoticias = async () => {
    try {
      setCargando(true);
      const response = await axios.get(BASE_URL);
      setNoticias(response.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando noticias');
    } finally {
      setCargando(false);
    }
  };

  const eliminarNoticia = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setNoticias((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error eliminando noticia:', err);
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
      }}
    >
      {children}
    </NoticiasContext.Provider>
  );
};
