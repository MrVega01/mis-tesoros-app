import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import StyledTouchableLink from './StyledTouchableLink'

export default function SignUpFooter ({ onLogin, onForgotPassword }) {
  const { t } = useTranslation()

  return (
    <View style={styles.bottomRow}>
      <StyledTouchableLink
        title={t('signUp.actions.login')}
        onPress={onLogin}
        accessibilityLabel={t('signUp.actions.login')}
        accessibilityHint='Navigate to the login screen'
      />
      <StyledTouchableLink
        title={t('signUp.actions.forgotPassword')}
        onPress={onForgotPassword}
        accessibilityLabel={t('signUp.actions.forgotPassword')}
        accessibilityHint='Navigate to the forgot password screen'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32
  }
})
