import { Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { theme } from '../../theme'
import { createForgotPasswordSchema } from '../../schemas/forgotPassword'
import useStaggerAnimation, { section } from '../../hooks/useStaggerAnimation'
import AuthScaffold from '../../components/AuthScaffold'
import StyledText from '../../components/StyledText'
import StyledTextInputWithLabel from '../../components/StyledTextInputWithLabel'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import StyledTouchableLink from '../../components/StyledTouchableLink'
import BackArrowSVG from '../../img/BackArrow'
import { useForgotPassword } from '../../hooks/usePasswordReset'
import { resolveErrorMessage } from '../../utils/errorMessage'

export default function ForgotPasswordView ({ navigation }) {
  const { t } = useTranslation()
  const { staggerAnim } = useStaggerAnimation()

  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createForgotPasswordSchema(t)),
    defaultValues: { email: '' }
  })

  const forgotPassword = useForgotPassword()

  const errorMessage = resolveErrorMessage(forgotPassword.error, t)

  const submitHandler = handleSubmit(async ({ email }) => {
    try {
      await forgotPassword.mutateAsync({ email })
      navigation.navigate('VerifyCode', { email })
    } catch {}
  })

  return (
    <AuthScaffold contentContainerStyle={styles.scrollContent}>
      <Animated.View style={[styles.headerSection, section(staggerAnim, 0)]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('LogIn')}
          style={styles.backButton}
          accessibilityRole='button'
          accessibilityLabel='Go back'
          accessibilityHint='Navigate to the previous screen'
        >
          <BackArrowSVG color={theme.appBar.primary} />
        </TouchableOpacity>
        <StyledText style={styles.title}>{t('forgotPassword.title')}</StyledText>
        <StyledText style={styles.subtitle}>{t('forgotPassword.subtitle')}</StyledText>
      </Animated.View>

      <Animated.View style={[styles.inputSection, section(staggerAnim, 1)]}>
        <StyledTextInputWithLabel
          label={t('login.fields.email')}
          control={control}
          name='email'
          placeholder='you@example.com'
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          accessibilityLabel={t('login.fields.email')}
          accessibilityHint='Enter the email address associated with your account'
        />
      </Animated.View>

      {errorMessage && (
        <StyledText style={styles.errorText}>{errorMessage}</StyledText>
      )}

      <Animated.View style={section(staggerAnim, 2)}>
        <StyledTouchableHighlight
          title={t('forgotPassword.actions.submit')}
          onPress={submitHandler}
          disabled={forgotPassword.isPending}
          accessibilityLabel={t('forgotPassword.actions.submit')}
          accessibilityHint='Send a verification code to your email address'
        />
      </Animated.View>

      <Animated.View style={[styles.footerRow, section(staggerAnim, 3)]}>
        <StyledTouchableLink
          title={t('forgotPassword.actions.backToLogin')}
          onPress={() => navigation.navigate('LogIn')}
          accessibilityLabel={t('forgotPassword.actions.backToLogin')}
          accessibilityHint='Navigate to the login screen'
        />
        <StyledTouchableLink
          title={t('forgotPassword.actions.backToSignUp')}
          onPress={() => navigation.navigate('SignUp')}
          accessibilityLabel={t('forgotPassword.actions.backToSignUp')}
          accessibilityHint='Navigate to the sign up screen'
        />
      </Animated.View>
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  headerSection: { marginBottom: 40, marginTop: 8 },
  backButton: { marginBottom: 28, alignSelf: 'flex-start', padding: 4 },
  title: { fontSize: theme.fontSizes.title, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 10 },
  subtitle: { fontSize: theme.fontSizes.body, color: theme.colors.textSecondary, lineHeight: 22 },
  inputSection: { marginBottom: 8 },
  errorText: { fontSize: theme.fontSizes.sub, color: theme.colors.danger, marginBottom: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }
})
