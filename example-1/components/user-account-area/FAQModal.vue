<template>
  <div class="faq-modal" :class="Brand">
    <h3 class="font-weight-bold mb-3">Got a question?</h3>
    <p class="faq-text">
      Take a look through our Frequently Asked Questions. You’ll find
      explanations on all aspects of the Self Build Wales scheme.
    </p>
    <b-button
      variant="outline-primary"
      href="https://selfbuild.wales/faqs"
      target="_blank"
    >
      Read the FAQ
    </b-button>
  </div>
</template>

<script>
export default {
  computed: {
    Brand: {
      get() {
        return this.$store.getters["Global/Brand"];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.faq-modal {
  max-width: 394px;
  padding: 30px;
  border-radius: 4px;
  background-color: $dbw-white;
  box-shadow: 0 0 35px 0 rgba(0, 0, 0, 0.15);
  @media screen and (min-width: map-get($grid-breakpoints, "lg")) and (max-width: map-get($grid-breakpoints, "xl")) {
    max-width: 335px;
  }
}
.faq-text {
  font-size: 16px;
}
</style>
