import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
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

export default function ForgotPasswordView ({ navigation }) {
  const { t } = useTranslation()
  const { staggerAnim } = useStaggerAnimation()

  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createForgotPasswordSchema(t)),
    defaultValues: { email: '' }
  })

  const submitHandler = handleSubmit((formData) => {
    navigation.navigate('VerifyCode', { email: formData.email })
  })

  return (
    <AuthScaffold contentContainerStyle={styles.scrollContent}>
      {/* Section 0 — back arrow + title + subtitle */}
      <Animated.View style={[styles.headerSection, section(staggerAnim, 0)]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('LogIn')}
          style={styles.backButton}
          accessibilityRole='button'
          accessibilityLabel='Go back'
          accessibilityHint='Navigate to the previous screen'
        >
          <View style={styles.backArrow}>
            <View style={styles.backArrowStem} />
            <View style={styles.backArrowHead} />
          </View>
        </TouchableOpacity>

        <StyledText style={styles.title}>{t('forgotPassword.title')}</StyledText>
        <StyledText style={styles.subtitle}>{t('forgotPassword.subtitle')}</StyledText>
      </Animated.View>

      {/* Section 1 — email input */}
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

      {/* Section 2 — send code button */}
      <Animated.View style={section(staggerAnim, 2)}>
        <StyledTouchableHighlight
          title={t('forgotPassword.actions.submit')}
          onPress={submitHandler}
          accessibilityLabel={t('forgotPassword.actions.submit')}
          accessibilityHint='Send a verification code to your email address'
        />
      </Animated.View>

      {/* Section 3 — footer links */}
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
  scrollContent: {
    paddingBottom: 40
  },
  headerSection: {
    marginBottom: 40,
    marginTop: 8
  },
  backButton: {
    marginBottom: 28,
    alignSelf: 'flex-start',
    padding: 4
  },
  backArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 28,
    height: 20
  },
  backArrowStem: {
    width: 18,
    height: 2,
    backgroundColor: theme.appBar.primary,
    borderRadius: 1
  },
  backArrowHead: {
    position: 'absolute',
    left: 0,
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: theme.appBar.primary,
    transform: [{ rotate: '45deg' }]
  },
  title: {
    fontSize: theme.fontSizes.title,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 10
  },
  subtitle: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.textSecondary,
    lineHeight: 22
  },
  inputSection: {
    marginBottom: 8
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28
  }
})
