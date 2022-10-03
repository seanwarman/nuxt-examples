let isFirstLoad = true

export default {
  mounted() {
    const { focusTarget } = this.$refs

    if (!isFirstLoad && focusTarget) {
      if (focusTarget.focus) {
        focusTarget.focus()
      } else if (focusTarget.$el && focusTarget.$el.focus) {
        focusTarget.$el.focus()
      }
    }

    isFirstLoad = false
  },
}
