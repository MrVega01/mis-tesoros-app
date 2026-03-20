import { StyleSheet, View, Switch } from 'react-native'
import { theme } from '../../theme'
import StyledText from '../../components/StyledText'
import StyledTextInputWithLabel from '../../components/StyledTextInputWithLabel'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import StyledTouchableLink from '../../components/StyledTouchableLink'

export default function LoginView ({ navigation }) {
  const [isSeller, setIsSeller] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submitHandler = () => {
    if (!email || !password) return setError('Completa email y contraseña')
    setError('')
    // Aquí iría la lógica real de login según `isSeller`
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
  }

  const goToRegister = () => navigation.navigate('Register')
  const goToForgot = () => navigation.navigate('ForgotPassword')

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.switchRow}>
        <StyledText style={styles.switchLabel}>Cliente</StyledText>
        <Switch
          value={isSeller}
          onValueChange={setIsSeller}
          thumbColor={isSeller ? theme.colors.primaryLight : theme.colors.textPrimary}
        />
        <StyledText style={styles.switchLabel}>Vendedor</StyledText>
      </View>

      <View>
        <StyledText style={styles.title}>{isSeller ? 'Ingreso Vendedor' : 'Ingreso Cliente'}</StyledText>

        <StyledTextInputWithLabel
          label='Email'
          value={email}
          name='email'
          placeholder='Email'
          onChangeText={(name, value) => setEmail(value)}
          keyboardType='email-address'
        />

        <StyledTextInputWithLabel
          label='Contraseña'
          value={password}
          name='password'
          placeholder='Contraseña'
          onChangeText={(name, value) => setPassword(value)}
          secureTextEntry
        />

        {error ? <StyledText style={styles.errorText}>{error}</StyledText> : null}

        <StyledTouchableHighlight title='Ingresar' onPress={submitHandler} />
      </View>

      <View style={styles.bottomRow}>
        <StyledTouchableLink title='Registrarse' onPress={goToRegister} />
        <StyledTouchableLink title='Olvidé mi contraseña' onPress={goToForgot} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primary,
    padding: 16
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  switchLabel: {
    color: theme.colors.textSecondary,
    marginHorizontal: 8
  },
  title: {
    textAlign: 'center',
    color: theme.colors.textPrimary,
    marginBottom: 12
  },
  errorText: {
    color: theme.colors.danger,
    textAlign: 'center',
    marginBottom: 12
  },
  bottomRow: {
    marginTop: 18,
    alignItems: 'center'
  }
})
