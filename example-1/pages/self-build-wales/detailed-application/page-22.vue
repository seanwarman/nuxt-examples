<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <div class="header mb-5">
        <h1 class="font-weight-bold mb-3">Application submitted</h1>
      </div>

      <p class="mb-5">We have sent you a confirmation email.</p>

      <h3 class="font-weight-bold mb-3">What happens next</h3>

      <p class="mb-3">
        The applicants named in the form have been sent a notification that they
        need to give consents for this application to be processed.
      </p>

      <p class="mb-3">
        Once the applicants have done this the application will be sent to the
        Self Build Wales team. They will contact you if they need more
        information.
      </p>

      <p class="mb-3">
        You can expect to hear from them with a decision on your application in
        {{ timeToWait }}.
      </p>

      <p class="mb-3">
        If you need to contact the Self Build Wales team, you can email them at
        <a href="mailto:selfbuildwales.dip@sbw.org"
          >selfbuildwales.dip@sbw.org</a
        >
      </p>

      <p class="mb-5">
        You can review this application, for reference, by signing in to your
        Self Build Wales online account.
      </p>

      <b-button
        variant="outline-primary"
        class="mb-5"
        href="/user-account-area/my-applications"
      >
        Return to account area
      </b-button>
    </b-form>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      timeToWait: "8 weeks time",
    };
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    backWithoutSaving() {
      this.$router.push(`/self-build-wales/detailed-application/page-2`);
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
