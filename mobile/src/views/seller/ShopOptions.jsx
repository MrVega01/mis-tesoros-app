import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { theme } from '../../theme'
import { useTaxRate, useTaxActions } from '../../hooks/useTax'
import { resolveErrorMessage } from '../../utils/errorMessage'
import { SHOP_ERROR_KEYS } from '../../utils/constants'
import StyledText from '../../components/StyledText'
import OptionRow from '../../components/OptionRow'
import TaxRateDialog from '../../components/TaxRateDialog'

export default function ShopOptionsView () {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const tax = useTaxRate()
  const { updateTax, isPending } = useTaxActions()

  const [draft, setDraft] = useState(null)
  const [saveError, setSaveError] = useState(null)

  // 'Create Category' lives on the root stack while this view sits inside the
  // seller tab navigator, so the navigation has to go through the parent.
  const rootNav = navigation.getParent() ?? navigation

  const openDialog = () => {
    setSaveError(null)
    setDraft(String(tax))
  }
  const cancelDialog = () => {
    setDraft(null)
    setSaveError(null)
  }
  const saveDialog = async () => {
    setSaveError(null)
    try {
      await updateTax(draft)
      setDraft(null)
    } catch (error) {
      setSaveError(error)
    }
  }

  return (
    <View style={styles.container}>
      <StyledText size='title' bold>{t('shopOptions.title')}</StyledText>

      <View style={styles.card}>
        <OptionRow
          label={t('shopOptions.rate')}
          value={String(tax)}
          onPress={openDialog}
          accessibilityHint={t('shopOptions.rateHint')}
        />
        <View style={styles.separator} />
        <OptionRow
          label={t('shopOptions.categories')}
          onPress={() => rootNav.navigate('Create Category')}
          accessibilityHint={t('shopOptions.categoriesHint')}
        />
      </View>

      <TaxRateDialog
        visible={draft !== null}
        title={t('shopOptions.dialogTitle')}
        label={t('shopOptions.rate')}
        value={draft ?? ''}
        onChangeText={setDraft}
        onCancel={cancelDialog}
        onSubmit={saveDialog}
        cancelLabel={t('shopOptions.cancel')}
        saveLabel={t('shopOptions.save')}
        isPending={isPending}
        errorMessage={saveError ? resolveErrorMessage(saveError, t, SHOP_ERROR_KEYS.taxRate) : null}
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
  separator: {
    height: 1,
    backgroundColor: `${theme.colors.white}1f`
  }
})
