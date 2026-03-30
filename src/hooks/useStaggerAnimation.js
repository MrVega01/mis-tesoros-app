import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

export const SECTION_DURATION = 540
export const STAGGER_DELAY = 100
export const TOTAL_DURATION = 3 * STAGGER_DELAY + SECTION_DURATION

export const section = (anim, i) => ({
  opacity: anim.interpolate({
    inputRange: [i * STAGGER_DELAY, i * STAGGER_DELAY + SECTION_DURATION],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  }),
  transform: [{
    translateY: anim.interpolate({
      inputRange: [i * STAGGER_DELAY, i * STAGGER_DELAY + SECTION_DURATION],
      outputRange: [20, 0],
      extrapolate: 'clamp'
    })
  }]
})

export default function useStaggerAnimation () {
  const staggerAnim = useRef(new Animated.Value(0)).current
  const titleOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(staggerAnim, {
      toValue: TOTAL_DURATION,
      duration: TOTAL_DURATION,
      useNativeDriver: true
    }).start()
  }, [])

  const animateTitleChange = () => {
    Animated.sequence([
      Animated.timing(titleOpacity, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.timing(titleOpacity, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start()
  }

  return { staggerAnim, titleOpacity, animateTitleChange }
}
