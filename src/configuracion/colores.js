// CONFIGURACIÓN DE COLORES Y ESTILOS DE LA APP

// Colores principales
export const colores = {
  // Colores primarios
  principal: "#0059ff",      // Azul principal
  secundario: "#1e90ff",     // Azul claro
  rojoPrimario: "#C41E3A",   // Rojo La Tlaxiaqueña
  
  // Fondos
  fondoBlanco: "#ffffff",
  fondoGris: "#f5f5f5",
  fondoGrisClaro: "#fafafa",
  
  // Textos
  textoOscuro: "#000000",
  textoGris: "#555555",
  textoGrisClaro: "#888888",
  textoBlanc: "#ffffff",
  
  // Bordes y separadores
  borde: "#e0e0e0",
  bordeClaro: "#f0f0f0",
  
  // Estados
  exito: "#4CAF50",
  error: "#f44336",
  advertencia: "#FF9800",
  
  // Pestañas
  pestanaActiva: "#0059ff",
  pestanaInactiva: "#e0e0e0",
  
  // Tarjetas
  fondoTarjeta: "#ffffff",
  sombraTarjeta: "rgba(0, 0, 0, 0.1)",
};

// Tamaños de texto
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

// Espaciados
export const espaciado = {
  minimo: 4,
  pequeno: 8,
  normal: 12,
  mediano: 16,
  grande: 20,
  muyGrande: 24,
  enorme: 32,
};

// Bordes redondeados
export const bordesRedondeados = {
  pequeno: 5,
  normal: 8,
  mediano: 10,
  grande: 12,
  muyGrande: 15,
  completo: 50,
};

// Tema para React Native Paper v5
export const temaPrincipal = {
  dark: false,
  version: 3,
  roundness: bordesRedondeados.normal,
  colors: {
    // Colores principales
    primary: colores.principal,
    primaryContainer: "#E3F2FD",
    secondary: colores.secundario,
    secondaryContainer: "#F5F5F5",
    tertiary: colores.rojoPrimario,
    tertiaryContainer: "#FFE0E6",
    
    // Fondos y superficies
    background: colores.fondoGrisClaro,
    surface: colores.fondoBlanco,
    surfaceVariant: colores.fondoGris,
    surfaceDisabled: "#E0E0E0",
    
    // Textos
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
    
    // Bordes y separadores
    outline: colores.borde,
    outlineVariant: colores.bordeClaro,
    
    // Estados
    error: colores.error,
    onError: "#FFFFFF",
    errorContainer: "#FFEBEE",
    onErrorContainer: "#410002",
    
    // Otros
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
  // Fonts configuration removed - usando fuentes por defecto de Paper
  // Las fuentes personalizadas se aplican directamente en los componentes
};

export default {
  colores,
  tamanosTexto,
  espaciado,
  bordesRedondeados,
  temaPrincipal,
};


