import Constants from 'expo-constants'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { theme } from '../../theme'
import StyledText from '../../components/StyledText'

export default function CustomerHomeView () {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <StyledText color='secondary'>{t('customer.home.placeholder')}</StyledText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
