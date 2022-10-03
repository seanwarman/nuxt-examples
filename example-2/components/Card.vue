<template>
  <div
    :class="[
      'card-base',
      type.bordered && 'bordered',
      type.divided && 'divided',
      type.disciplines && 'disciplines',
    ]"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      bordered: {
        type: Boolean,
      },
      divided: {
        type: Boolean,
      },
      disciplines: {
        type: Boolean,
      },
      type: Object,
      default: () => ({
        bordered: true,
      }),
    },
  },
}
</script>

<style lang="scss" scoped>
.card-base.bordered {
  border-radius: 10px;
  border: 1px solid $card-border-color;
  transition: box-shadow 300ms ease 100ms;
  padding: 1rem 24px 1rem;
  margin: 0.5rem 0;
  color: $body-color-subdued;
}

.card-base.divided {
  padding: 1.5rem 0;
  transition: box-shadow 300ms ease 100ms;
  border-bottom: 1px solid $brand-border-color;
  color: $body-color-subdued;
}

.card-base.divided:hover,
.card-base.divided:focus-within {
  box-shadow: 0 5px 0 0 rgba(96, 96, 96, 0.24);
}

.card-base.bordered:hover,
.card-base.bordered:focus-within {
  box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.24);
}
</style>
