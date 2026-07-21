import { useTranslation } from 'react-i18next'
import AuthScreenLayout from '../../components/AuthScreenLayout'
import LoginForm from '../../components/LoginForm'
import LoginFooter from '../../components/LoginFooter'
import useAuthScreen from '../../hooks/useAuthScreen'
import { createLoginSchema } from '../../schemas/login'
import { useLogin, useResendCode } from '../../hooks/useAuth'
import { resolveErrorMessage } from '../../utils/errorMessage'
import { AUTH_ERROR_KEYS, RESEND_CODE_TYPE, USER_ROLE } from '../../utils/constants'

export default function LoginView ({ navigation, route }) {
  const { t } = useTranslation()
  const initialIsSeller = route.params?.role === USER_ROLE.SELLER
  const { control, handleSubmit, isSeller, handleRoleChange, titleOpacity, staggerAnim } = useAuthScreen(createLoginSchema, initialIsSeller)

  const login = useLogin()
  const resendCode = useResendCode()

  const errorMessage = resolveErrorMessage(login.error, t, AUTH_ERROR_KEYS.login)

  const submitHandler = handleSubmit(async ({ email, password }) => {
    try {
      await login.mutateAsync({ email, password })
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
    } catch (err) {
      if (err?.status === 403) {
        resendCode.mutate({ email, type: RESEND_CODE_TYPE.EMAIL_CONFIRMATION })
        navigation.navigate('VerifySeller', { email })
      }
    }
  })

  return (
    <AuthScreenLayout
      staggerAnim={staggerAnim}
      isSeller={isSeller}
      onRoleChange={handleRoleChange}
      form={
        <LoginForm
          control={control}
          isSeller={isSeller}
          titleOpacity={titleOpacity}
          onSubmit={submitHandler}
          loading={login.isPending}
          errorMessage={errorMessage}
        />
      }
      footer={
        <LoginFooter
          onRegister={() => navigation.navigate('SignUp')}
          onForgotPassword={() => navigation.navigate('ForgotPassword')}
        />
      }
    />
  )
}
