import { useEffect, useState } from "react";
import {getNoticias,eliminarNoticiaAPI,agregarNoticiaAPI,} from "../Data/Api";




export default function useNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar noticias al inicio
  const cargarNoticias = async () => {
    try {
      setCargando(true);
      const data = await getNoticias();
      const noticiasConTruncamiento = data.map(noticia => ({
        ...noticia,
        titulo: truncarCiudadDeMexico(noticia.titulo),
        descripcion: truncarCiudadDeMexico(noticia.descripcion),
        descripcionCompleta: truncarCiudadDeMexico(noticia.descripcionCompleta),
        fuente: truncarCiudadDeMexico(noticia.fuente),
      }));
      setNoticias(noticiasConTruncamiento);
    } catch (err) {
      setError("No se pudieron cargar las noticias");
    } finally {
      setCargando(false);
    }
  };

  // Eliminar noticia
  const eliminarNoticia = async (id) => {
    try {
      const ok = await eliminarNoticiaAPI(id);
      if (ok) {
        setNoticias((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.log("Error al eliminar noticia:", err);
    }
  };

  // Agregar noticia
  const agregarNoticia = async (noticia) => {
    try {
      const nueva = await agregarNoticiaAPI(noticia);
      if (nueva) {
        setNoticias((prev) => [nueva, ...prev]);
      }
    } catch (err) {
      console.log("Error al agregar:", err);
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
