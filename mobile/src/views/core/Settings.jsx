import Constants from 'expo-constants'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { theme } from '../../theme'
import { USER_ROLE } from '../../utils/constants'
import useAuthState from '../../hooks/useAuthState'
import { useMe } from '../../hooks/useProfile'
import { useLogout } from '../../hooks/useAuth'
import StyledText from '../../components/StyledText'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'

const ROLE_LABEL_KEYS = {
  [USER_ROLE.SELLER]: 'account.roles.seller',
  [USER_ROLE.CUSTOMER]: 'account.roles.customer'
}

export default function Settings () {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { user } = useAuthState()
  const me = useMe()
  const logout = useLogout()

  const account = me.data ?? user
  const email = account?.email
  const role = account?.role
  const roleKey = ROLE_LABEL_KEYS[role]
  const roleLabel = roleKey ? t(roleKey) : null

  const showLoading = me.isLoading && !user

  const rootNav = navigation.getParent() ?? navigation
  async function handleLogout () {
    try {
      await logout.mutateAsync()
    } catch (e) {
      // clearSession runs in onSettled regardless of outcome
    } finally {
      rootNav.reset({ index: 0, routes: [{ name: 'LogIn' }] })
    }
  }

  return (
    <View style={styles.container}>
      <StyledText size='title' bold>{t('account.title')}</StyledText>

      <View style={styles.card}>
        {showLoading
          ? (
            <StyledText color='secondary'>{t('common.loading')}</StyledText>
            )
          : (
            <>
              <View style={styles.row}>
                <StyledText size='sub' color='secondary'>{t('account.email')}</StyledText>
                <StyledText>{email}</StyledText>
              </View>
              <View style={styles.row}>
                <StyledText size='sub' color='secondary'>{t('account.role')}</StyledText>
                <StyledText>{roleLabel}</StyledText>
              </View>
            </>
            )}
      </View>

      <StyledTouchableHighlight
        title={t('account.logout')}
        onPress={handleLogout}
        disabled={logout.isPending}
        style={styles.logout}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 20,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  card: {
    marginTop: 24,
    backgroundColor: theme.colors.secondary,
    borderRadius: 12,
    padding: 16,
    gap: 16
  },
  row: {
    gap: 4
  },
  logout: {
    marginTop: 'auto',
    backgroundColor: theme.colors.danger
  }
})
