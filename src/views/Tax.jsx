import { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import TaxForm from '../components/TaxForm'
import { theme } from '../theme'
import { GlobalContext } from '../context/global'

export default function TaxView () {
  const { state, updateTax } = useContext(GlobalContext)
  const { tax } = state

  return (
    <View style={styles.container}>
      <TaxForm taxState={[tax, updateTax]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 20,
    textAlign: 'center'
  }
})
