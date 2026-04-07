import { useState, useRef } from 'react'
import {
  View,
  Pressable,
  Animated,
  StyleSheet
} from 'react-native'
import StyledText from './StyledText'
import ChevronDownSVG from '../img/ChevronDown'
import { theme } from '../theme'

export default function Accordion ({
  header,
  children,
  defaultExpanded = false,
  expanded,
  onToggle,
  style,
  headerStyle,
  contentStyle,
  showChevron = true,
  accessibilityLabel
}) {
  const isControlled = expanded !== undefined
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const isOpen = isControlled ? expanded : internalExpanded

  const isAnimating = useRef(false)
  const animValue = useRef(new Animated.Value(isOpen ? 1 : 0)).current

  const [shouldRender, setShouldRender] = useState(isOpen)

  const handleToggle = () => {
    const newOpen = !isOpen

    if (newOpen) {
      setShouldRender(true)
    }

    isAnimating.current = true

    Animated.timing(animValue, {
      toValue: newOpen ? 1 : 0,
      duration: 220,
      useNativeDriver: true
    }).start(() => {
      isAnimating.current = false
      if (!newOpen) {
        setShouldRender(false)
      }
    })

    if (isControlled) {
      if (onToggle) onToggle(newOpen)
    } else {
      setInternalExpanded(newOpen)
      if (onToggle) onToggle(newOpen)
    }
  }

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  })

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0]
  })

  const chevronRotate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  })

  return (
    <View style={style}>
      <Pressable
        onPress={handleToggle}
        style={[styles.headerRow, headerStyle]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='button'
        accessibilityState={{ expanded: isOpen }}
      >
        {
          typeof header === 'string'
            ? <StyledText style={styles.headerText}>{header}</StyledText>
            : header
        }

        {showChevron && (
          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <ChevronDownSVG color={theme.colors.textSecondary} />
          </Animated.View>
        )}
      </Pressable>

      {shouldRender && (
        <Animated.View
          style={[
            styles.content,
            contentStyle,
            { opacity, transform: [{ translateY }] }
          ]}
        >
          {children}
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    flex: 1,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary
  },
  content: {
    overflow: 'hidden'
  }
})
