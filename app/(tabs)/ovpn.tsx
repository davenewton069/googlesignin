import React from 'react';
import { Alert, View } from 'react-native';
import { GoogleSignin, statusCodes, GoogleSigninButton, isSuccessResponse, isErrorWithCode } from '@react-native-google-signin/google-signin';
import {GOOGLE_LOGIN_URL, GOOGLE_WEB_CLIENT_ID} from '@env';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID, // Replace with your Google Web Client ID
  offlineAccess: true, // Request refresh token
  scopes: ['profile', 'email'], // Optional, specify scopes if required
  forceCodeForRefreshToken: true, // Ensures idToken is returned
});


const App: React.FC<{ navigation: any }> = ({ navigation }) => {
    const handleGoogleSignIn = async () => {
        // const url = ''//new URL(GOOGLE_LOGIN_URL);
         try {
             await GoogleSignin.hasPlayServices();
             const response = await GoogleSignin.signIn();
             if (isSuccessResponse(response)) {
               console.log( response.data );
               navigation.navigate("App")
             } else {
               // sign in was cancelled by user
             }
           } catch (error: any) {
             if (isErrorWithCode(error)) {
               switch (error.code) {
                 case statusCodes.IN_PROGRESS:
                   // operation (eg. sign in) already in progress
                   break;
                 case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                   // Android only, play services not available or outdated
                   break;
                 default:
                   Alert.alert("An error occurred", error.message);
                 // some other error happened
               }
             } else {
                 Alert.alert("An error occurred", error);
               // an error that's not related to google sign in occurred
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
