import { Animated, StyleSheet, View } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { theme } from '../../theme'
import { createFillSellerDataSchema } from '../../schemas/fillSellerData'
import useStaggerAnimation, { section } from '../../hooks/useStaggerAnimation'
import AuthScaffold from '../../components/AuthScaffold'
import BrandHeader from '../../components/BrandHeader'
import StyledText from '../../components/StyledText'
import StyledTextInputWithLabel from '../../components/StyledTextInputWithLabel'
import StyledTouchableHighlight from '../../components/StyledTouchableHighlight'
import PhoneInput from '../../components/PhoneInput'
import TextAreaInput from '../../components/TextAreaInput'
import ScheduleInput from '../../components/ScheduleInput'
import { useUpdateSellerProfile } from '../../hooks/useProfile'
import { resolveErrorMessage } from '../../utils/errorMessage'
import { AUTH_ERROR_KEYS } from '../../utils/constants'

export default function FillSellerDataView ({ navigation }) {
  const { t } = useTranslation()
  const { staggerAnim } = useStaggerAnimation()

  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createFillSellerDataSchema(t)),
    defaultValues: {
      companyName: '',
      sellerName: '',
      companyType: '',
      companyDescription: '',
      address: '',
      hoursOfOperation: null,
      contactNumber: ''
    }
  })

  const updateProfile = useUpdateSellerProfile()

  const errorMessage = resolveErrorMessage(updateProfile.error, t, AUTH_ERROR_KEYS.fillSellerData)

  const submitHandler = handleSubmit(async (formData) => {
    const payload = { ...formData }
    if (!payload.companyDescription) delete payload.companyDescription
    if (!payload.address) delete payload.address
    if (!payload.hoursOfOperation) delete payload.hoursOfOperation
    try {
      await updateProfile.mutateAsync(payload)
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
    } catch {}
  })

  return (
    <AuthScaffold contentContainerStyle={styles.scrollContent}>
      <Animated.View style={[styles.headerWrapper, section(staggerAnim, 0)]}>
        <BrandHeader />
      </Animated.View>

      <Animated.View style={[styles.titleSection, section(staggerAnim, 1)]}>
        <StyledText style={styles.title}>{t('fillSellerData.title')}</StyledText>
      </Animated.View>

      <Animated.View style={section(staggerAnim, 2)}>
        <View style={styles.fieldGroup}>
          <StyledTextInputWithLabel
            label={t('fillSellerData.fields.companyName')}
            control={control}
            name='companyName'
            placeholder={t('fillSellerData.fields.companyName')}
            autoCapitalize='words'
            autoCorrect={false}
            accessibilityLabel={t('fillSellerData.fields.companyName')}
            accessibilityHint='Enter your company name'
          />
          <StyledTextInputWithLabel
            label={t('fillSellerData.fields.sellerName')}
            control={control}
            name='sellerName'
            placeholder={t('fillSellerData.fields.sellerName')}
            autoCapitalize='words'
            autoCorrect={false}
            accessibilityLabel={t('fillSellerData.fields.sellerName')}
            accessibilityHint='Enter the seller name'
          />
          <StyledTextInputWithLabel
            label={t('fillSellerData.fields.companyType')}
            control={control}
            name='companyType'
            placeholder={t('fillSellerData.fields.companyType')}
            autoCapitalize='words'
            autoCorrect={false}
            accessibilityLabel={t('fillSellerData.fields.companyType')}
            accessibilityHint='Enter the type of company'
          />
          <PhoneInput
            label={t('fillSellerData.fields.contactNumber')}
            control={control}
            name='contactNumber'
          />
        </View>

        <View style={styles.fieldGroupSpaced}>
          <TextAreaInput
            label={t('fillSellerData.fields.companyDescription')}
            control={control}
            name='companyDescription'
            placeholder={t('fillSellerData.fields.companyDescription')}
            minHeight={100}
          />
          <StyledTextInputWithLabel
            label={t('fillSellerData.fields.address')}
            control={control}
            name='address'
            placeholder={t('fillSellerData.fields.address')}
            autoCapitalize='words'
            autoCorrect={false}
            accessibilityLabel={t('fillSellerData.fields.address')}
            accessibilityHint='Enter your business address'
          />
          <ScheduleInput
            label={t('fillSellerData.fields.hoursOfOperation')}
            control={control}
            name='hoursOfOperation'
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.submitSection, section(staggerAnim, 3)]}>
        {errorMessage && (
          <StyledText style={styles.errorText}>{errorMessage}</StyledText>
        )}
        <StyledTouchableHighlight
          title={t('fillSellerData.actions.submit')}
          onPress={submitHandler}
          disabled={updateProfile.isPending}
          accessibilityLabel={t('fillSellerData.actions.submit')}
          accessibilityHint='Save your business information and continue'
        />
      </Animated.View>
    </AuthScaffold>
  )
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  headerWrapper: { marginBottom: 40 },
  titleSection: { marginBottom: 28 },
  title: { fontSize: theme.fontSizes.title, fontWeight: 'bold', color: theme.colors.textPrimary },
  fieldGroup: { marginBottom: 4 },
  fieldGroupSpaced: { marginTop: 16 },
  submitSection: { marginTop: 24 },
  errorText: { fontSize: theme.fontSizes.sub, color: theme.colors.danger, marginBottom: 8 }
})
