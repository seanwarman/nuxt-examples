<template>
  <main id="main-content" class="page" tabindex="-1">
    <b-row>
      <b-col cols="12" md="8">
        <div class="page-primary">
          <slot />
        </div>
      </b-col>
    </b-row>

    <b-row v-if="hasColumnSlots">
      <b-col cols="12" md="4">
        <slot name="left-col" />
      </b-col>

      <b-col cols="12" md="8">
        <slot name="right-col" />
      </b-col>

      <b-col cols="12" md="8">
        <slot name="alt-left-col" />
      </b-col>

      <b-col cols="12" md="4">
        <slot name="alt-right-col" />
      </b-col>
    </b-row>
  </main>
</template>

<script>
export default {
  computed: {
    hasColumnSlots() {
      return (
        !!this.$slots['left-col'] ||
        !!this.$slots['right-col'] ||
        !!this.$slots['alt-left-col'] ||
        !!this.$slots['alt-right-col']
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 10rem;

  @media screen and (min-width: $breakpoint-md) {
    min-height: 30rem;
  }
}

.page-primary {
  margin-bottom: 1.5rem;
  margin-top: 5rem;
}
</style>
