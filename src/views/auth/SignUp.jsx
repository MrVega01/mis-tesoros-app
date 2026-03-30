import AuthScreenLayout from '../../components/AuthScreenLayout'
import SignUpForm from '../../components/SignUpForm'
import SignUpFooter from '../../components/SignUpFooter'
import useAuthScreen from '../../hooks/useAuthScreen'
import { createSignUpSchema } from '../../schemas/signUp'

export default function SignUpView ({ navigation }) {
  const {
    control,
    handleSubmit,
    isSeller,
    handleRoleChange,
    titleOpacity,
    staggerAnim
  } = useAuthScreen(createSignUpSchema)

  const submitHandler = handleSubmit((formData) => {
    console.log('SignUp submit', { ...formData, isSeller })
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
