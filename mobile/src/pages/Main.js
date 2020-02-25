import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api'
import { connect, disconnect, subscribeToNewDevs } from '../services/socket'

export default function Main({ navigation }) {
  const [devs, setDevs] = useState([])
  const [techs, setTechs] = useState('')
  const [currentRegion, setCurrentRegion] = useState(null)

  useEffect(() => {
    subscribeToNewDevs(dev => {
      setDevs([...devs, dev])
    })
  }, [devs])
  function setupWebsocket() {
    disconnect()
    const { latitude: lat, longitude: long } = currentRegion

    connect(lat, long, techs)
  }
  async function loadDevs() {
    const { latitude: lat, longitude: long } = currentRegion

    const response = await api.get('/search', {
      params: {
        lat, long, techs
      }
    })
    setDevs(response.data.devs)
    setupWebsocket()
  }
  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync()
      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        })
        const { latitude, longitude } = coords
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        })
      }
    }
    loadInitialPosition()
  }, [])

  function handleRegionChanged(region) {
    setCurrentRegion(region)
  }

  if (!currentRegion) {
    return null
  }
  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        initialRegion={currentRegion}
        style={styles.map}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1],
            }}
          >
            <Image source={{ uri: dev.avatar_url }} style={styles.avatar} />
            <Callout onPress={() => {
              navigation.navigate('Profile', { github_username: dev.github_username })
            }}>
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name} </Text>
                <Text style={styles.devBio}>{dev.bio} </Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')} </Text>
              </View>
            </Callout>
          </Marker>)
        )}
      </MapView>
      <View style={styles.seachForm}>
        <TextInput
          style={styles.seachInput}
          placeholder='Buscar devs por techs...'
          placeholderTextColor='#999'
          autoCapitalize='words'
          autoCorrect={false}
          value={techs}
          onChangeText={setTechs}
        />
        <TouchableOpacity
          onPress={loadDevs}
          style={styles.loadButton}
        >
          <MaterialIcons name='my-location' size={20} color='#fff' />
        </TouchableOpacity>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#fff'
  },
  callout: {
    width: 260,
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  devBio: {
    color: '#666',
    marginTop: 5
  },
  devTechs: {
    marginTop: 6
  },
  seachForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row'
  },
  seachInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },
  loadButton: {
    height: 50,
    width: 50,
    backgroundColor: '#8e40ff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  }
}) 