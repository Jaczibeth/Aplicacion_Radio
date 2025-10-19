import React from 'react';
import { View } from 'react-native';
import DetalleNoticia from '../../Componentes/DetalleNoticia';

export default function DetalleNoticiaScreen({ route, navigation }) {
  const noticia = route?.params?.noticia;
  if (!noticia) return null;

  return (
    <View style={{ flex: 1 }}>
      <DetalleNoticia noticia={noticia} visible={true} onCerrar={() => navigation.goBack()} />
    </View>
  );
}
