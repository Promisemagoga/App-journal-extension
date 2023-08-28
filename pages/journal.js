import * as React from 'react'
import { Audio } from 'expo-av'
import { Button, Image, SafeAreaView, StyleSheet, View, Text, Pressable, TouchableOpacity } from 'react-native';
import { auth, db, storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native';
import moment from 'moment/moment';


function Jonurnal() {
  const [recording, setRecording] = React.useState();
  const [recName, setRecName] = React.useState("")
  const navigation = useNavigation();

  async function startRecording() {
    try {
      console.log('Request Submission');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Start recording');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      await recording.startAsync();
      setRecording(recording);
      console.log('Recording Started');
    } catch (error) {
      console.error('failed to start recording', error);
    }
  }

  const formattedDate = new Date().toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });



  //we are going to console.log the url of the audio , you can use it to play or store the recording
  async function stopRecording() {
    try {
      console.log('Stopping recording...');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI()


      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          try {
            resolve(xhr.response);
          } catch (error) {
            console.log("error:", error);
          }
        };
        xhr.onerror = (e) => {
          console.log(e);
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      if (blob != null) {
        const fileName = `journal${new Date().getTime()}`;
        const status = await recording.getStatusAsync();
        const durationMillis = status.durationMillis;
        const duration = moment.duration(durationMillis);
        const formattedDuration = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
        const recordPath = `recordings/${fileName}`
        const storageRef = ref(storage, recordPath)
        const uploadRecordings = uploadBytes(storageRef, blob).then(() => {
          getDownloadURL(storageRef).then(async (url) => {
            await addDoc(collection(db, "recordInfo"), {
              date: formattedDate,
              recordingUrl: url,
              fileName: fileName,
              recName: recName,
              duration: formattedDuration,
              userData: auth.currentUser.email
            })
          })
        })

      } else {
        console.log("erroor with blob");
      }





      setRecording(undefined)
      console.log("Recording stopped and stored at", uri);

      // playSound({ uri })

    } catch (error) {
      console.log(error);
    }
  }

  const [sound, setSound] = React.useState(null);

  // async function playSound({ uri }) {
  //   console.log('Loading Sound');
  //   const { sound } = await Audio.Sound.createAsync(
  //     { uri: uri }
  //   );
  //   setSound(sound);

  //   console.log('Playing Sound');
  //   await sound.playAsync();
  // }

  function handleTextChange(newFileName) {
    setRecName(newFileName)
  }

  function logoutFunc() {
    auth.signOut()
    navigation.navigate("Login")
    console.log("Successfully signed out");
  }



  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.heading}>Record</Text>
      <TextInput
        style={styles.recordingHeading}
        placeholder="Enter heading..."
        onChangeText={handleTextChange}
        name="heading"
      />
      <Pressable style={styles.opacity} onPress={recording ? stopRecording : startRecording}>

        <View style={styles.btn}>{recording ? <Image source={require('../assets/stop.png')} style={styles.recIcon} /> : <Image source={require('../assets/play.png')} style={styles.recIcon} />}</View>
      </Pressable>
      <View style={styles.bottomNav}>
        <Pressable onPress={() => navigation.navigate('Recordings')}>
          <Image source={require('../assets/waveSound.png')} style={styles.img} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/microphone.png')} style={styles.img} />
        </Pressable>
        <Pressable onPress={logoutFunc}>
          <Image source={require('../assets/logout.png')} style={styles.img} />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
  },

  recording: {
    width: 200,
    height: 200
  },

  img: {
    width: 30,
    height: 30,
  },

  recIcon: {
    width: 100,
    height: 100,
  },

  bottomNav: {
    marginTop: "auto",
    display: 'flex',
    flexDirection: "row",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
    width: "100%",
    justifyContent: "space-between",
    padding: 20
  },

  heading: {
    marginBottom: "auto",
    marginTop: 50,
    padding: 20,
    fontSize: 30,
    fontWeight: "700"
  },

  btn: {
    backgroundColor: "red",
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center"
  },

  opacity: {
    backgroundColor: "#F7C5C2",
    width: 250,
    height: 250,
    borderRadius: 150,
    alignItems: "center",
    justifyContent: "center"
  },

  recordingHeading: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "auto",
    borderBottomWidth: 1,
    width: 250,
    height: 30

  }

});


export default Jonurnal