import { useTranslation } from 'react-i18next'
import AuthScreenLayout from '../../components/AuthScreenLayout'
import SignUpForm from '../../components/SignUpForm'
import SignUpFooter from '../../components/SignUpFooter'
import useAuthScreen from '../../hooks/useAuthScreen'
import { createSignUpSchema } from '../../schemas/signUp'
import { useRegister } from '../../hooks/useAuth'
import { resolveErrorMessage } from '../../utils/errorMessage'
import { AUTH_ERROR_KEYS, USER_ROLE } from '../../utils/constants'

export default function SignUpView ({ navigation, route }) {
  const { t } = useTranslation()
  const initialIsSeller = route.params?.role === USER_ROLE.SELLER
  const { control, handleSubmit, isSeller, handleRoleChange, titleOpacity, staggerAnim } = useAuthScreen(createSignUpSchema, initialIsSeller)

  const register = useRegister()

  const errorMessage = resolveErrorMessage(register.error, t, AUTH_ERROR_KEYS.signUp)

  const submitHandler = handleSubmit(async ({ email, password }) => {
    try {
      const role = isSeller ? USER_ROLE.SELLER : USER_ROLE.CUSTOMER
      await register.mutateAsync({ email, password, role })
      if (isSeller) {
        navigation.navigate('VerifySeller', { email })
      } else {
        navigation.navigate('FillCustomerData')
      }
    } catch {}
  })

  return (
    <AuthScreenLayout
      staggerAnim={staggerAnim}
      isSeller={isSeller}
      onRoleChange={handleRoleChange}
      form={
        <SignUpForm
          control={control}
          isSeller={isSeller}
          titleOpacity={titleOpacity}
          onSubmit={submitHandler}
          loading={register.isPending}
          errorMessage={errorMessage}
        />
      }
      footer={
        <SignUpFooter
          onLogin={() => navigation.navigate('LogIn')}
          onForgotPassword={() => navigation.navigate('ForgotPassword')}
        />
      }
    />
  )
}
