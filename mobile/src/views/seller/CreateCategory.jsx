import { Alert, FlatList, StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { theme } from '../../theme'
import StyledText from '../../components/StyledText'
import StyledTextInput from '../../components/StyledTextInput'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import useCategories, { useDeleteCategory, useSaveCategory } from '../../hooks/useCategories'
import CategoryItem from '../../components/CategoryItem'
import { resolveErrorMessage } from '../../utils/errorMessage'

const SAVE_ERROR_MESSAGES = { 409: 'categories.errors.duplicate' }

export default function CreateCategoryView ({ navigation }) {
  const [category, setCategory] = useState('')
  const { t } = useTranslation()
  const { data: categories } = useCategories()
  const saveCategory = useSaveCategory()
  const deleteCategory = useDeleteCategory()

  const submitHandler = async () => {
    try {
      await saveCategory.mutateAsync(category)
      setCategory('')
    } catch {}
  }
  const handleDeleteCategory = (category) => {
    Alert.alert('Eliminar categoría', `La categoría "${category.name}" será eliminada`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await deleteCategory.mutateAsync(category.id)
          } catch {}
        }
      }
    ])
  }

  const errorMessage = resolveErrorMessage(saveCategory.error, t, SAVE_ERROR_MESSAGES)

  return (
    <View style={styles.container}>
      <StyledText style={styles.label}>Inserte la categoria</StyledText>
      <StyledTextInput
        value={category}
        name='category'
        onChangeText={(name, value) => setCategory(value)}
      />
      {errorMessage ? (
        <StyledText style={styles.errorMessage}>{errorMessage}</StyledText>
      ) : null}
      <StyledTouchableHighlight
        title='Crear'
        onPress={submitHandler}
        disabled={saveCategory.isPending}
      />
      <StyledText
        align='center'
        size='title'
        style={styles.categoryTitle}
        bold
      >Categorias
      </StyledText>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CategoryItem
            id={item.id}
            name={item.name}
            style={styles.categoryItem}
            onDelete={() => handleDeleteCategory(item)}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Constants.statusBarHeight + 20,
    paddingHorizontal: 10
  },
  label: {
    color: theme.colors.textSecondary,
    marginBottom: 3
  },
  categoryTitle: {
    marginVertical: 16
  },
  categoryItem: {
    marginBottom: 8
  },
  errorMessage: {
    color: theme.colors.danger,
    fontSize: theme.fontSizes.sub,
    marginBottom: 8
  }
})
