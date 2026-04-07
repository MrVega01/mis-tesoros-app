import { useEffect } from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import es from '../locales/es.json'

export function useI18n () {
  if (i18n.isInitialized) {
    return Promise.resolve(i18n)
  }

  useEffect(() => {
    i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: 'v4',
        lng: 'es',
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false
        },
        resources: {
          en: {
            translation: en
          },
          es: {
            translation: es
          }
        }
      })
  })
}
