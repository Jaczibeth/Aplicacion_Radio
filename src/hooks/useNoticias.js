import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://192.168.10.248:8080/api/noticias";

export default function useNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar noticias desde el backend
  const cargarNoticias = async () => {
    try {
      setCargando(true);
      const response = await axios.get(BASE_URL);
      setNoticias(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar noticias:", err);
      setError("No se pudieron cargar las noticias");
    } finally {
      setCargando(false);
    }
  };

  //  Eliminar noticia
  const eliminarNoticia = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setNoticias((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error al eliminar noticia:", err);
    }
  };

  //  Agregar noticia
  const agregarNoticia = async (nuevaNoticia) => {
    try {
      const response = await axios.post(BASE_URL, nuevaNoticia);
      setNoticias((prev) => [response.data, ...prev]);
    } catch (err) {
      console.error("Error al agregar noticia:", err);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  return {
    noticias,
    cargando,
    error,
    eliminarNoticia,
    agregarNoticia,
    recargar: cargarNoticias,
  };
}
