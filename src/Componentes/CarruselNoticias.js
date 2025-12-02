import React, { useRef, useState, useEffect, useCallback } from "react";
import { View, FlatList, Image, Text, TouchableOpacity, Dimensions, Animated } from "react-native";
const Punto = React.memo(({ anim }) => {
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] });
  const color = anim.interpolate({ inputRange: [0, 1], outputRange: ["#ccc", "#144784"] });
  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 5,
        backgroundColor: color,
        transform: [{ scale }],
      }}
    />
  );
});

const CarruselNoticias = React.memo(({ noticias, navigation }) => {
  const anchoPantalla = Dimensions.get("window").width;
  const itemAncho = anchoPantalla; 
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [puntosAnim, setPuntosAnim] = useState([]);

  useEffect(() => {
    if (noticias.length > 0) {
      const nuevosAnim = noticias.slice(0, 3).map(() => new Animated.Value(0));
      setPuntosAnim(nuevosAnim);
      nuevosAnim[0].setValue(1);
    }
  }, [noticias]);

  const animarPunto = useCallback((index) => {
    puntosAnim.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === index ? 1 : 0,
        useNativeDriver: false,
        friction: 5,
      }).start();
    });
  }, [puntosAnim]);

  useEffect(() => {
    if (!noticias.length || puntosAnim.length === 0) return;
    const interval = setInterval(() => {
      const siguienteIndex = (currentIndex + 1) % Math.min(noticias.length, 3);
      setCurrentIndex(siguienteIndex);
      carouselRef.current?.scrollToIndex({ index: siguienteIndex, animated: true });
      animarPunto(siguienteIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, noticias, puntosAnim, animarPunto]);

  const renderItemCarrusel = useCallback(({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("DetalleNoticia", { noticia: item })}
      style={{
        width: itemAncho,
        borderRadius: 0, 
        overflow: "hidden",
      }}
    >
      <Image source={{ uri: item.imagen }} style={{ width: "100%", height: 220}} resizeMode="cover" />
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.4)", padding: 10 }}>
        <Text style={{ color: "#fff", fontWeight: "600" }} numberOfLines={2}>{item.titulo}</Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Tendencia</Text>
      <FlatList
        ref={carouselRef}
        data={noticias.slice(0, 3)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        pagingEnabled
        snapToInterval={itemAncho} 
        renderItem={renderItemCarrusel}
        keyExtractor={(item) => `carrusel-${item.id}`}
        getItemLayout={(data, index) => ({
          length: itemAncho,
          offset: itemAncho * index,
          index,
        })}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / itemAncho);
          setCurrentIndex(index);
          animarPunto(index);
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 8, marginBottom: 16 }}>
        {puntosAnim.map((anim, index) => <Punto key={index} anim={anim} />)}
      </View>
    </View>
  );
});

export default CarruselNoticias;
