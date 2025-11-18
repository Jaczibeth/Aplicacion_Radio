# Implementación de Ubicación con Permisos en Segundo Plano

## Paso 1: Instalar expo-location

Ejecuta uno de estos comandos según tu entorno:

### Usando npm:
```bash
npm install expo-location
```

### Usando yarn:
```bash
yarn add expo-location
```

### Usando expo:
```bash
expo install expo-location
```

## Paso 2: Verificar la configuración

Los permisos se han configurado automáticamente en `app.json`:

**Para Android:**
- `android.permission.ACCESS_FINE_LOCATION` - Ubicación precisa
- `android.permission.ACCESS_COARSE_LOCATION` - Ubicación aproximada

**Para iOS:**
- `NSLocationWhenInUseUsageDescription` - Descripción para solicitar acceso en tiempo de uso

## Paso 3: Uso de la Aplicación

### Lo que sucede:

1. **Al iniciar PantallaInicio**: Se cargan las noticias
2. **Después de cargar noticias**: Automáticamente aparecerá un diálogo pidiendo permisos de ubicación
3. **Si el usuario acepta**: 
   - Se obtiene la ubicación actual
   - Aparece una notificación flotante que dice "Messenger detectó esta captura de pantalla" (personalizable)
   - La notificación desaparece automáticamente después de 5 segundos
4. **Si el usuario rechaza**: 
   - Aparece un diálogo con botón "Ir a Configuración"
   - El usuario puede tocar el botón para abrir la configuración del teléfono
   - Puede habilitar manualmente los permisos desde allí

## Archivos Modificados/Creados:

### ✅ Creados:
- `src/hooks/useUbicacion.js` - Hook personalizado para gestionar ubicación y permisos
- `src/Componentes/NotificacionFondo.js` - Componente de notificación flotante con animación

### ✅ Modificados:
- `src/Pages/inicio/PantallaInicio.js` - Integración de ubicación y notificación
- `app.json` - Configuración de permisos

## Uso del Hook useUbicacion:

```javascript
const {
  ubicacion,           // Objeto con ubicación actual
  error,               // Errores ocurridos
  permisoConcedido,    // Boolean: permisos concedidos
  mostrarNotificacion, // Boolean: mostrar notificación
  solicitarPermisos,   // Función para solicitar permisos
  setMostrarNotificacion, // Para controlar la notificación
} = useUbicacion();
```

## Personalización:

### Cambiar el texto de la notificación:
En `src/Componentes/NotificacionFondo.js`, modifica:
```javascript
<Text style={estilos.texto}>
  Tu texto personalizado aquí
</Text>
```

### Cambiar el tiempo de la notificación:
En `src/hooks/useUbicacion.js`, línea ~32:
```javascript
setTimeout(() => {
  setMostrarNotificacion(false);
}, 5000); // Cambiar 5000 a milisegundos deseados
```

## Notas Importantes:

- Los permisos de ubicación solo se solicitan una vez (usando `permisosYaSolicitados`)
- La notificación usa animaciones nativas de React Native
- El diálogo de permisos es nativo del dispositivo
- Si el usuario rechaza los permisos, puede cambiarlos en Configuración > Aplicación > Permisos

## Próximos pasos (Opcional):

- Implementar seguimiento de ubicación en segundo plano
- Usar la ubicación para personalizar contenido
- Sincronizar ubicación con una API backend
