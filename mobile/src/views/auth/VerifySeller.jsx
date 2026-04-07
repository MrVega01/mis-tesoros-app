import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { createVerifyCodeSchema } from '../../schemas/verifyCode'
import CodeVerifyLayout from '../../components/CodeVerifyLayout'

export default function VerifySellerView ({ navigation, route }) {
  const { t } = useTranslation()
  const email = route.params?.email ?? ''
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createVerifyCodeSchema(t)),
    defaultValues: { code: '' }
  })
  const submitHandler = handleSubmit((formData) => {
    console.log('VerifySeller submit', { code: formData.code, email })
    navigation.navigate('FillSellerData')
  })
  return (
    <CodeVerifyLayout
      email={email}
      titleKey='codeSent.title'
      subtitleKey='codeSent.subtitle'
      resendLabelKey='codeSent.actions.resend'
      secondaryLinkKey='codeSent.actions.backToSignUp'
      secondaryLinkHint='Navigate back to the sign up screen'
      control={control}
      onSubmit={submitHandler}
      onResend={() => console.log('resend code', { email })}
      onSecondaryLink={() => navigation.replace('SignUp')}
      codePlaceholder='------'
    />
  )
}
