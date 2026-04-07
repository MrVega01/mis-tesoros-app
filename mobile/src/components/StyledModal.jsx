import { Modal, View, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { theme } from '../theme'

export default function StyledModal ({
  visible,
  onClose,
  children,
  animationType = 'slide',
  maxHeight,
  cardPaddingBottom = 0,
  backdropColor = 'rgba(0,0,0,0.6)',
  dragHandleStyle,
  cardStyle,
  backdropAccessibilityLabel = 'Close modal'
}) {
  return (
    <Modal visible={visible} transparent animationType={animationType} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose} accessibilityLabel={backdropAccessibilityLabel}>
        <View style={[styles.backdrop, { backgroundColor: backdropColor }]} />
      </TouchableWithoutFeedback>

      <View style={[styles.card, maxHeight != null && { maxHeight }, cardPaddingBottom > 0 && { paddingBottom: cardPaddingBottom }, cardStyle]}>
        <View style={[styles.dragHandle, dragHandleStyle]} />
        {children}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1
  },
  card: {
    backgroundColor: theme.colors.secondary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginVertical: 8
  }
})
