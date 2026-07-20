import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { createVerifyCodeSchema } from '../../schemas/verifyCode'
import CodeVerifyLayout from '../../components/CodeVerifyLayout'
import { useResendCode } from '../../hooks/useAuth'
import { useVerifyResetCode } from '../../hooks/usePasswordReset'
import { resolveErrorMessage } from '../../utils/errorMessage'
import { AUTH_ERROR_KEYS, RESEND_CODE_TYPE } from '../../utils/constants'

export default function VerifyCodeView ({ navigation, route }) {
  const { t } = useTranslation()
  const email = route.params?.email ?? ''
  const [resendFeedback, setResendFeedback] = useState(null)

  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createVerifyCodeSchema(t)),
    defaultValues: { code: '' }
  })

  const verifyResetCode = useVerifyResetCode()
  const resendCode = useResendCode()

  const errorMessage = resolveErrorMessage(verifyResetCode.error, t, AUTH_ERROR_KEYS.verifyCode)

  const submitHandler = handleSubmit(async ({ code }) => {
    if (verifyResetCode.isPending) return
    try {
      const data = await verifyResetCode.mutateAsync({ email, code })
      navigation.navigate('ResetPassword', { resetToken: data.resetToken })
    } catch {}
  })

  const onResend = async () => {
    setResendFeedback(null)
    try {
      await resendCode.mutateAsync({ email, type: RESEND_CODE_TYPE.PASSWORD_RESET })
      setResendFeedback(t('verifyCode.resendSuccess'))
    } catch {}
  }

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
      onResend={onResend}
      onSecondaryLink={() => navigation.navigate('ForgotPassword')}
      codePlaceholder='------'
      errorMessage={errorMessage}
      resendFeedback={resendFeedback}
    />
  )
}
