import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'

const SECTION_DURATION = 540
const STAGGER_DELAY = 100
const TOTAL_DURATION = 3 * STAGGER_DELAY + SECTION_DURATION

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

export default function useAuthScreen (createSchema) {
  const { t } = useTranslation()
  const [isSeller, setIsSeller] = useState(false)

  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createSchema(t)),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const staggerAnim = useRef(new Animated.Value(0)).current
  const titleOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(staggerAnim, {
      toValue: TOTAL_DURATION,
      duration: TOTAL_DURATION,
      useNativeDriver: true
    }).start()
  }, [])

  const handleRoleChange = (val) => {
    Animated.sequence([
      Animated.timing(titleOpacity, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.timing(titleOpacity, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start()
    setIsSeller(val)
  }

  return {
    control,
    handleSubmit,
    isSeller,
    handleRoleChange,
    titleOpacity,
    staggerAnim
  }
}
