import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useFocusEffect } from '@react-navigation/native'
import useStaggerAnimation from './useStaggerAnimation'

export default function useAuthScreen (createSchema) {
  const { t } = useTranslation()
  const [isSeller, setIsSeller] = useState(false)

  const { control, handleSubmit, reset } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(createSchema(t)),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useFocusEffect(
    useCallback(() => {
      return () => {
        reset()
        setIsSeller(false)
      }
    }, [reset])
  )

  const { staggerAnim, titleOpacity, animateTitleChange } = useStaggerAnimation()

  const handleRoleChange = (val) => {
    animateTitleChange()
    setIsSeller(val)
  }

  return {
    control,
    handleSubmit,
    isSeller,
    handleRoleChange,
    titleOpacity,
    staggerAnim
  }
}
