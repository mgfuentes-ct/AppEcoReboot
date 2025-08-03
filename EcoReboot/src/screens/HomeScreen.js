
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
       
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>BIENVENIDO A ECOREBOOT</Text>
          <Text style={styles.bannerText}>
            ¡Dale una segunda vida a tus dispositivos electrónicos! En EcoReboot creemos en el poder
            del reciclaje, la reutilización y la reparación para reducir el impacto ambiental de la tecnología.
          </Text>
        </View>

        
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>ACERCA DE NOSOTROS</Text>
          <View style={styles.aboutContent}>
            
            <Text style={styles.aboutText}>
              ¡Dale una segunda vida a tus dispositivos electrónicos! En EcoReboot creemos en el poder del reciclaje,
              la reutilización y la reparación para reducir el impacto ambiental de la tecnología.{"\n\n"}
              ¿Tienes computadoras, celulares, tablets o impresoras en desuso? Aquí puedes donarlos, repararlos o encontrar
              dispositivos reacondicionados listos para un nuevo hogar. {"\n\n"}
              Juntos, construimos un futuro más sostenible.{"\n"}
            </Text>
          </View>
          <Image
            source={require('../img/demostracion.png')}
            style={[styles.aboutImage]}
          />
        </View>

      
        <View style={styles.devicesSection}>
          <View style={styles.deviceItem}>
            <Image source={require('../img/laptop.png')} style={styles.deviceIcon} />
            <Text style={styles.deviceText}>Laptops</Text>
          </View>
          <View style={styles.deviceItem}>
            <Image source={require('../img/tableta-grafica.png')} style={styles.deviceIcon} />
            <Text style={styles.deviceText}>Tabletas</Text>
          </View>
          <View style={styles.deviceItem}>
            <Image source={require('../img/monitor.png')} style={styles.deviceIcon} />
            <Text style={styles.deviceText}>Monitores</Text>
          </View>
          <View style={styles.deviceItem}>
            <Image source={require('../img/ordenador-personal.png')} style={styles.deviceIcon} />
            <Text style={styles.deviceText}>PC</Text>
          </View>
          <View style={styles.deviceItem}>
            <Image source={require('../img/teclado.png')} style={styles.deviceIcon} />
            <Text style={styles.deviceText}>Teclados</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FFF8', 
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FFF8',
  },
  banner: {
    backgroundColor: '#DDEFE0',
    padding: 20,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0E8A36',
    marginBottom: 10,
    textAlign: 'center',
  },
  bannerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  aboutSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11A140',
    textAlign: 'center',
    marginBottom: 15,
  },
  aboutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutImage: {
    width: 315,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  aboutText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  devicesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#E8F5E8',
  },
  deviceItem: {
    alignItems: 'center',
    width: '30%',
    marginVertical: 10,
  },
  deviceIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
    tintColor: '#11A140',
  },
  deviceText: {
    fontSize: 14,
    color: '#333',
  },
  
});

