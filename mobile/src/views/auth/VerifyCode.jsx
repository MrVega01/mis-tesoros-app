import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { createVerifyCodeSchema } from '../../schemas/verifyCode'
import CodeVerifyLayout from '../../components/CodeVerifyLayout'

export default function VerifyCodeView ({ navigation, route }) {
  const { t } = useTranslation()
  const email = route.params?.email ?? ''
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createVerifyCodeSchema(t)),
    defaultValues: { code: '' }
  })
  const submitHandler = handleSubmit((formData) => {
    console.log('VerifyCode submit', { code: formData.code, email })
    navigation.navigate('ResetPassword', { email })
  })
  return (
    <CodeVerifyLayout
      email={email}
      titleKey='verifyCode.title'
      subtitleKey='verifyCode.subtitle'
      resendLabelKey='verifyCode.actions.resend'
      secondaryLinkKey='verifyCode.actions.wrongEmail'
      secondaryLinkHint='Navigate back to the reset password screen'
      control={control}
      onSubmit={submitHandler}
      onResend={() => console.log('resend', { email })}
      onSecondaryLink={() => navigation.navigate('ForgotPassword')}
      codePlaceholder='-----'
    />
  )
}
