import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import { auth } from '../config/firebase'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'



function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("")
    const [passWord, setPassWord] = useState("")

    function login() {
        signInWithEmailAndPassword(auth, email, passWord)
            .then(() => {
                console.log("User successfully logged in");
                navigation.navigate("Home");
            })
            .catch((error) => {
                console.log("An error occurred during login:", error);
                if (error.code === "auth/wrong-password") {
                    Alert.alert("Incorrect Password");
                } else if (error.code === "auth/user-not-found") {
                    Alert.alert("User not found");
                } else if (error.code === "auth/invalid-email") {
                    Alert.alert("Invalid Email");
                } else {
                    Alert.alert("An error occurred during login");
                }
            });
    }




    return (
        <SafeAreaView style={styles.main}><Text style={styles.heading}>SignIn</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
                <Text>Don't have an account? </Text>
                <Pressable onPress={() => navigation.navigate('Register')}><Text style={styles.span}>SignUp</Text></Pressable>
            </View>
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
                onChangeText={(event) => setPassWord(event)}
            />
            <Pressable onPress={login} style={styles.loginButton} >
                <Text style={styles.loginText}>Login</Text>
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
        paddingLeft: 10
    },

    loginButton: {
        marginTop: 20,
        width: 180,
        height: 35,
        backgroundColor: "red",
        borderRadius: 10
    },

    loginText: {
        color: "white",
        textAlign: "center",
        marginTop: "auto",
        marginBottom: "auto",
    },
    span: {
        color: "red"
    },

    heading: {
        fontSize: 38,
        marginBottom: 20
    }

})

export default Login