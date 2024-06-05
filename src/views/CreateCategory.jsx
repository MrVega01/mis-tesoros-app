import { FlatList, StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { theme } from '../theme'
import StyledText from '../components/StyledText'
import StyledTextInput from '../components/StyledTextInput'
import StyledTouchableHighlight from '../components/StyledTouchableHighlight'
import { useState } from 'react'
import useCategories, { useSaveCategory } from '../hooks/useCategories'
import CategoryItem from '../components/CategoryItem'

export default function CreateCategoryView ({ navigation }) {
  const [category, setCategory] = useState('')
  const { categories, refresh } = useCategories()
  const { saveCategory } = useSaveCategory()
  const submitHandler = () => {
    saveCategory(category)
      .then(response => {
        refresh()
      })
  }

  return (
    <View style={styles.container}>
      <StyledText style={styles.label}>Inserte la categoria</StyledText>
      <StyledTextInput
        value={category}
        name='category'
        onChangeText={(name, value) => setCategory(value)}
      />
      <StyledTouchableHighlight title='Crear' onPress={submitHandler} />
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
            name={item.type}
            style={styles.categoryItem}
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
  }
})
