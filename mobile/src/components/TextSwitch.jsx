import { useEffect, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, View } from 'react-native'
import { theme } from '../theme'
import StyledText from './StyledText'

export default function TextSwitch ({
  options,
  value,
  onChange,
  style,
  accessibilityLabel
}) {
  const [containerWidth, setContainerWidth] = useState(0)
  const translateX = useRef(new Animated.Value(5)).current

  const selectedIndex = Math.max(options.findIndex((option) => option.value === value), 0)
  const segmentWidth = containerWidth > 0 && options.length > 0 ? containerWidth / options.length : 0

  useEffect(() => {
    if (segmentWidth === 0) {
      return
    }

    const toValue = selectedIndex * segmentWidth + (
      selectedIndex === 0
        ? 5
        : selectedIndex === (options.length - 1)
          ? -7
          : 0
    )

    Animated.timing(translateX, {
      toValue,
      duration: 180,
      useNativeDriver: true
    }).start()
  }, [segmentWidth, selectedIndex, translateX])

  return (
    <View
      style={[styles.container, style]}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
      accessibilityRole='tablist'
      accessibilityLabel={accessibilityLabel}
    >
      {segmentWidth > 0 && (
        <Animated.View
          pointerEvents='none'
          style={[
            styles.thumb,
            {
              width: segmentWidth,
              transform: [{ translateX }]
            }
          ]}
        />
      )}

      {options.map((option) => {
        const isSelected = option.value === value

        return (
          <Pressable
            key={option.value}
            style={styles.option}
            onPress={() => onChange(option.value)}
            accessibilityRole='button'
            accessibilityState={{ selected: isSelected }}
          >
            <StyledText style={[styles.label, isSelected && styles.selectedLabel]} bold>
              {option.label}
            </StyledText>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    padding: 4,
    backgroundColor: theme.colors.secondary,
    borderWidth: 1,
    borderColor: 'rgba(254, 254, 254, 0.18)',
    overflow: 'hidden'
  },
  thumb: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 999,
    backgroundColor: theme.appBar.primary
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 1
  },
  label: {
    color: theme.colors.textSecondary
  },
  selectedLabel: {
    color: theme.colors.textPrimary
  }
})
