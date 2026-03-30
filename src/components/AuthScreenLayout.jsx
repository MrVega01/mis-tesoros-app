import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { theme } from '../theme'
import BrandHeader from './BrandHeader'
import TextSwitch from './TextSwitch'
import { section } from '../hooks/useAuthScreen'

export default function AuthScreenLayout ({ staggerAnim, isSeller, onRoleChange, form, footer }) {
  const { t } = useTranslation()

  return (
    <SafeAreaView style={styles.safeArea}>
      <View pointerEvents='none' style={styles.ambientGlow} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[styles.headerWrapper, section(staggerAnim, 0)]}>
            <BrandHeader />
          </Animated.View>

          <Animated.View style={[styles.roleSwitch, section(staggerAnim, 1)]}>
            <TextSwitch
              value={isSeller}
              onChange={onRoleChange}
              accessibilityLabel={`${t('login.roles.client')} ${t('login.roles.seller')}`}
              options={[
                { label: t('login.roles.client'), value: false },
                { label: t('login.roles.seller'), value: true }
              ]}
            />
          </Animated.View>

          <Animated.View style={section(staggerAnim, 2)}>
            {form}
          </Animated.View>

          <Animated.View style={section(staggerAnim, 3)}>
            {footer}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24
  },
  headerWrapper: {
    marginBottom: 40
  },
  roleSwitch: {
    marginBottom: 36
  }
})
