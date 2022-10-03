<template>
  <b-alert :variant="variant" :show="show"><slot /></b-alert>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'info',
    },
  },
}
</script>

<style lang="scss" scoped>
.alert-info {
  color: $alert-info-color;
  background-color: $alert-info-bg-color;
  border-color: $alert-info-border-color;
}

.alert ::v-deep a,
.alert ::v-deep a:link,
.alert ::v-deep a:visited {
  color: currentColor;
  text-decoration: underline;
}

.alert ::v-deep a {
  &:focus,
  &:focus-visible {
    background: $brand-primary;
    color: #ffffff;
    box-shadow: 0 0 0 4px $brand-primary;
    outline: none;
  }
}
</style>
