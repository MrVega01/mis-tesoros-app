import { useState } from 'react'
import {
  View,
  Pressable,
  StyleSheet,
  Animated
} from 'react-native'
import { useController } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import StyledText from './StyledText'
import CheckboxIconSVG from '../img/CheckboxIcon'
import { theme } from '../theme'
import { makeLocalDate, dateToIsoTime, isoTimeToDate, formatDisplayTime } from '../utils/dateHelpers'
import { DAYS } from '../utils/constants'
import { buildLocalSchedule } from '../utils/scheduleInputHelpers'
import TimePickerModal from './TimePickerModal'
import Accordion from './Accordion'
import useStaggerAnimation, { section, STAGGER_DELAY, SECTION_DURATION } from '../hooks/useStaggerAnimation'

export default function ScheduleInput ({ label, control, name, style }) {
  const { t } = useTranslation()
  const { field, fieldState } = useController({ control, name })

  const [localSchedule, setLocalSchedule] = useState(() => buildLocalSchedule(field.value))
  const [timePicker, setTimePicker] = useState({ visible: false, day: null, field: null, initialDate: new Date() })

  const { staggerAnim } = useStaggerAnimation()

  const hasError = !!fieldState.error

  const checkedCount = Object.values(localSchedule).filter(e => e.checked).length

  const summaryText = t('fillSellerData.schedule.triggerSummary', { count: checkedCount })

  const handleAccordionToggle = (newOpen) => {
    if (newOpen) {
      const totalDuration = (DAYS.length - 1) * STAGGER_DELAY + SECTION_DURATION
      staggerAnim.setValue(0)
      Animated.timing(staggerAnim, {
        toValue: totalDuration,
        duration: totalDuration,
        useNativeDriver: true
      }).start()
    }
  }

  const toggleDay = (day) => {
    setLocalSchedule((prev) => {
      const current = prev[day]
      const nowChecked = !current.checked
      const updated = {
        ...prev,
        [day]: {
          checked: nowChecked,
          start: nowChecked ? (current.start || dateToIsoTime(makeLocalDate(9))) : '',
          end: nowChecked ? (current.end || dateToIsoTime(makeLocalDate(18))) : ''
        }
      }
      const output = DAYS.reduce((acc, d) => {
        const e = updated[d]
        if (e.checked) acc[d] = { start: e.start, end: e.end }
        return acc
      }, {})
      field.onChange(Object.keys(output).length === 0 ? null : output)
      return updated
    })
  }

  return (
    <View style={[styles.wrapper, style]}>
      <StyledText style={styles.floatingLabel}>{label}</StyledText>

      <Accordion
        style={[styles.inputBox, hasError && styles.inputBoxError]}
        headerStyle={styles.triggerRow}
        onToggle={handleAccordionToggle}
        accessibilityLabel={label}
        header={<StyledText style={styles.summaryText}>{summaryText}</StyledText>}
      >
        <View>
          {DAYS.map((day, index) => {
            const entry = localSchedule[day]
            return (
              <Animated.View key={day} style={section(staggerAnim, index)}>
                <Pressable
                  onPress={() => toggleDay(day)}
                  style={[styles.dayRow, entry.checked && styles.dayRowChecked]}
                  accessibilityRole='checkbox'
                  accessibilityLabel={t(`fillSellerData.schedule.days.${day}`)}
                  accessibilityState={{ checked: entry.checked }}
                >
                  <CheckboxIconSVG
                    checked={entry.checked}
                    color={entry.checked ? theme.colors.accent : theme.colors.textSecondary}
                    size={20}
                  />
                  <StyledText style={styles.dayLabel}>
                    {t(`fillSellerData.schedule.days.${day}`)}
                  </StyledText>
                </Pressable>

                {entry.checked && (
                  <View style={styles.timeRow}>
                    <View style={styles.timeField}>
                      <StyledText style={styles.timeLabel}>
                        {t('fillSellerData.schedule.timeLabels.start')}
                      </StyledText>
                      <Pressable
                        onPress={() => {
                          const existing = entry.start
                          setTimePicker({ visible: true, day, field: 'start', initialDate: existing ? isoTimeToDate(existing) : makeLocalDate(9) })
                        }}
                        style={styles.timeButton}
                        accessibilityRole='button'
                        accessibilityLabel={`${t(`fillSellerData.schedule.days.${day}`)} ${t('fillSellerData.schedule.timeLabels.start')}`}
                        accessibilityHint='Opens time picker'
                      >
                        <StyledText style={styles.timeButtonText}>
                          {entry.start ? formatDisplayTime(isoTimeToDate(entry.start)) : '--:--'}
                        </StyledText>
                      </Pressable>
                    </View>

                    <View style={styles.timeField}>
                      <StyledText style={styles.timeLabel}>
                        {t('fillSellerData.schedule.timeLabels.end')}
                      </StyledText>
                      <Pressable
                        onPress={() => {
                          const existing = entry.end
                          setTimePicker({ visible: true, day, field: 'end', initialDate: existing ? isoTimeToDate(existing) : makeLocalDate(18) })
                        }}
                        style={styles.timeButton}
                        accessibilityRole='button'
                        accessibilityLabel={`${t(`fillSellerData.schedule.days.${day}`)} ${t('fillSellerData.schedule.timeLabels.end')}`}
                        accessibilityHint='Opens time picker'
                      >
                        <StyledText style={styles.timeButtonText}>
                          {entry.end ? formatDisplayTime(isoTimeToDate(entry.end)) : '--:--'}
                        </StyledText>
                      </Pressable>
                    </View>
                  </View>
                )}
              </Animated.View>
            )
          })}
        </View>
      </Accordion>

      {fieldState.error && (
        <StyledText style={styles.errorText}>{fieldState.error.message}</StyledText>
      )}

      <TimePickerModal
        visible={timePicker.visible}
        initialValue={timePicker.initialDate}
        onConfirm={(isoTime) => {
          setLocalSchedule(prev => {
            const updated = {
              ...prev,
              [timePicker.day]: {
                ...prev[timePicker.day],
                [timePicker.field]: isoTime
              }
            }
            const output = DAYS.reduce((acc, d) => {
              const e = updated[d]
              if (e.checked) acc[d] = { start: e.start, end: e.end }
              return acc
            }, {})
            field.onChange(Object.keys(output).length === 0 ? null : output)
            return updated
          })
          setTimePicker(p => ({ ...p, visible: false }))
        }}
        onClose={() => setTimePicker(p => ({ ...p, visible: false }))}
        confirmLabel={t('fillSellerData.schedule.done')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    position: 'relative'
  },
  floatingLabel: {
    position: 'absolute',
    top: 0,
    left: 12,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sub,
    zIndex: 2
  },
  inputBox: {
    marginTop: 6,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  inputBoxError: {
    borderColor: theme.colors.danger
  },
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 18
  },
  summaryText: {
    flex: 1,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textSecondary
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.fontSizes.sub,
    marginTop: 4,
    marginBottom: 6,
    paddingHorizontal: 2
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12
  },
  dayRowChecked: {
    backgroundColor: 'rgba(221, 133, 31, 0.08)'
  },
  dayLabel: {
    flex: 1,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary
  },
  timeRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: 'rgba(221, 133, 31, 0.08)'
  },
  timeField: {
    flex: 1
  },
  timeLabel: {
    fontSize: theme.fontSizes.sub,
    color: theme.colors.textSecondary,
    marginBottom: 4
  },
  timeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timeButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body
  }
})
