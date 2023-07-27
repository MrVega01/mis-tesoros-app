import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { theme } from './src/theme'
import StyledText from './src/components/StyledText'
import TaxForm from './src/components/TaxForm'
import { ProductForm } from './src/components/ProductForm'
import ProductList from './src/components/ProductList'

export default function App () {
  const [tax, setTax] = useState(0)
  AsyncStorage.getItem('tax').then(value => value && setTax(value))

  return (
    <>
      <StatusBar style='light' />
      <View style={styles.container}>
        <StyledText>Administrador de Inventario</StyledText>
        <ProductForm />
        <TaxForm taxState={[tax, setTax]} />
        <ProductList tax={tax} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight
  }
})
