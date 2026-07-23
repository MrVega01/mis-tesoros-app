import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './src/utils/queryClient'
import RootNavigator from './src/navigation/RootNavigator'
import { useI18n } from './src/hooks/useI18n'

export default function App () {
  useI18n()

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar style='light' />
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  )
}
