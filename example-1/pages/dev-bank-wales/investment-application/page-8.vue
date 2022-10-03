<template>
  <b-container class="p-3 dbw">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <div class="header mb-5">
        <h1 class="font-weight-bold mb-3">Application submitted</h1>
      </div>

      <p class="mb-5">Application submitted successfully.</p>
      <p class="mb-5">
        In Live version this will be the end of the journey. For UAT purposes we
        have provided a temporary link to a logged in dashboard.
      </p>
    </b-form>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    this.isLoggedIn();
  },
  methods: {
    isLoggedIn() {
      if (!this.$store.state.Global.LoggedIn) {
        this.$router.push({
          path: "/dev-bank-wales/investment-application/page-1",
          query: {
            loggedIn: false,
            pageVisited: this.$route.path,
          },
        });
      } else {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.header {
  background-color: $dbw-green;
  color: white;
  padding: 20px;
}
</style>
