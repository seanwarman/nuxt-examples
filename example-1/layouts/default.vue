<template>
  <div class="page-wrapper">
    <PageHeader />
    <b-container class="p-3 mt-5 mb-5 default-container">
      <Nuxt />
    </b-container>
    <PageFooter />
  </div>
</template>

<script>
export default {
  name: "Default",
  data() {
    return {
      params: {
        language: this.$route.query.lang || this.$i18n.locale,
      },
    };
  },
  mounted() {
    this.setLanguageStateFromParam();
  },
  methods: {
    switchLanguage(languageCode) {
      this.$i18n.setLocale(languageCode);
      this.params.language = languageCode;
      this.$store.commit("Global/setLanguage", languageCode);
      document.documentElement.setAttribute("lang", languageCode);
    },
    setLanguageStateFromParam() {
      if (this.params.language !== this.$i18n.locale) {
        this.switchLanguage(this.params.language);
      }
    },
  },
};
</script>

<style lang="scss">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
}
.default-container {
  min-height: calc(100vh - 340px);
}
</style>
