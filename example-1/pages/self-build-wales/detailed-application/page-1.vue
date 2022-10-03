<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-5">SBW application form</h1>

      <h3 class="font-weight-bold mb-5">Before you begin</h3>

      <p class="mb-5 font-italic">
        Guidance text here suitable for IFAs and mortgage advisers,
        <br />
        Also for any customers completing it themselves without an IFA.
      </p>

      <p class="mb-5 font-italic">
        Training you have done etc
        <br />
        Information you will need etc
        <br />
        You can save and resume etc
        <br />
        Contact the Self Build Team etc
      </p>

      <b-button variant="outline-primary" class="mr-2" @click="navigateBack">
        Back
      </b-button>
      <b-button variant="primary" class="btn-primary" @click="startApplication">
        Start application
      </b-button>
    </template>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    startApplication() {
      this.loading = true;
      this.$detailedApplicationGetService
        .$get("", this.ApiOptions)
        .then((response) => {
          this.$store.commit(
            "DetailedApplication/setDetailedApplicationData",
            response
          );
          this.$router.push(`/self-build-wales/detailed-application/page-2`);
        });
    },
    navigateBack() {
      this.$router.push("/user-account-area/my-applications");
    },
  },
};
</script>

<style lang="scss"></style>
