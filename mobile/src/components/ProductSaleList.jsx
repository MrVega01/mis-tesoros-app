import { FlatList, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import StyledText from './StyledText'
import { useTaxRate } from '../hooks/useTax'
import { ProductSale } from './ProductSale'
import useProducts from '../hooks/useProducts'
import { resolveErrorMessage } from '../utils/errorMessage'
import { theme } from '../theme'

export default function ProductSaleList ({ quantityList, setQuantityList }) {
  const { t } = useTranslation()
  const tax = useTaxRate()
  const { data: products, isPending, isError, error } = useProducts()

  if (isPending) {
    return <StyledText align='center' style={styles.message}>{t('common.loading')}</StyledText>
  }

  if (isError) {
    return (
      <StyledText align='center' style={[styles.message, styles.error]}>
        {resolveErrorMessage(error, t)}
      </StyledText>
    )
  }

  return (
    <FlatList
      data={products}
      ItemSeparatorComponent={<View style={styles.separator} />}
      renderItem={({ item }) => (
        <ProductSale
          product={item}
          tax={tax}
          quantity={quantityList[item.id]?.quantity || 0}
          setQuantity={
            (newQuantity) => setQuantityList({ ...item, quantity: newQuantity })
          }
        />
      )}
      keyExtractor={item => item.id}
    />
  )
}

const styles = StyleSheet.create({
  message: {
    marginTop: 24,
    paddingHorizontal: 16
  },
  error: {
    color: theme.colors.danger
  },
  separator: {
    height: 8
  }
})
