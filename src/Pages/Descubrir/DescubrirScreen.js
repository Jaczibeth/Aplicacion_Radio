import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
import { Avatar, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { noticias } from "../../Data/noticias";
import { NOMBRE_APP } from "../../configuracion/constantes";

export default function DescubrirScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetalleNoticia", { noticia: item })}
    >
      <Image source={{ uri: item.imagen }} style={styles.cardImage} />
      <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
      <Text style={styles.cardCategory}>{item.categoria}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <Text style={styles.subTitle}>Explora más noticias</Text>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Avatar.Image
            size={45}
            source={require("../../assets/Logos/nt-el-reloj.gif")}
            style={{ backgroundColor: "transparent" }}
          />
          <Title style={styles.title}>{NOMBRE_APP}</Title>
        </View>
      </View>
      <FlatList
        data={noticias}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={renderItem}
        columnWrapperStyle={styles.grid}
        contentContainerStyle={{ paddingBottom: 70 }}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingHorizontal: 10 },
  header: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  headerContent: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 22, marginLeft: 10, color: "#144784", fontFamily: "Poppins_600SemiBold" },
  subTitle: { fontSize: 18, fontFamily: "Poppins_600SemiBold", marginVertical: 15, color: "#144784" },
  grid: { justifyContent: "space-between", paddingBottom: 15 },
  card: { width: "48%", backgroundColor: "#f8f8f8", borderRadius: 10, marginBottom: 15, overflow: "hidden", elevation: 3, },
  cardImage: { width: "100%", height: 100 },
  cardTitle: { fontSize: 13, fontFamily: "Poppins_400Regular", paddingHorizontal: 8, marginTop: 5, color: "#333" },
  cardCategory: { fontSize: 11, fontFamily: "Poppins_400Regular", paddingHorizontal: 8, marginBottom: 8, color: "#888" },
}
);