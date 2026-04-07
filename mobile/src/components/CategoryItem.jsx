import { StyleSheet, TouchableHighlight, View } from 'react-native'
import StyledText from './StyledText'
import DeleteSVG from '../img/Delete'
// import EditSVG from '../img/Edit'
import { theme } from '../theme'

export default function CategoryItem ({ id, name, style, onDelete }) {
  return (
    <View style={[styles.container, style]}>
      <StyledText size='subheading'>{name}</StyledText>
      <View style={styles.flexButtons}>
        {/* <TouchableHighlight>
          <EditSVG color={theme.colors.white} />
        </TouchableHighlight> */}
        <TouchableHighlight onPress={onDelete}>
          <DeleteSVG color={theme.colors.white} />
        </TouchableHighlight>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderWidth: 1,
    borderColor: `${theme.colors.white}2f`,
    borderRadius: 6
  },
  flexButtons: {
    flexDirection: 'row',
    gap: 16
  }
})
