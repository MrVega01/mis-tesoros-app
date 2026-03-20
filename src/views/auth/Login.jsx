import { StyleSheet, View, Switch } from 'react-native'
import { theme } from '../../theme'
import StyledText from '../../components/StyledText'
import StyledTextInputWithLabel from '../../components/StyledTextInputWithLabel'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import { useState } from 'react'

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
    <View style={styles.container}>
      <View style={styles.switchRow}>
        <StyledText style={styles.switchLabel}>Cliente</StyledText>
        <Switch
          value={isSeller}
          onValueChange={setIsSeller}
          thumbColor={isSeller ? theme.colors.primaryLight : theme.colors.textPrimary}
        />
        <StyledText style={styles.switchLabel}>Vendedor</StyledText>
      </View>

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

      <View style={styles.bottomRow}>
        <StyledTouchableHighlight title='Registrarse' onPress={goToRegister} style={styles.linkButton} />
        <StyledTouchableHighlight title='Olvidé mi contraseña' onPress={goToForgot} style={styles.linkButton} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: 16,
    justifyContent: 'center'
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
  },
  linkButton: {
    backgroundColor: theme.colors.primary,
    marginTop: 8
  }
})
