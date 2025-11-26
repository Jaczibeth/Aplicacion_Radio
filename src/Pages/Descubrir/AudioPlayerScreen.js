import React, { useContext } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { AudioContext } from "../../context/AudioContext";
import { Ionicons } from "@expo/vector-icons";

const AUDIO_URI = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export default function AudioPlayerScreen() {
  const { isPlaying, playAudio, pauseAudio, changeVolume } = useContext(AudioContext);

  const togglePlayback = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio(AUDIO_URI);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fondo degradado */}
      <View style={styles.headerBlur} />

      {/* Carátula */}
      <Image
        source={{
          uri: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExMVFhUXFxgXFxgYGBgYFxcYFRUXFxcXFxgYHSggGBolHRcVITEiJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGi0dHSUtKy0tLS0tLS0tLS0rLjAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tLTctLf/AABEIAI4BYgMBIgACEQEDEQH/xAAaAAADAQEBAQAAAAAAAAAAAAACAwQBAAUH/8QAPhAAAgECAwQGBQoGAwEAAAAAAAECAxESITEEQVGyEyJhcYGxMnKRocIjQkNSYnOCg8HRBVNjkuHwM6Lxk//EABgBAAMBAQAAAAAAAAAAAAAAAAABAgME/8QAJREAAgICAgEEAgMAAAAAAAAAAAECERIhAzHwEyJBUWGBBDLB/9oADAMBAAIRAxEAPwD4/hCUe01LsDiuw6UjejYRHRgZCFxqpWNUjRI1I10zkMuWkUKcQXHsGtGwQUFCFEXOBXJZGYewTiJxIpU/E5UypQ3nKmTgLEk6MGdHsPQVNgumD4wcCFUWEtnL+j8AcAemGBJ0J3QlrpmqnYfpjwIpUQeiLpU+4xUQwFiSKkEqRXKhfeMVMagPA87ozVRLuj7AVAMBYkipBdCiqUN4UaVwwIoilRA6M9LoBbp57hOBLRA4CpwPSdG4HQEuAmiRQuZKgW9BbNDYwGoEshp0rmqgWSp5hRp3KwIIOiQUaB6Doo7BvH6YHnuixE6J6mECpDPQT4wPN6I3B2FbgZgIxAlcLnTpFDiC4IMQI5QZzplriBOJLgBF0fecVWOFiBitvNlu4AoP5tmM6Qoy1sVR0JoPfbh43KoU7dxpEuJvaGgsKeRqp7jWi6MlE7Dc3CFGHgOh0LYcYhQojVT9g1EaRO4ZGKPiPt4hQXgPEKFU4XyO6EpStuNpUsysSsRKoXNdGxXGHaY6ZWA8SKUQY5lj7gcCJcRNEjSO6O5YqWLSN/8AGZsKS4CwFiyJw4GxhYtezrh7wZQ3WDATjQnAvExQHxoZ336ewYqQYkNEnRBQpWdinojZ0nqPEhiVTFPZ94+QaQqTIZLGibKiXUqF72eiv71+4GB71/kaiS0RqjuzOlQs7ot6I10sh4EMjjC+thaptPsLnCxziGBJJCLZklbeOw2zRrhcVCJWgZoolAypDITiBIkDKFx0qf8AqBaIoCdwAlAslBCZx7CXECdJgTZSoi508yGgJbL/AFnFWE4nECOA+6EUojkiYnSjYuy1sFszlJ33AxiU0VlkaRWy0h8VZcGbHXMG5sJ3RsaD2na+69vcLuypbO8NrK+O2vYTxiCdmsotUDF5s3pczZQM6JppvRj2RspwPLLW3vNnTwuzWaKHSeJNLJKGfeZtUevJfafmVF2by46VieA2hBtpLVs2MWVbDB44ytle3ja5o9KwhG5JCqdO97bld9yNp0cTStm8vHQfssPSbWsG17Ujdhg8UXuUoq/a8/0DLsv0+vySTpNZcPNAwplVaDTvubdu2zzEJ2vkURJUx+wUuvnpaXKxCguBZsMXiTtk1NJ9qj/lEtSk1btV14kqrKkqgvPoHLtDUDYbNKWdnrZd9rmWZRhKwnDxOUOw6i7jUOjNsTKicqY9pu1tTFBrJ6rJhWyGIjROlQtm9L29yZXtFFRw23xi33s2cPkl675UT8KiXGrTEbIsql/qfEhOF+0v2ak1GeWsLruxJfoK2inhm4rRfsKPZE08UyWAfRuzluVk/G9jGtxVGi8EotZ3hbjnexT0ZpWSOF0LULjnGzt4ApdxVECXTBlTRRKOQGAmgJ4pcEDURVCjiaS1eh1Wm0o5bm34Nr9iWh02RKl2gTpjpNg3vqQ0iRMshNRb0USjcW4EtATuIEkyudJE0455mbjQCbHBdF3HEUBEg4IWpdgxSM0dSGxQyEhcdBiNEWg2woPj4+0BjqFN2k9E18SG2aQVs9HF1sv5nwkeB2vu8y1J4ss/lFyiqj6sF9lt+1hB7OrkjaFRZS1eEN763sQO1Und5WSwrxcR2zpWj6tQ0ctJihDbi/NlcWt3Cl5k+2XxydsnKWd+D9495ZW3UvMOtByVrfST/RhB7OjkjlEgUW+CPT/hUGmm5ZdJw+yefhtoep/D8sMZRzVR65/N0NZ9GX8de8NPqr7qXMUU4pOyWXSU+UQl1Fw6KXOVJLFl/Mp8pB2JE20024w3/wDI/BSzJls94ya1Tjlxvc9KOn4KvmS/w9XjLL51PmNFLRjOCct/X+A7NdKCzveqmradUXtMW8Lzypxv2bvM9NJ3Wesq3KJkuo1/Sp8xK7sc4+zHzoTsCyjn898hJKF7XWunav8Abnp7LTccKdlapJNO70gS1ad4wstIX7liaKi/cc3JG+NefRPGluMw2PQqbPhTis5KcYrxjfz8hFKk5X3Wi5Z9hqmmcsuOSdHQpuNSKfGL9tmM22Csnvc6nmiypSWLFbNOjbxWYra6WJJJZ46rt2JpszTto0lCotHnfxKuk4avqwTy0vxKatK/V/qy5UFtOyxact/R0uZfsPhTzX3s+Qztmbjt38i8XUtr8jx+2I/iMb1JZb1n3oa5dTt6Lj9sPbl1Z3/mLkLi9mfIriQVNl6qa3pt9lm0V3d3vWKj5BU/QX3dTmGNa6elR8gk7FGKXXmjy9phaTe7E/cxVi/aqV4pJfOqexPtIo6q3FeZpF6MJxqRksst+mfEUqm4ftq60nZ+k1f3nKklF5awT8cXuE56Fjto7ZoPFFpLW2ay9x1SXVXqTt/eNoNpJPdUXKS4urn9SfNcym7ZpFUiOSs7O6/8yAjpqN/iLbldcI8oqGgJ2YNU6FzmZ0qCkk9wEqatkLYjpzXEnqWCcbPUTWM5MAbnGXMIsDyYyfEZnxAgkUI5kjdDKbyGxYEEbBGqNEW7NT0avm5e5DaUlbP6i5hOzVNE9E2/ahySSy+or/3DOvjqtHpUmr3/AKi5RFK2rX0cuzeFH0tPpFymKSUPy5cxSOkrnJXv9uny+8xRdlbhVA6RK98utTf/AFGbNNWWvo1Si7Tfn2MpQyad8ui135leal+OryiHo9dKXDiOpy6y9epylI1WvPyIpwSi916cH7Zr9i5Zz1t8t8B5r2jqNfZjFeEr/uXUajc+zpfhKla7J45R+AacGoZX/wCKXOP6brO/82nykmLqL7qXOMl6f5lPh9UGykymFRWWfza3mMxpXtb6H9COMcl6tbzChVv6OnyS8U8/eOxOXn6K1PrL1q2X4TpS6j+6p84uE1iV/rVt/YBOqsOX8unzDsmUvP0XxmseevSy5BEoLB+Q+c6MljyefSyt/YLUupZv6F2/vAzlIc1af5sOQVSmml6lXzHdHaeuXS0+QRFxw2WqhVfteXuBGUmUVZa8b0PIXGenfW8jZVNb8aPkZjWS7a3kBnKXn7Fz9H8ulzDIy6+v0s+UnnO8fwUuy2Yan1839LPkAwbNwrC3/R+Moq+l2dLHkJ1UWDX6H4zdprKLb3KpHlKFZifVWX0dTmMc7N+tR8hMZ9VX0wVOYOerf2qPkImzsav/APb9SenBKLtwp+dzHNq2S+l1fYJo7TdO6t6CXbheYKyG1e/NFyl19PpKnKSzmsOSz6Jc3EfKtFO7ytUny2J36P5S5hDYVPKbu7p1V3+joJm+r+XPnGzfW/NWnqkz9H8E+ckTBqO7az9Kn5E9Gje+dvTf9o+dVK7b+dT9liSe0Wdlp1rdqkJESa+RM5C1UyNfiC9GOzAXUYMjJ9gurLIzbAP/AHQwT0v+5HE5IDyoMohMRSKIo54m6HwZsNQEu0LGamgyL3FlGWUr8F5ohxcBkJcWUi4Spnswykl/U+EnqTWGPc7+1nKpaV92P4SNzHFnVyTpUVVqmKV1pl7lYv2edox00qHkRmUur1Y27fDMvXRPHyU3Lzs9y+vaqXmK215Nf1J/puE0tpT1W6n4ZnbXPry9Z+ZXHtnVyT9ujMz0Ni0jx6T4DylK2hXsEm8PDH8JpN6M+B+46tKSUfupcxXRrZu/8ynyk8Y9XJ/RS52dSeJ30+UhkrcLfoZbNsqY91Mln82r56C9lqdWV7elDmItoySz3z5hUa2TV9bX8NC10c3JzVPz6Pb6XNPL0qufHICVXqvN504eZFs1XKKz+fyo6tK+DP5kf1yFHsJ8vts9HYnZQd79d5fgFbRNONPS6j8Ug9gslD7x8hCpreaR/sYck6gl58Fc9sbi087tO/crfsBTm+NtV4MSmgk8jVHNKbe2ejXrJTUePRO/ckT7W7xXr1Le1EUdo68W3vj7rWN2va75cJTftZj00VLkuLL5zSVr6wp8xtSyl29LNf8AU87aa2cNHaEf3Nr7Q7Yo76ja9nAliz7LFUShr9D8YO21rqSv89Pwwk8E8HH5P4wNtfXl/u4cexTl7S6EkoLP6Oa/7aG1alr99LyPJxN2TeSvbszuWTq5vvpeQS0EZ2J2qqnlvUpX13sGlqmJqzWJ978wJVLFxdIxk9lW1zvOWe9+Zq2pWaf1cKt618zz8ZsZZ2JsWW7LdldsOb9NZeGp0p9X8EuYl2Z2nHvGKnknn6EuYzfZpF6EbTbF7PJGJr9hSCpNXyKRk3YuUsxd3nmNqu3C4tNEsQGgia3DW0KmZyAX0fYcdd8TiNAedYYpMUpcRqkYI2QxNhLvBUjVI0RY2L9oTERmM6S40xpjoVOr4/obFoU48QolIqx8YjcImlKwyVRmiaKRXi68e6P6FNZ9aWe9+Z5dOo+JUp3RUDb1LTHOXhYdscrzj3kUpMFVGs0W2JTp2ehs0/T9R+aO2SpeUbL5y8zz1Nhp23isT5evwOrSzfe/MCKEviFAVmMpW7Ldj9LTdLyYFOW4HZqlpeD7NzMpzvxGnsG/aiyDMl4ilpqG5PtNbMmwnNa5hKoLbCuUS2ZVhkKURkgWhMhmVJb9LJL2IOrH5NPhJ+S4E7ku0ObViKCzdmWU3d+j+qAr183J+NsxlLKM/V/VE1t8ne3YifkbekbGTlnml3+Y2/VlnvX6iVJM1LMZKdC7PVGdKt5ROKsR1BPQjXO+hscs7iHVsHCd9MiLAthO4yVS6S4Xt4u5JCVtBsZq2ZpY7MaWouPedKfYA2S2Iyq0+IqQVS4qUyGwFSm9BeMObBxGTAz2nGY2cIDzroZFiUMizBM1QcTQMZt7jHYWI2EheEYgsZspvS46MrCLdoyPeUhoqpyGOVyJTsNVQ0Ui1IppjsViLpGcpspSHkV9JxOc+0lVTijpzHmJyKY1c9QnJ319hNGXAZF8QUibHKT/AMhYgIy3BpvQoQUYMbGLSyAbsaqhSEPpTe9L2huS8SaMs9waqFpkthupbecq2fEROe/zFxnvDIzbLVUuzZzJaU7sLpBqQh0rAYrAOqrC5VBNgPU2r23guQh1e051ELIChdxyQmMznWHaAqkRbRNpq0brfnmE6zFSncmUrA2VJA9CbKXAzFaxOgGdGkY5WNbFylYbAKNX/wANdQmlK+vgZfIjIB8qopyAcwOkE5AFNE85O4yc9RTkzOTAy77TgXM4kCS6NuJuEpGNl2EkaDcNAM5MK4DMixgPxHYhfcYOx2OTGJviIudGY7HY6HeMhU4CLhOVhpjse6oyJFjGRmUpCstg1qY5pk8JG3KyFZXGqbKvexIquQDr56ZjzCz0FW7gnVPOoVcWY3GNTJci2nO+oU5ksahkpsrIlsdKbAhftFJBXFYhtzXLgKUgalWw8gG42bivxuS9NmEqosgG4jcQmU2ma2FgOjVOxiDsSDIB06nYdKYqpMDEDkA5S7QITFdIFF5k2BTi48TqtVCcbBlUKyA2rIXGZ1RiUyGwGzmmLvYHF5nTkS2AbmxUps2TzFVJEtgMxnCbmisdH//Z",
        }}
        style={styles.coverArt}
      />

      {/* Título y subtítulo */}
      <Text style={styles.title}>La Tlaxaqueña</Text>
      <Text style={styles.subtitle}>Radio en Vivo - México</Text>

    
      <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={48}
          color="#fff"
        />
      </TouchableOpacity>

     
      <Text style={styles.smallText}>Volumen</Text>
      <Slider
        style={{ width: 280, height: 40 }}
        minimumValue={0}
        maximumValue={1}
        value={0.5}
        onValueChange={changeVolume}
        minimumTrackTintColor="#021576ff"
        maximumTrackTintColor="#ffffffff"
        thumbTintColor="#1daeb9ff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0e0e6b81",  justifyContent: "center", alignItems: "center", paddingHorizontal: 20,},
  headerBlur: {position: "absolute", top: 0,left: 0, right: 0,height: 300, backgroundColor: "#336ecc55", borderBottomLeftRadius: 100, borderBottomRightRadius: 100,opacity: 0.4,},
  coverArt: { width: 280, height: 280, borderRadius: 20, marginBottom: 30, shadowColor: "#676565ff", shadowOpacity: 0.5, shadowOffset: { width: 0, height: 8 }, shadowRadius: 12,},
  title: { fontSize: 26,fontWeight: "bold",color: "#fff",marginBottom: 6,textAlign: "center",},
  subtitle: {fontSize: 16,color: "#b3b3b3",marginBottom: 30,textAlign: "center",},
  playButton: { width: 90, height: 90, backgroundColor: "#b9471d63", borderRadius: 50, justifyContent: "center", alignItems: "center", marginBottom: 40, shadowColor: "#b91d1d7a", shadowOpacity: 0.6, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10,},
  smallText: { color: "#fff", marginBottom: 10,  fontSize: 14, },
});
