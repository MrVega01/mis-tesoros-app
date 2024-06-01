import { StyleSheet, View } from 'react-native'
import Constants from 'expo-constants'
import { theme } from '../theme'
import StyledText from '../components/StyledText'
import StyledTextInput from '../components/StyledTextInput'
import StyledTouchableHighlight from '../components/StyledTouchableHighlight'
import { useState } from 'react'
import { useSaveCategory } from '../hooks/useCategories'

export default function CreateCategoryView ({ navigation }) {
  const [category, setCategory] = useState('')
  const { saveCategory } = useSaveCategory()
  const submitHandler = () => {
    saveCategory(category)
      .then(response => {
        navigation.navigate('Productos')
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
  }
})
