import { Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useFocusEffect } from '@react-navigation/native'
import { theme } from '../../theme'
import { createResetPasswordSchema } from '../../schemas/resetPassword'
import useStaggerAnimation, { section } from '../../hooks/useStaggerAnimation'
import AuthScaffold from '../../components/AuthScaffold'
import StyledText from '../../components/StyledText'
import StyledTextInputWithLabel from '../../components/StyledTextInputWithLabel'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import StyledTouchableLink from '../../components/StyledTouchableLink'
import BackArrowSVG from '../../img/BackArrow'
import { useResetPassword } from '../../hooks/usePasswordReset'
import { resolveErrorMessage } from '../../utils/errorMessage'
import { AUTH_ERROR_KEYS } from '../../utils/constants'

export default function ResetPasswordView ({ navigation, route }) {
  const { t } = useTranslation()
  const resetToken = route.params?.resetToken ?? ''
  const { staggerAnim } = useStaggerAnimation()

  const { control, handleSubmit, reset } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createResetPasswordSchema(t)),
    defaultValues: { password: '', confirmPassword: '' }
  })

  const resetPassword = useResetPassword()

  const errorMessage = resolveErrorMessage(resetPassword.error, t, AUTH_ERROR_KEYS.resetPassword)

  useFocusEffect(
    useCallback(() => {
      return () => { reset() }
    }, [reset])
  )

  const submitHandler = handleSubmit(async ({ password }) => {
    try {
      await resetPassword.mutateAsync({ resetToken, password })
      navigation.navigate('LogIn')
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
        <StyledText style={styles.title}>{t('resetPassword.title')}</StyledText>
        <StyledText style={styles.subtitle}>{t('resetPassword.subtitle')}</StyledText>
      </Animated.View>

      <Animated.View style={[styles.inputSection, section(staggerAnim, 1)]}>
        <StyledTextInputWithLabel
          label={t('resetPassword.fields.password')}
          control={control}
          name='password'
          secureTextEntry
          autoCapitalize='none'
          autoCorrect={false}
          accessibilityLabel={t('resetPassword.fields.password')}
          accessibilityHint='Enter your new password'
        />
      </Animated.View>

      <Animated.View style={[styles.inputSection, section(staggerAnim, 2)]}>
        <StyledTextInputWithLabel
          label={t('resetPassword.fields.confirmPassword')}
          control={control}
          name='confirmPassword'
          secureTextEntry
          autoCapitalize='none'
          autoCorrect={false}
          accessibilityLabel={t('resetPassword.fields.confirmPassword')}
          accessibilityHint='Re-enter your new password to confirm it matches'
        />
      </Animated.View>

      <Animated.View style={[styles.footerSection, section(staggerAnim, 3)]}>
        {errorMessage && (
          <StyledText style={styles.errorText}>{errorMessage}</StyledText>
        )}
        <StyledTouchableHighlight
          title={t('resetPassword.actions.submit')}
          onPress={submitHandler}
          disabled={resetPassword.isPending}
          accessibilityLabel={t('resetPassword.actions.submit')}
          accessibilityHint='Submit your new password to complete the reset'
        />
        <StyledTouchableLink
          title={t('resetPassword.actions.backToLogin')}
          onPress={() => navigation.navigate('LogIn')}
          accessibilityLabel={t('resetPassword.actions.backToLogin')}
          accessibilityHint='Navigate to the login screen'
          style={styles.backToLoginLink}
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
  footerSection: { marginTop: 16, gap: 12 },
  backToLoginLink: { alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 4 }
})
