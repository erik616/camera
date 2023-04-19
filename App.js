import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image
} from 'react-native';

import { Camera } from 'expo-camera'
import { useState, useEffect, useRef } from 'react';

import { Ionicons } from "@expo/vector-icons"

export default function App() {
  const camRef = useRef(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [hasPermission, setPermission] = useState(null)
  const [capturePhote, setCapture] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setPermission(status === 'granted')
    })()
  }, [])

  if (hasPermission === null) {
    return <View />
  }

  if (hasPermission === false) {
    return <Text>Your not has permission</Text>
  }

  function flipCam() {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    )
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapture(data.uri)
      setOpen(true)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.cam}
        type={type}
        ref={camRef}
      >
        <View style={styles.buttonContent}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={flipCam}
          >
            <Ionicons name="camera-reverse-outline" size={38} color="white"></Ionicons>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonTake}
            onPress={takePicture}
          >
            <Ionicons name="camera" size={38} color="white"></Ionicons>
          </TouchableOpacity>
        </View>
      </Camera>
      {capturePhote && (
        <Modal
          animationType='slide'
          transparent={true}
          visible={open}
        >
          <View
            style={styles.contentModel}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => { setOpen(false) }}
            >
              <Ionicons name='close' size={40} color="white" />
            </TouchableOpacity>
            <Image
              style={styles.imgPhoto}
              source={{ uri: capturePhote }}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cam: {
    flex: 1
  },
  buttonContent: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  buttonFlip: {
    position: "absolute",
    bottom: 50,
    left: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
    height: 60, width: 60,
    borderRadius: 50
  },
  buttonTake: {
    position: "absolute",
    bottom: 50,
    right: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff",
    height: 60, width: 60,
    borderRadius: 50
  },
  contentModel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20
  },
  closeBtn: {
    position: "absolute",
    top: 130,
    left:2,
    zIndex: 3
  },
  imgPhoto: {
    width: "100%",
    height: 500
  }
});
