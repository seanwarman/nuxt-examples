<template>
  <b-button-group size="sm">
    <b-button
      :variant="$i18n.locale === 'en' ? selectedVariant : unselectedVariant"
      @click="switchLanguage('en')"
      >En 🏴󠁧󠁢󠁥󠁮󠁧󠁿</b-button
    >
    <b-button
      :variant="$i18n.locale === 'cy' ? selectedVariant : unselectedVariant"
      @click="switchLanguage('cy')"
      >Cy 🏴󠁧󠁢󠁷󠁬󠁳󠁿</b-button
    >
  </b-button-group>
</template>

<script>
export default {
  props: {
    selectedVariant: { type: String, default: "light" },
    unselectedVariant: { type: String, default: "outline-light" },
  },
  methods: {
    switchLanguage(languageCode) {
      this.$i18n.setLocale(languageCode);
      this.$store.commit("Global/setLanguage", languageCode);
      document.documentElement.setAttribute("lang", languageCode);
    },
  },
};
</script>
