import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ONBOARDING_SEEN_KEY } from '../utils/constants'

export default function useOnboarding () {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null)

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_SEEN_KEY)
      .then((value) => setHasSeenOnboarding(value === 'true'))
      .catch(() => setHasSeenOnboarding(false))
  }, [])

  const markSeen = async () => {
    await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, 'true')
    setHasSeenOnboarding(true)
  }

  return { hasSeenOnboarding, markSeen }
}
