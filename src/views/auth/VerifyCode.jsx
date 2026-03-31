import { Animated, StyleSheet, View } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { theme } from '../../theme'
import { createVerifyCodeSchema } from '../../schemas/verifyCode'
import useStaggerAnimation, { section } from '../../hooks/useStaggerAnimation'
import AuthScaffold from '../../components/AuthScaffold'
import CodeInput from '../../components/CodeInput'
import StyledText from '../../components/StyledText'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import StyledTouchableLink from '../../components/StyledTouchableLink'

export default function VerifyCodeView ({ navigation, route }) {
  const { t } = useTranslation()
  const email = route.params?.email ?? ''
  const { staggerAnim } = useStaggerAnimation()

  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createVerifyCodeSchema(t)),
    defaultValues: { code: '' }
  })

  const submitHandler = handleSubmit((formData) => {
    console.log('VerifyCode submit', { code: formData.code, email })
    navigation.navigate('ResetPassword', { email })
  })

  const handleResend = () => {
    console.log('resend', { email })
  }

  return (
    <AuthScaffold contentContainerStyle={styles.scrollContent}>
      {/* Section 0 — title + email subtitle */}
      <Animated.View style={[styles.headerSection, section(staggerAnim, 0)]}>
        <StyledText style={styles.title}>{t('verifyCode.title')}</StyledText>
        <View style={styles.subtitleRow}>
          <StyledText style={styles.subtitleBase}>
            {t('verifyCode.subtitle')}{' '}
          </StyledText>
          <StyledText style={styles.subtitleEmail}>{email}</StyledText>
        </View>
      </Animated.View>

      {/* Section 1 — code input */}
      <Animated.View style={[styles.inputSection, section(staggerAnim, 1)]}>
        <CodeInput
          control={control}
          name='code'
          placeholder='-----'
          onSubmit={submitHandler}
        />
      </Animated.View>

      {/* Section 2 — secondary actions */}
      <Animated.View style={[styles.secondaryActions, section(staggerAnim, 2)]}>
        <StyledTouchableHighlight
          title={t('verifyCode.actions.resend')}
          onPress={handleResend}
          style={styles.resendButton}
          accessibilityLabel={t('verifyCode.actions.resend')}
          accessibilityHint='Request a new verification code to be sent to your email'
        />
        <StyledTouchableLink
          title={t('verifyCode.actions.wrongEmail')}
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.wrongEmailLink}
          textStyle={styles.wrongEmailText}
          accessibilityLabel={t('verifyCode.actions.wrongEmail')}
          accessibilityHint='Navigate back to the reset password screen'
        />
      </Animated.View>
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 40
  },
  headerSection: {
    marginBottom: 44,
    alignItems: 'center'
  },
  title: {
    fontSize: theme.fontSizes.title,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 14
  },
  subtitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subtitleBase: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  },
  subtitleEmail: {
    fontSize: theme.fontSizes.body,
    color: theme.appBar.primary,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputSection: {
    marginBottom: 12
  },
  secondaryActions: {
    alignItems: 'center',
    marginTop: 20,
    gap: 8
  },
  resendButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(221, 133, 31, 0.45)'
  },
  wrongEmailLink: {
    paddingVertical: 10,
    paddingHorizontal: 4
  },
  wrongEmailText: {
    fontSize: theme.fontSizes.sub,
    textAlign: 'center'
  }
})
