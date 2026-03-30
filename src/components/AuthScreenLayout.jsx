import { Animated, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import AuthScaffold from './AuthScaffold'
import BrandHeader from './BrandHeader'
import TextSwitch from './TextSwitch'
import { section } from '../hooks/useStaggerAnimation'

export default function AuthScreenLayout ({ staggerAnim, isSeller, onRoleChange, form, footer }) {
  const { t } = useTranslation()

  return (
    <AuthScaffold>
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
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  headerWrapper: {
    marginBottom: 40
  },
  roleSwitch: {
    marginBottom: 36
  }
})
