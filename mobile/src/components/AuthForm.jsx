import { Animated, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { theme } from '../theme'
import StyledText from './StyledText'
import StyledTextInputWithLabel from './StyledTextInputWithLabel'
import StyledTouchableHighlight from './StyledTouchableHighlight'

export default function AuthForm ({ control, isSeller, titleOpacity, onSubmit, namespace, errorMessage = null, loading = false }) {
  const { t } = useTranslation()

  return (
    <View style={styles.formSection}>
      <Animated.View style={{ opacity: titleOpacity }}>
        <StyledText style={styles.title}>
          {isSeller ? t(`${namespace}.title.seller`) : t(`${namespace}.title.client`)}
        </StyledText>
      </Animated.View>

      <View style={styles.accentBar} />

      <StyledTextInputWithLabel
        control={control}
        label={t('login.fields.email')}
        name='email'
        placeholder={t('login.fields.email')}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <StyledTextInputWithLabel
        control={control}
        label={t('login.fields.password')}
        name='password'
        placeholder={t('login.fields.password')}
        secureTextEntry
      />

      {errorMessage ? (
        <StyledText style={styles.errorMessage}>{errorMessage}</StyledText>
      ) : null}

      <StyledTouchableHighlight
        title={t(`${namespace}.actions.submit`)}
        onPress={onSubmit}
        style={styles.submitButton}
        disabled={loading}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  formSection: {
    flex: 1
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4
  },
  accentBar: {
    width: 40,
    height: 3,
    backgroundColor: theme.appBar.primary,
    borderRadius: 2,
    marginBottom: 28
  },
  submitButton: {
    marginTop: 8
  },
  errorMessage: {
    color: theme.colors.danger,
    fontSize: theme.fontSizes.sub,
    marginBottom: 8
  }
})
