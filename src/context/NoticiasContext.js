import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "http://192.168.10.248:8080/api/noticias";

export const NoticiasContext = createContext();

export const NoticiasProvider = ({ children }) => {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ordenPersonalizado, setOrdenPersonalizado] = useState({});

  const cargarNoticias = async () => {
    try {
      setCargando(true);
      const response = await axios.get(BASE_URL);
      let noticiasData = response.data;

      // Cargar orden personalizado desde AsyncStorage
      let orden = {};
      try {
        const ordenJSON = await AsyncStorage.getItem("orden_noticias");
        if (ordenJSON) {
          orden = JSON.parse(ordenJSON);
        }
      } catch (e) {
        console.error("Error leyendo orden:", e);
      }

      // Agregar noticias nuevas que no estén en el orden
      const maxOrden = Object.keys(orden).length > 0 
        ? Math.max(...Object.values(orden)) 
        : -1;

      let hayNuevas = false;
      noticiasData.forEach((noticia, index) => {
        if (!orden.hasOwnProperty(noticia.id)) {
          orden[noticia.id] = maxOrden + 1 + index;
          hayNuevas = true;
        }
      });

      if (hayNuevas) {
        await AsyncStorage.setItem("orden_noticias", JSON.stringify(orden));
      }

      setOrdenPersonalizado(orden);

      // Ordenar según preferencia guardada
      noticiasData.sort((a, b) => {
        const ordenA = orden[a.id] ?? Infinity;
        const ordenB = orden[b.id] ?? Infinity;
        return ordenA - ordenB;
      });

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

  // Mover noticia al final
  const moverNoticiaAlFinal = async (id) => {
    try {
      // Obtener orden actual
      let orden = { ...ordenPersonalizado };
      const valores = Object.values(orden);
      const maxOrden = valores.length > 0 ? Math.max(...valores) : 0;

      // Asignar nuevo orden
      orden[id] = maxOrden + 1;
      setOrdenPersonalizado(orden);
      await AsyncStorage.setItem("orden_noticias", JSON.stringify(orden));

      // Reordenar noticias en memoria
      setNoticias((prevNoticias) => {
        const noticiasOrdenadas = [...prevNoticias];
        noticiasOrdenadas.sort((a, b) => {
          const ordenA = orden[a.id] ?? Infinity;
          const ordenB = orden[b.id] ?? Infinity;
          return ordenA - ordenB;
        });
        return noticiasOrdenadas;
      });

      console.log(`Noticia ${id} movida al final`);
    } catch (err) {
      console.error("Error moviendo noticia al final:", err);
      setError("No se pudo mover la noticia");
    }
  };

  // Restaurar orden original
  const restaurarOrdenOriginal = async () => {
    try {
      await AsyncStorage.removeItem("orden_noticias");
      setOrdenPersonalizado({});
      await cargarNoticias();
      console.log("Orden original restaurado");
    } catch (err) {
      console.error("Error restaurando orden:", err);
      setError("No se pudo restaurar el orden");
    }
  };

  const actualizarComentariosNoticia = async (id, cantidad) => {
    setNoticias(prev => prev.map(n => n.id === id ? { ...n, cantidadComentarios: cantidad } : n));

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
      
      // Actualizar estado local
      setNoticias((prev) => prev.filter((n) => n.id !== id));
      
      // Limpiar orden personalizado
      try {
        const orden = { ...ordenPersonalizado };
        if (orden.hasOwnProperty(id)) {
          delete orden[id];
          await AsyncStorage.setItem("orden_noticias", JSON.stringify(orden));
          setOrdenPersonalizado(orden);
        }
      } catch (storageErr) {
        console.error("Error guardando orden después de eliminar:", storageErr);
      }

      console.log(` Noticia ${id} eliminada`);
    } catch (err) {
      console.error(" Error eliminando noticia:", err.message);
      setError(err.message || "Error eliminando noticia");
    }
  };

  // Función para agregar noticia (si la necesitas)
  const agregarNoticia = async (payload) => {
    try {
      await axios.post(BASE_URL, payload);
      await cargarNoticias();
    } catch (err) {
      console.error("Error agregando noticia:", err);
      setError(err?.message || "Error agregando noticia");
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
        ordenPersonalizado,
        cargarNoticias,
        eliminarNoticia,
        actualizarComentariosNoticia,
        agregarNoticia,
        moverNoticiaAlFinal,
        restaurarOrdenOriginal,
      }}
    >
      {children}
    </NoticiasContext.Provider>
  );
};