import dayjs from 'dayjs'

export const DISPLAY_DATE_FORMAT = 'MMM YYYY'
export const INPUT_DATE_FORMAT = 'DD/MM/YYYY'
export const OUTPUT_DATE_FORMAT = 'YYYY-MM-DD'
export const ARCHIVE_DEFAULT_FROM_DATE = new Date('2001-02-01')

export const ARCHIVE_DEFAULT_FROM_DATE_OUTPUT_FORMAT = dayjs(
  ARCHIVE_DEFAULT_FROM_DATE
).format(OUTPUT_DATE_FORMAT)
export const ARCHIVE_DEFAULT_FROM_DATE_INPUT_FORMAT = dayjs(
  ARCHIVE_DEFAULT_FROM_DATE
).format(INPUT_DATE_FORMAT)

export default {
  displayDateFormat: DISPLAY_DATE_FORMAT,
}
