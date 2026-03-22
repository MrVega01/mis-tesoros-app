import { StyleSheet, View, Switch } from 'react-native'
import { theme } from '../../theme'
import StyledText from '../../components/StyledText'
import StyledTextInputWithLabel from '../../components/StyledTextInputWithLabel'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import StyledTouchableLink from '../../components/StyledTouchableLink'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../schemas/login'

export default function LoginView ({ navigation }) {
  const [isSeller, setIsSeller] = useState(false)
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const submitHandler = handleSubmit((formData) => {
    console.log('Login submit', {
      ...formData,
      isSeller
    })
  })

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
          control={control}
          label='Email'
          name='email'
          placeholder='Email'
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <StyledTextInputWithLabel
          control={control}
          label='Contraseña'
          name='password'
          placeholder='Contraseña'
          secureTextEntry
        />

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
  bottomRow: {
    marginTop: 18,
    alignItems: 'center'
  }
})
