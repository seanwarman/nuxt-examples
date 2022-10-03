<template>
  <div>
    <h2 role="status" aria-live="polite"><slot /></h2>

    <slot name="order-info" />
    <Divider variant="thick" class="mb-4" />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
h2 {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0;
}

p,
span {
  font-size: 0.875rem;
  color: $body-color-subdued;
}
</style>
