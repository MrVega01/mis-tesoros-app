import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { createVerifyCodeSchema } from '../../schemas/verifyCode'
import CodeVerifyLayout from '../../components/CodeVerifyLayout'
import { useVerifyEmail, useResendCode } from '../../hooks/useAuth'
import { resolveErrorMessage } from '../../utils/errorMessage'
import { AUTH_ERROR_KEYS, RESEND_CODE_TYPE } from '../../utils/constants'

export default function VerifySellerView ({ navigation, route }) {
  const { t } = useTranslation()
  const email = route.params?.email ?? ''
  const [resendFeedback, setResendFeedback] = useState(null)

  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createVerifyCodeSchema(t)),
    defaultValues: { code: '' }
  })

  const verifyEmail = useVerifyEmail()
  const resendCode = useResendCode()

  const errorMessage = resolveErrorMessage(verifyEmail.error, t, AUTH_ERROR_KEYS.verifySeller)

  const submitHandler = handleSubmit(async ({ code }) => {
    if (verifyEmail.isPending) return
    try {
      await verifyEmail.mutateAsync({ email, code })
      navigation.navigate('FillSellerData')
    } catch {}
  })

  const onResend = async () => {
    setResendFeedback(null)
    try {
      await resendCode.mutateAsync({ email, type: RESEND_CODE_TYPE.EMAIL_CONFIRMATION })
      setResendFeedback(t('codeSent.resendSuccess'))
    } catch {}
  }

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
      onResend={onResend}
      onSecondaryLink={() => navigation.replace('SignUp')}
      codePlaceholder='------'
      errorMessage={errorMessage}
      resendFeedback={resendFeedback}
    />
  )
}
