import axios from "axios";
import { Platform } from "react-native";


const BASE_URL = Platform.select({
  ios: "http://localhost:8080/api",
  android: "http://192.168.0.105:8080/api",
  default: "http://192.168.0.105:8080/api",
});

// Instancia de axios
const http = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});
http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

// noticias
export const getNoticias = async () => {
  try {
    const response = await http.get("/noticias");
    return response.data;
  } catch (error) {
    // console.log("Error al cargar noticias:", error);
    return [];
  }
};

export const eliminarNoticiaAPI = async (id) => {
  try {
    const response = await http.delete(`/noticias/${id}`);
    return response.status === 200 || response.status === 204;
  } catch (error) {
    console.log("Error al eliminar noticia:", error);
    return false;
  }
};

export const agregarNoticiaAPI = async (noticia) => {
  try {
    const response = await http.post("/noticias", noticia);
    return response.data;
  } catch (error) {
    console.log("Error al agregar noticia:", error);
    return null;
  }
};

//  Comentarios
export const getComentariosPorNoticia = async (noticiaId) => {
  try {
    const response = await http.get(`/comentarios/noticia/${noticiaId}`);
    return response.data;
  } catch (error) {
    console.log("Error al obtener comentarios:", error);
    return [];
  }
};

export const agregarComentarioAPI = async (noticiaId, comentario) => {
  try {
    const response = await http.post(`/noticias/${noticiaId}/comentarios`, comentario);
    return response.data;
  } catch (error) {
    console.log("Error al agregar comentario:", error);
    return null;
  }
};

export const eliminarComentarioAPI = async (noticiaId, comentarioId) => {
  try {
    const response = await http.delete(`/noticias/${noticiaId}/comentarios/${comentarioId}`);
    return response.status === 200 || response.status === 204;
  } catch (error) {
    console.log("Error al eliminar comentario:", error);
    return false;
  }
};

export default {
  getNoticias,
  agregarNoticiaAPI,
  eliminarNoticiaAPI,
  getComentariosPorNoticia,
  agregarComentarioAPI,
  eliminarComentarioAPI,
  BASE_URL,
};
