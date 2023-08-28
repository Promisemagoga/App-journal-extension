import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Pressable } from 'react-native'
import { TextInput } from 'react-native'
import { SafeAreaView, StyleSheet, Text } from 'react-native'
import { auth, db } from '../config/firebase'
import { addDoc, collection } from 'firebase/firestore'

function Register() {
  const navigation = useNavigation();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    function register() {
        createUserWithEmailAndPassword(auth, email, password)
        .then(async(userCredentials) => {
            const user= userCredentials.user
            if(userCredentials && user){
                const docRef = await addDoc(collection(db, "users"), {
                    email: email
                })
            }
          console.log("User Successfully registered");
          navigation.navigate('Home')
        })
        .catch((error) =>{
            console.log(error);
        })
    }


    return (
        <SafeAreaView style={styles.main}>
            <Text style={styles.heading}>SignUp</Text>
            <Text>Do you have an account? <Pressable onPress={() => navigation.navigate('Login')}><Text style={styles.span}>SignIn</Text></Pressable></Text>
            <TextInput
                placeholder='Email Adress'
                type="email"
                onChangeText={(event) => setEmail(event)}
                style={styles.loginInput}
            />
            <TextInput
                placeholder='Password'
                type="password"
                style={styles.loginInput}
                onChangeText={(event) => setPassword(event)}
            />
            <Pressable onPress={register} style={styles.loginButton} >
                <Text style={styles.loginText}>Sign Up</Text>
            </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 20,
        width: "100%",
    },

    loginInput: {
        borderWidth: 1,
        width: 300,
        height: 50,
        borderRadius: 5,
        paddingLeft:10
    },

    loginButton: {
        marginTop: 20,
        width: 180,
        height: 35,
        backgroundColor: "#F7C5C2",
        borderRadius: 10
    },

    loginText: {
        color: "white",
        textAlign: "center",
        marginTop: "auto",
        marginBottom: "auto",
    },
    span:{
        color: "red"
    },

    heading:{
        fontSize: 38,
        marginBottom: 20
    }
})


export default Register