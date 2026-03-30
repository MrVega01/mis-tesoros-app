import AuthScreenLayout from '../../components/AuthScreenLayout'
import LoginForm from '../../components/LoginForm'
import LoginFooter from '../../components/LoginFooter'
import useAuthScreen from '../../hooks/useAuthScreen'
import { createLoginSchema } from '../../schemas/login'

export default function LoginView ({ navigation }) {
  const {
    control,
    handleSubmit,
    isSeller,
    handleRoleChange,
    titleOpacity,
    staggerAnim
  } = useAuthScreen(createLoginSchema)

  const submitHandler = handleSubmit((formData) => {
    console.log('Login submit', { ...formData, isSeller })
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
