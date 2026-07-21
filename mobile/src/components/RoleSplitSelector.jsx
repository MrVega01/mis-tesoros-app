import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { theme } from '../theme'
import StyledText from './StyledText'
import ShoppingBagSVG from '../img/ShoppingBag'
import StoreSVG from '../img/Store'
import { USER_ROLE } from '../utils/constants'

// 50/50 selectable panel. Customer on the LEFT, Seller on the RIGHT.
function RoleHalf ({ role, selected, onSelect, Icon, title, description }) {
  const accent = selected ? theme.colors.accent : theme.colors.textSecondary
  return (
    <TouchableOpacity
      style={[styles.half, selected && styles.halfSelected]}
      onPress={() => onSelect(role)}
      activeOpacity={0.85}
      accessibilityRole='button'
      accessibilityState={{ selected }}
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <Icon color={accent} width={30} height={30} />
      </View>
      <StyledText bold style={[styles.title, selected && styles.titleSelected]}>
        {title}
      </StyledText>
      <StyledText size='sub' color='secondary' align='center' style={styles.description}>
        {description}
      </StyledText>
    </TouchableOpacity>
  )
}

export default function RoleSplitSelector ({ selectedRole, onSelect, customer, seller }) {
  return (
    <View style={styles.container}>
      <RoleHalf
        role={USER_ROLE.CUSTOMER}
        selected={selectedRole === USER_ROLE.CUSTOMER}
        onSelect={onSelect}
        Icon={ShoppingBagSVG}
        title={customer.title}
        description={customer.description}
      />
      <RoleHalf
        role={USER_ROLE.SELLER}
        selected={selectedRole === USER_ROLE.SELLER}
        onSelect={onSelect}
        Icon={StoreSVG}
        title={seller.title}
        description={seller.description}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 14
  },
  half: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 212, 212, 0.18)',
    backgroundColor: theme.colors.secondary
  },
  halfSelected: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(221, 133, 31, 0.12)'
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212, 212, 212, 0.08)',
    marginBottom: 16
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(221, 133, 31, 0.2)'
  },
  title: {
    fontSize: theme.fontSizes.subheading,
    marginBottom: 6,
    color: theme.colors.textSecondary
  },
  titleSelected: {
    color: theme.colors.textPrimary
  },
  description: {
    lineHeight: 18
  }
})
