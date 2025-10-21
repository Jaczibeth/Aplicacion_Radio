// CONFIGURACIÓN DE COLORES Y ESTILOS DE LA APP

export const colores = {
  principal: "#1448A9",      // Azul principal
  secundario: "#1e90ff",     // Azul claro
  rojoPrimario: "#C41E3A",   // Rojo La Tlaxiaqueña
  



  fondoBlanco: "#ffffff",
  fondoGris: "#f5f5f5",
  fondoGrisClaro: "#fafafa",
  
  textoOscuro: "#000000",
  textoGris: "#555555",
  textoGrisClaro: "#888888",
  textoBlanc: "#ffffff",
  
  
  borde: "#e0e0e0",
  bordeClaro: "#f0f0f0",
  
 
  exito: "#4CAF50",
  error: "#f44336",
  advertencia: "#FF9800",
  

  pestanaActiva: "#0059ff",
  pestanaInactiva: "#e0e0e0",
  
 
  fondoTarjeta: "#ffffff",
  sombraTarjeta: "rgba(0, 0, 0, 0.1)",
};


export const tamanosTexto = {
  muyPequeno: 10,
  pequeno: 12,
  normal: 14,
  mediano: 16,
  grande: 18,
  muyGrande: 20,
  titulo: 24,
  tituloGrande: 28,
};


export const espaciado = {
  minimo: 4,
  pequeno: 8,
  normal: 12,
  mediano: 16,
  grande: 20,
  muyGrande: 24,
  enorme: 32,
};


export const bordesRedondeados = {
  pequeno: 5,
  normal: 8,
  mediano: 10,
  grande: 12,
  muyGrande: 15,
  completo: 50,
};


export const temaPrincipal = {
  dark: false,
  version: 3,
  roundness: bordesRedondeados.normal,
  colors: {
    primary: colores.principal,
    primaryContainer: "#E3F2FD",
    secondary: colores.secundario,
    secondaryContainer: "#F5F5F5",
    tertiary: colores.rojoPrimario,
    tertiaryContainer: "#FFE0E6",
  
    background: colores.fondoGrisClaro,
    surface: colores.fondoBlanco,
    surfaceVariant: colores.fondoGris,
    surfaceDisabled: "#E0E0E0",
    

    onPrimary: "#FFFFFF",
    onPrimaryContainer: "#001A41",
    onSecondary: "#FFFFFF",
    onSecondaryContainer: "#1A1C1E",
    onTertiary: "#FFFFFF",
    onTertiaryContainer: "#31001D",
    onBackground: colores.textoOscuro,
    onSurface: colores.textoOscuro,
    onSurfaceVariant: colores.textoGris,
    onSurfaceDisabled: colores.textoGrisClaro,
    
   
    outline: colores.borde,
    outlineVariant: colores.bordeClaro,
    
 
    error: colores.error,
    onError: "#FFFFFF",
    errorContainer: "#FFEBEE",
    onErrorContainer: "#410002",
    

    backdrop: "rgba(0, 0, 0, 0.5)",
    shadow: "#000000",
    scrim: "#000000",
    inverseSurface: "#2E3133",
    inverseOnSurface: "#F0F0F3",
    inversePrimary: "#A8C7FA",
    elevation: {
      level0: "transparent",
      level1: "#F5F5F5",
      level2: "#F0F0F0",
      level3: "#EBEBEB",
      level4: "#E8E8E8",
      level5: "#E3E3E3",
    },
  },

};

export default {
  colores,
  tamanosTexto,
  espaciado,
  bordesRedondeados,
  temaPrincipal,
};

export const coloresCategorias = {
  Política: "#CD220F",
  Deportes: "#f39c12",
  Tecnología: "#3498db", 
  Salud: "#27ae60",
  Cultura: "#401155",
  Clima: "#00aaff",
  Educación: "#7ABAE6",
  Economía: "#e67e22", 
  Entretenimiento: "#9b59b6",
  Ciencia: "#2ecc71",
  Turismo: "#1abc9c",
  "Medio Ambiente": "#27ae60",
  Ciudad: "#34495e",
  Agricultura: "#f1c40f",
  Otro: "#95a5a6",
};
