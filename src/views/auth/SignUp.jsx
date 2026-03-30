import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import AuthScreenLayout from '../../components/AuthScreenLayout'
import SignUpForm from '../../components/SignUpForm'
import StyledTouchableLink from '../../components/StyledTouchableLink'
import useAuthScreen from '../../hooks/useAuthScreen'
import { createSignUpSchema } from '../../schemas/signUp'

function SignUpFooter ({ onLogin, onForgotPassword }) {
  const { t } = useTranslation()

  return (
    <View style={styles.bottomRow}>
      <StyledTouchableLink
        title={t('signUp.actions.login')}
        onPress={onLogin}
        accessibilityLabel={t('signUp.actions.login')}
        accessibilityHint='Navigate to the login screen'
      />
      <StyledTouchableLink
        title={t('signUp.actions.forgotPassword')}
        onPress={onForgotPassword}
        accessibilityLabel={t('signUp.actions.forgotPassword')}
        accessibilityHint='Navigate to the forgot password screen'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32
  }
})

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
