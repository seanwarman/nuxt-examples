<template>
  <div
    :class="{ divider: true, 'divider--thick': variant === 'thick' }"
    role="presentation"
  />
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: undefined,
    },
  },
}
</script>

<style lang="scss" scoped>
.divider {
  border-top: 1px solid;
}

.divider.divider--thick {
  border-top-width: 4px;
}
</style>
