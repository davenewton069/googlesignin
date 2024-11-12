import React from 'react';
import { Alert, View } from 'react-native';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import {GOOGLE_LOGIN_URL, GOOGLE_WEB_CLIENT_ID} from '@env';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID, // Replace with your Google Web Client ID
  offlineAccess: true, // Request refresh token
  scopes: ['profile', 'email'], // Optional, specify scopes if required
  forceCodeForRefreshToken: true, // Ensures idToken is returned
});


const App: React.FC<{ navigation: any }> = ({ navigation }) => {
    const handleGoogleSignIn = async () => {
        const url = ''//new URL(GOOGLE_LOGIN_URL);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const token = userInfo;

            console.log(token)

            // Send idToken to the Django backend
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token }),
            });

            if (response.ok) {
                const { access, refresh } = await response.json();
                // Save tokens and navigate to the authenticated screen
                console.log('Tokens:', { access, refresh });
                Alert.alert('Success', 'Successfully signed in');
                navigation.navigate('AppNavigator')
            } else {
                Alert.alert('Error', 'Failed to sign in with Google');
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert('Cancelled', 'User cancelled the login process');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Alert.alert("Sign in in progress");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert("Play services not available");
            } else {
                Alert.alert("An error occurred", error.message);
                console.log(error)
            }
        }
    };

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
        />
      </View>
     
    );
};

export default App;
