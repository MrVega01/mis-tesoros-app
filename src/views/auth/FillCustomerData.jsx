import { Animated, StyleSheet } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { theme } from '../../theme'
import { createFillCustomerDataSchema } from '../../schemas/fillCustomerData'
import useStaggerAnimation, { section } from '../../hooks/useStaggerAnimation'
import AuthScaffold from '../../components/AuthScaffold'
import BrandHeader from '../../components/BrandHeader'
import StyledText from '../../components/StyledText'
import StyledTextInputWithLabel from '../../components/StyledTextInputWithLabel'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import PhoneInput from '../../components/PhoneInput'

export default function FillCustomerDataView ({ navigation }) {
  const { t } = useTranslation()
  const { staggerAnim } = useStaggerAnimation()

  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createFillCustomerDataSchema(t)),
    defaultValues: {
      firstName: '',
      lastName: '',
      contactNumber: ''
    }
  })

  const submitHandler = handleSubmit((formData) => {
    console.log('FillCustomerData submit', formData)
    navigation.navigate('Home')
  })

  return (
    <AuthScaffold contentContainerStyle={styles.scrollContent}>
      <Animated.View style={[styles.headerWrapper, section(staggerAnim, 0)]}>
        <BrandHeader />
      </Animated.View>

      <Animated.View style={[styles.titleSection, section(staggerAnim, 1)]}>
        <StyledText style={styles.title}>{t('fillCustomerData.title')}</StyledText>
      </Animated.View>

      <Animated.View style={section(staggerAnim, 2)}>
        <StyledTextInputWithLabel
          label={t('fillCustomerData.fields.firstName')}
          control={control}
          name='firstName'
          placeholder={t('fillCustomerData.fields.firstName')}
          autoCapitalize='words'
          autoCorrect={false}
          accessibilityLabel={t('fillCustomerData.fields.firstName')}
          accessibilityHint='Enter your first name'
        />
        <StyledTextInputWithLabel
          label={t('fillCustomerData.fields.lastName')}
          control={control}
          name='lastName'
          placeholder={t('fillCustomerData.fields.lastName')}
          autoCapitalize='words'
          autoCorrect={false}
          accessibilityLabel={t('fillCustomerData.fields.lastName')}
          accessibilityHint='Enter your last name'
        />
        <PhoneInput
          label={t('fillCustomerData.fields.contactNumber')}
          control={control}
          name='contactNumber'
        />
      </Animated.View>

      <Animated.View style={[styles.submitSection, section(staggerAnim, 3)]}>
        <StyledTouchableHighlight
          title={t('fillCustomerData.actions.submit')}
          onPress={submitHandler}
          accessibilityLabel={t('fillCustomerData.actions.submit')}
          accessibilityHint='Save your information and continue'
        />
      </Animated.View>
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40
  },
  headerWrapper: {
    marginBottom: 40
  },
  titleSection: {
    marginBottom: 28
  },
  title: {
    fontSize: theme.fontSizes.title,
    fontWeight: 'bold',
    color: theme.colors.textPrimary
  },
  submitSection: {
    marginTop: 24
  }
})
