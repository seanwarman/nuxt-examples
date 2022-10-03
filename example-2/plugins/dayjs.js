import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export default function(ctx, inject) {
  ctx.$dayjs = dayjs
  inject('dayjs', dayjs)
}
