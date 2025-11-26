
import { useState, useEffect } from "react";
import { TEXTOS_BUSQUEDA_ROTATIVOS } from "../configuracion/constantes";

export default function useAnimacionBuscar() {
  const [texto, setTexto] = useState(TEXTOS_BUSQUEDA_ROTATIVOS[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((i) => {
        const nuevo = (i + 1) % TEXTOS_BUSQUEDA_ROTATIVOS.length;
        setTexto(TEXTOS_BUSQUEDA_ROTATIVOS[nuevo]);
        return nuevo;
      });
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);

  return texto;
}
