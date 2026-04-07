import { DAYS } from './constants'

export function buildLocalSchedule (fieldValue) {
  return DAYS.reduce((acc, day) => {
    if (fieldValue && fieldValue[day] !== undefined) {
      acc[day] = {
        checked: true,
        start: fieldValue[day].start ?? '',
        end: fieldValue[day].end ?? ''
      }
    } else {
      acc[day] = { checked: false, start: '', end: '' }
    }
    return acc
  }, {})
}
