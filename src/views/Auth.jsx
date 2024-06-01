import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { theme } from '../theme'
import StyledText from '../components/StyledText'
import StyledTextInput from '../components/StyledTextInput'
import StyledTouchableHighlight from '../components/StyledTouchableHighlight'
import { useState } from 'react'

export default function AuthView ({ navigation }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submitHandler = () => {
    if (password === '123456789') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      })
    } else setError('Contraseña incorrecta')
  }
  const initAsClient = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home Guest' }]
    })
  }

  return (
    <View style={styles.container}>
      <StyledText style={styles.label}>Inserte la contraseña</StyledText>
      <StyledTextInput
        value={password}
        name='password'
        onChangeText={(name, value) => setPassword(value)}
        secureTextEntry
      />
      {
        error && (
          <StyledText style={styles.errorText}>{error}</StyledText>
        )
      }
      <StyledTouchableHighlight title='Ingresar' onPress={submitHandler} />
      <StyledTouchableHighlight
        title='Ingresar cómo cliente'
        onPress={initAsClient}
        style={styles.guestButton}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 20,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  label: {
    color: theme.colors.textSecondary,
    marginBottom: 3
  },
  errorText: {
    color: theme.colors.danger,
    textAlign: 'center',
    paddingBottom: 16
  },
  guestButton: {
    backgroundColor: theme.colors.primary
  }
})
