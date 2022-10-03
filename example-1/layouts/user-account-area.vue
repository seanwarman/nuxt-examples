<template>
  <div class="page-wrapper">
    <PageHeader />
    <PageLoading v-if="loading" />
    <template v-else>
      <div class="position-relative w-100">
        <div class="background position-absolute w-50 h-100" />
        <b-container class="d-flex flex-row">
          <UserAccountSideBar />
          <div class="content" :class="Brand">
            <Nuxt />
          </div>
        </b-container>
      </div>
    </template>
    <PageFooter />
  </div>
</template>

<script>
export default {
  name: "UserAccountArea",
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    Brand: {
      get() {
        return this.$store.getters["Global/Brand"];
      },
    },
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
      },
    },
  },
  mounted() {
    if (!this.AccountData.HomeAccountId) this.$router.push("/");
    else this.loading = false;
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
.background {
  background-color: $dbw-background-green;
  z-index: -1;
  @media screen and (max-width: map-get($grid-breakpoints, "lg")) {
    display: none;
  }
}
.content {
  width: 100%;
  padding: 50px 20px 50px 100px;
  background-color: $dbw-background-grey;
  min-height: calc(100vh - 248px);
  @media screen and (max-width: map-get($grid-breakpoints, "lg")) {
    padding: 50px 0;
    min-height: calc(100vh - 510px);
  }
  @media screen and (min-width: map-get($grid-breakpoints, "lg")) and (max-width: map-get($grid-breakpoints, "xl")) {
    padding: 50px 20px 50px 50px;
  }
}
</style>
