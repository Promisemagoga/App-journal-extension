import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Jonurnal from './pages/journal'
import Recordings from './pages/recordings'
import Login from './pages/Login'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import Register from './pages/Register'
import { useNavigation } from '@react-navigation/native'

const Stack = createNativeStackNavigator()
function StackNavigator() {
  const navigation = useNavigation();

  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() =>{
onAuthStateChanged(auth,(user) =>{
  if(user){
    console.log(user);
    const uid = user.uid
    setIsAuthenticated(user)
    navigation.navigate("Home")
  }else{
    setIsAuthenticated(null)
  }
})
  },[isAuthenticated])
  return (
   <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Group>
    <Stack.Screen name='Register' component={Register}/>
    <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='Home' component={Jonurnal}/>
        <Stack.Screen name='Recordings' component={Recordings}/>
    </Stack.Group>
   </Stack.Navigator>
  )
}

export default StackNavigator