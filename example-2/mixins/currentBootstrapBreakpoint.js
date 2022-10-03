/**
 * Mixin to provide the current Bootstrap breakpoint size on `this.currentBreakpoint`
 *
 * N.B. If you change the $grid-breakpoints Bootstrap variables in the SASS/SCSS then
 * you will need to update the values in this file too.
 */

const sizes = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
}

const getQuery = (min, max) => {
  if (typeof window === 'undefined') return {}

  if (min && max) {
    return window.matchMedia(
      `(min-width: ${min}px) and (max-width: ${max - 1}px)`
    )
  } else if (min) {
    return window.matchMedia(`(min-width: ${min}px)`)
  } else {
    return window.matchMedia(`(max-width: ${max}px)`)
  }
}

const queries = Object.entries(sizes).reduce((accum, [key, size], i, arr) => {
  return {
    ...accum,
    [key]: getQuery(size, arr[i + 1] ? arr[i + 1][1] : undefined),
  }
}, {})

const getSize = () => {
  const matchedQuery = Object.entries(queries).find(
    ([size, listener]) => listener.matches
  )
  const size = matchedQuery ? matchedQuery[0] : 'xl'

  return size
}

export default {
  data() {
    return {
      currentBreakpoint: getSize(),
    }
  },
  mounted() {
    Object.values(queries).forEach((q) => q.addListener(this.updateSize))
  },
  destroyed() {
    Object.values(queries).forEach((q) => q.removeListener(this.updateSize))
  },
  methods: {
    updateSize() {
      this.currentBreakpoint = getSize()
    },
  },
}
