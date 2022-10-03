<template>
  <b-container class="p-3">
    <div>
      <h1 class="font-weight-bold mb-5 text-capitalize-first">
        {{ $t("decision_in_principle") }} {{ $t("application_form") }}
      </h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="$t('dip_application_introduction')" />

      <b-row no-gutters>
        <b-button variant="outline-primary" class="mr-2" @click="navigateBack">
          Back
        </b-button>
        <b-button variant="primary" @click="navigateForward">
          Start now
        </b-button>
        <img
          v-if="loading"
          class="loading-wheel ml-3"
          src="/loadingwheel3.gif"
        />
      </b-row>
    </div>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
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
    console.log("APIOptions: ", this.APIOptions);
  },
  methods: {
    navigateForward() {
      this.loading = true;
      this.$dipGetService.$get("", this.ApiOptions).then((response) => {
        this.$store.commit("DecisionInPrinciple/setDIPData", response);
        this.$router.push(
          `/self-build-wales/decision-in-principle/page-${
            response.PageOffSet === 1 ? 2 : response.PageOffSet
          }`
        );
        this.loading = false;
      });
    },
    navigateBack() {
      this.$router.push("/user-account-area/my-applications");
    },
  },
};
</script>

<style lang="scss">
.loading-wheel {
  width: 40px;
  height: 40px;
  filter: hue-rotate(160deg);
}
</style>
