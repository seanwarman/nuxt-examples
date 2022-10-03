<template>
  <a
    class="sr-only sr-only-focusable skip-link"
    :href="`${targetHash}`"
    @click.prevent="handleSkip"
  >
    <slot />
  </a>
</template>

<script>
export default {
  props: {
    targetHash: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleSkip() {
      const target = document.querySelector(`${this.targetHash}`)

      if (target) {
        window.scrollTo(0, target.getBoundingClientRect().y)
        target.focus()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.skip-link {
  position: absolute;
  background-color: white;
  padding: 0.5rem 1rem;
  z-index: 10;
  border: 3px solid $brand-primary;
  outline: 0;
  box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.24);
  text-decoration: underline;
}
</style>
