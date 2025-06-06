// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { AuthProvider } from '../context/AuthContext';
import { PaperProvider } from 'react-native-paper';
import { View, Text, ActivityIndicator } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7WByt81HDh2zBONfySQtyihhDbE3dvqA",
  authDomain: "adv102final-f2c81.firebaseapp.com",
  projectId: "adv102final-f2c81",
  storageBucket: "adv102final-f2c81.appspot.com",
  messagingSenderId: "474540987719",
  appId: "1:474540987719:web:f3cbb3c06957efcaa72862",
  measurementId: "G-HLEVZXKPLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.log('Offline persistence can only be enabled in one tab at a time');
  } else if (err.code == 'unimplemented') {
    console.log('The current browser does not support offline persistence');
  }
});

// Export services for use in other files
export { auth, db };

export default function RootLayout() {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 16 }}>Loading app...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              headerShown: false,
              title: 'Welcome'
            }} 
          />
          <Stack.Screen 
            name="login" 
            options={{ 
              headerShown: false,
              title: 'Login',
              presentation: 'modal' 
            }} 
          />
          <Stack.Screen 
            name="signup" 
            options={{ 
              headerShown: false,
              title: 'Sign Up',
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="chat" 
            options={{ 
              headerTitle: 'Global Chat',
              headerBackVisible: false
            }} 
          />  
          <Stack.Screen 
            name="profile" 
            options={{ 
              headerTitle: 'Edit Profile',
              presentation: 'modal'
            }} 
          />
        </Stack>
      </PaperProvider>
    </AuthProvider>
  );
}