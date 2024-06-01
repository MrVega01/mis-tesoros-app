import { StyleSheet, View } from 'react-native'
import MenuSVG from '../img/Menu'
import IconTouchable from './IconTouchable'
import { theme } from '../theme'
import StyledTouchableHighlight from './StyledTouchableHighlight'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'

export default function ExpandTouchable () {
  const [expanded, setExpanded] = useState(true)
  const navigation = useNavigation()

  const handleNavigateToCreateProduct = () => {
    navigation.navigate('Create Product')
    setExpanded(false)
  }
  const handleNavigateToCreateCategory = () => {
    navigation.navigate('Create Category')
    setExpanded(false)
  }
  // const handleNavigateToCreateSale = () => {
  //   navigation.navigate('Create Sale')
  // }

  return (
    <View style={styles.container}>
      <IconTouchable onPress={() => setExpanded(expanded => !expanded)}>
        <MenuSVG color={theme.colors.white} style={styles.icon} />
      </IconTouchable>
      {
        expanded && (
          <View style={styles.expandContainer}>
            <View style={styles.expand}>
              <StyledTouchableHighlight
                title='Crear Producto'
                style={styles.menuButton}
                onPress={handleNavigateToCreateProduct}
              />
              <StyledTouchableHighlight
                title='Crear Categoria'
                style={styles.menuButton}
                onPress={handleNavigateToCreateCategory}
              />
            </View>
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary
  },
  icon: {
    padding: 4
  },
  expandContainer: {
    position: 'relative',
    zIndex: 20
  },
  expand: {
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    zIndex: 20,
    top: 10,
    right: 0,
    minWidth: 200,
    borderRadius: 8
  },
  menuButton: {
    backgroundColor: theme.colors.primary
  }
})
