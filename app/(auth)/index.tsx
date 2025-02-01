import LoginScreen from '@/components/auth/Login';
import ParallaxScrollView from '@/components/ParallaxScrollView'
import React from 'react'
import { Image, StyleSheet} from 'react-native'

export default function index() {
  return (
    <div>
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                source={require('@/assets/images/icon.png')}
                style={styles.reactLogo}
                />
        }>
            {/* <LoginScreen/> */}

        </ParallaxScrollView>
      
    </div>
  )
}
const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
  });
