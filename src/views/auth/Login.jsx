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
import { useTranslation } from 'react-i18next'
import { createLoginSchema } from '../../schemas/login'

export default function LoginView ({ navigation }) {
  const [isSeller, setIsSeller] = useState(false)
  const { t, i18n } = useTranslation()
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(createLoginSchema(t)),
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
      <View style={styles.languageRow}>
        <StyledText style={styles.languageLabel}>{t('common.language')}</StyledText>
        <StyledTouchableLink
          title={t('common.spanish')}
          onPress={() => i18n.changeLanguage('es')}
          underlined={i18n.language === 'es'}
          textStyle={styles.languageLink}
        />
        <StyledTouchableLink
          title={t('common.english')}
          onPress={() => i18n.changeLanguage('en')}
          underlined={i18n.language === 'en'}
          textStyle={styles.languageLink}
        />
      </View>

      <View style={styles.switchRow}>
        <StyledText style={styles.switchLabel}>{t('login.roles.client')}</StyledText>
        <Switch
          value={isSeller}
          onValueChange={setIsSeller}
          thumbColor={isSeller ? theme.colors.primaryLight : theme.colors.textPrimary}
        />
        <StyledText style={styles.switchLabel}>{t('login.roles.seller')}</StyledText>
      </View>

      <View>
        <StyledText style={styles.title}>{isSeller ? t('login.title.seller') : t('login.title.client')}</StyledText>

        <StyledTextInputWithLabel
          control={control}
          label={t('login.fields.email')}
          name='email'
          placeholder={t('login.fields.email')}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <StyledTextInputWithLabel
          control={control}
          label={t('login.fields.password')}
          name='password'
          placeholder={t('login.fields.password')}
          secureTextEntry
        />

        <StyledTouchableHighlight title={t('login.actions.submit')} onPress={submitHandler} />
      </View>

      <View style={styles.bottomRow}>
        <StyledTouchableLink title={t('login.actions.register')} onPress={goToRegister} />
        <StyledTouchableLink title={t('login.actions.forgotPassword')} onPress={goToForgot} />
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
