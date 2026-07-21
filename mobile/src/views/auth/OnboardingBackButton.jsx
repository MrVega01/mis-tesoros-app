import { StyleSheet, TouchableOpacity } from 'react-native'
import { theme } from '../../theme'
import StyledText from '../../components/StyledText'
import BackArrowSVG from '../../img/BackArrow'

export default function OnboardingBackButton ({ label, onPress }) {
  return (
    <TouchableOpacity
      style={styles.back}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole='button'
      accessibilityLabel={label}
    >
      <BackArrowSVG color={theme.colors.textSecondary} width={20} height={20} />
      <StyledText color='secondary' style={styles.label}>{label}</StyledText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 4
  },
  label: {
    fontSize: theme.fontSizes.sub
  }
})
