import { Animated, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { theme } from '../theme'
import useStaggerAnimation, { section } from '../hooks/useStaggerAnimation'
import AuthScaffold from './AuthScaffold'
import CodeInput from './CodeInput'
import StyledText from './StyledText'
import StyledTouchableHighlight from './StyledTouchableHighlight'
import StyledTouchableLink from './StyledTouchableLink'

export default function CodeVerifyLayout ({
  email,
  titleKey,
  subtitleKey,
  resendLabelKey,
  secondaryLinkKey,
  secondaryLinkHint,
  control,
  onSubmit,
  onResend,
  onSecondaryLink,
  codePlaceholder
}) {
  const { t } = useTranslation()
  const { staggerAnim } = useStaggerAnimation()

  return (
    <AuthScaffold contentContainerStyle={styles.scrollContent}>
      {/* Section 0 — title + email subtitle */}
      <Animated.View style={[styles.headerSection, section(staggerAnim, 0)]}>
        <StyledText style={styles.title}>{t(titleKey)}</StyledText>
        <View style={styles.subtitleRow}>
          <StyledText style={styles.subtitleBase}>
            {t(subtitleKey)}{' '}
          </StyledText>
          <StyledText style={styles.subtitleEmail}>{email}</StyledText>
        </View>
      </Animated.View>

      {/* Section 1 — code input */}
      <Animated.View style={[styles.inputSection, section(staggerAnim, 1)]}>
        <CodeInput
          control={control}
          name='code'
          placeholder={codePlaceholder}
          onSubmit={onSubmit}
        />
      </Animated.View>

      {/* Section 2 — secondary actions */}
      <Animated.View style={[styles.secondaryActions, section(staggerAnim, 2)]}>
        <StyledTouchableHighlight
          title={t(resendLabelKey)}
          onPress={onResend}
          style={styles.resendButton}
          accessibilityLabel={t(resendLabelKey)}
          accessibilityHint='Request a new verification code to be sent to your email'
        />
        <StyledTouchableLink
          title={t(secondaryLinkKey)}
          onPress={onSecondaryLink}
          style={styles.secondaryLink}
          textStyle={styles.secondaryLinkText}
          accessibilityLabel={t(secondaryLinkKey)}
          accessibilityHint={secondaryLinkHint}
        />
      </Animated.View>
    </AuthScaffold>
  )
}

CodeVerifyLayout.defaultProps = {
  codePlaceholder: '------',
  secondaryLinkHint: ''
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
  secondaryLink: {
    paddingVertical: 10,
    paddingHorizontal: 4
  },
  secondaryLinkText: {
    fontSize: theme.fontSizes.sub,
    textAlign: 'center'
  }
})
