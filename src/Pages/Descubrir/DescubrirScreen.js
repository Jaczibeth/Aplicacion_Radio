import React from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Avatar, Title, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { NOMBRE_APP } from "../../configuracion/constantes";
import useNoticias from "../../hooks/useNoticias"; 

export default function DescubrirScreen({ navigation }) {
  const { noticias, cargando, error, eliminarNoticia } = useNoticias();
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetalleNoticia", { noticia: item })}
    >
      <Image source={{ uri: item.imagen }} style={styles.cardImage} />
      <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
      <Text style={styles.cardCategory}>{item.categoria}</Text>

     
  <IconButton icon="delete"iconColor="#d33939ff" size={20} onPress={() => eliminarNoticia(item.id)}  style={styles.deleteButton} />

    </TouchableOpacity>
  );

  const renderHeader = () => (
    <Text style={styles.subTitle}>Explora más noticias</Text>
  );

  if (cargando) return <Text style={{ textAlign: "center", marginTop: 20 }}>Cargando noticias...</Text>;
  if (error) return <Text style={{ textAlign: "center", marginTop: 20 }}>Error: {error}</Text>;

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
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingHorizontal: 15 },
  header: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  headerContent: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 22, marginLeft: 10, color: "#144784", fontFamily: "Poppins_600SemiBold" },
  subTitle: { fontSize: 18, fontFamily: "Poppins_600SemiBold", marginVertical: 15, color: "#144784" },
  grid: { justifyContent: "space-between", paddingBottom: 15 },
  card: { 
    width: "48%", 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    marginBottom: 15, 
    elevation: 6, 
    shadowColor: "#000", 
    shadowOpacity: 0.2, 
    shadowRadius: 6,
    overflow: "hidden",
  },
  cardImage: { 
    width: "100%", 
    height: 120, 
    borderRadius: 12, 
    marginBottom: 8 
  },
  cardTitle: { 
    fontSize: 14, 
    fontFamily: "Poppins_600SemiBold", 
    paddingHorizontal: 10, 
    color: "#333", 
    marginBottom: 4 
  },
  cardCategory: { 
    fontSize: 12, 
    fontFamily: "Poppins_400Regular", 
    color: "#888", 
    paddingHorizontal: 10, 
    marginBottom: 10 
  },
  deleteButton: { 
    position: "absolute", 
    bottom: 1, 
    right: 1, 
    backgroundColor: "#d8cfcf33", 
    borderRadius: 25, 
    padding: 10,
    elevation: 5
  },
  deleteButtonText: { 
    color: "#fff", 
    fontSize: 12, 
    textAlign: "center" 
  }
});
