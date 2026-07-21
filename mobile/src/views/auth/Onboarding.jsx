import { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { theme } from '../../theme'
import BrandHeader from '../../components/BrandHeader'
import OnboardingPager from '../../components/OnboardingPager'
import OnboardingIntroSlide from './OnboardingIntroSlide'
import OnboardingRoleSlide from './OnboardingRoleSlide'
import OnboardingAuthSlide from './OnboardingAuthSlide'
import useOnboarding from '../../hooks/useOnboarding'

export default function OnboardingView ({ navigation }) {
  const { t } = useTranslation()
  const { markSeen } = useOnboarding()
  const pagerRef = useRef(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedRole, setSelectedRole] = useState(null)

  const goTo = (index) => {
    pagerRef.current?.goTo(index)
    setCurrentIndex(index)
  }

  const goToAuth = async (screenName) => {
    await markSeen()
    navigation.reset({ index: 0, routes: [{ name: screenName, params: { role: selectedRole } }] })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents='none' style={styles.ambientGlow} />

      <View style={styles.header}>
        <BrandHeader />
      </View>

      <OnboardingPager
        ref={pagerRef}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      >
        <View style={styles.slideFrame}>
          <OnboardingIntroSlide t={t} onNext={() => goTo(1)} />
        </View>

        <View style={styles.slideFrame}>
          <OnboardingRoleSlide
            t={t}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            onNext={() => goTo(2)}
            onBack={() => goTo(0)}
          />
        </View>

        <View style={styles.slideFrame}>
          <OnboardingAuthSlide
            t={t}
            onCreateAccount={() => goToAuth('SignUp')}
            onLogin={() => goToAuth('LogIn')}
            onBack={() => goTo(1)}
          />
        </View>
      </OnboardingPager>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary
  },
  ambientGlow: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(221, 133, 31, 0.07)'
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16
  },
  slideFrame: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16
  }
})
