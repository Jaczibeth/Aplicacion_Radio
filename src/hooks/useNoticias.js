import { useContext } from "react";
import { NoticiasContext } from "../context/NoticiasContext";

export default function useNoticias() {
  return useContext(NoticiasContext);
}
