<template>
  <b-button :to="to" :href="href" :variant="variant" @click="handleClick"
    ><slot
  /></b-button>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: 'primary',
    },
    to: {
      type: String,
      default: undefined,
    },
    href: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>

<style lang="scss" scoped>
.btn {
  min-width: $btn-min-width;
}

.btn.disabled,
.btn:disabled {
  opacity: 1;
  cursor: default;
}

.btn-primary:hover {
  background-color: $brand-primary-hover;
}

.btn-primary:not(:disabled):not(.disabled):active,
.btn-primary:not(:disabled):not(.disabled).active,
.show > .btn-primary.dropdown-toggle {
  background-color: $btn-primary-active-color;
}

.btn-secondary {
  border-color: $body-color;
}

.btn-secondary:hover {
  background-color: $btn-secondary-hover-color;
  color: white;
  border-color: $btn-secondary-hover-border-color;
}

.btn-secondary:not(:disabled):not(.disabled):active,
.btn-secondary:not(:disabled):not(.disabled).active,
.show > .btn-secondary.dropdown-toggle {
  background-color: $body-color-subdued;
  border-color: $body-color-subdued;
  color: white;
  box-shadow: 0 0 0 0.2rem $btn-secondary-disabled-shadow-color;
}

.btn-secondary:focus,
.btn-secondary.focus {
  background-color: $btn-secondary-hover-color;
  border-color: $btn-secondary-hover-color;
  color: white;
}

.btn.disabled,
.btn:disabled {
  background-color: $btn-disabled-bg-color;
  border-color: $btn-disabled-bg-color;
  color: $body-color-subdued;
}
</style>
