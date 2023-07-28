import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import TaxForm from '../components/TaxForm'
import { theme } from '../theme'

export default function TaxView () {
  const [tax, setTax] = useState(0)
  AsyncStorage.getItem('tax').then(value => value && setTax(value))

  return (
    <View style={styles.container}>
      <TaxForm taxState={[tax, setTax]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight,
    textAlign: 'center'
  }
})
