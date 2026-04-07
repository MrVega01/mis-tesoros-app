import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import StyledTouchableLink from './StyledTouchableLink'

export default function LoginFooter ({ onRegister, onForgotPassword }) {
  const { t } = useTranslation()

  return (
    <View style={styles.bottomRow}>
      <StyledTouchableLink
        title={t('login.actions.register')}
        onPress={onRegister}
        accessibilityLabel={t('login.actions.register')}
        accessibilityHint='Navigate to the registration screen'
      />
      <StyledTouchableLink
        title={t('login.actions.forgotPassword')}
        onPress={onForgotPassword}
        accessibilityLabel={t('login.actions.forgotPassword')}
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
