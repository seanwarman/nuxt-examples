<template>
  <b-container class="p-3">
    <div class="green-box flex-column mb-3">
      <h1 class="font-weight-bold mb-3">Application complete</h1>
      <h4 class="font-weight-bold mb-3">Your reference number is</h4>
      <p class="font-weight-bold mb-3">{{ ApplicationReference }}</p>
    </div>
    <p class="mb-3">We have sent you a confirmation email.</p>
    <h3 class="font-weight-bold mb-3">What happens next</h3>
    <p class="mb-3">
      Your application for Decision in Principle has been sent to the Self Build
      Wales team. They will contact you if they need more information.
    </p>
    <p class="mb-3">
      You can expect to hear from them with a decision on your application in X
      weeks time.
    </p>
    <p class="mb-5">
      If you need to contact the Self Build Wales team, you can email them at
      <a class="font-weight-bold" href="mailto:selfbuildwales.dip@sbw.org"
        >selfbuildwales.dip@sbw.org</a
      >
    </p>
    <b-button
      variant="outline-primary"
      class="mb-5"
      href="/user-account-area/my-applications"
    >
      Return to account area
    </b-button>
  </b-container>
</template>

<script>
export default {
  computed: {
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
    ApplicationReference: {
      get() {
        return this.$store.getters["DecisionInPrinciple/ApplicationReference"];
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    numberWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getData() {
      this.$dipGetService.$get("", this.ApiOptions).then((response) => {
        this.$store.commit("DecisionInPrinciple/setDIPData", response);
      });
    },
    navigateBack() {
      this.$store.commit("DecisionInPrinciple/setPageOffSet", 9);
      this.$router.push("/page-9");
    },
  },
};
</script>

<style lang="scss">
.green-box {
  background-color: green;
  color: #f5f5f5;
  font-family: "GDS Transport", arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  font-size: 1rem;
  line-height: 1.25;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-bottom: 15px;
  padding: 35px;
  border: 5px solid transparent;
  text-align: center;
}
</style>
