<template>
  <div>
    <div class="header-top">
      <b-container class="d-flex align-items-center h-100">
        <img
          class="header-top-logo"
          src="~/assets/icons/welsh-gov-initiative-logo.png"
        />
        <language-switcher class="ml-auto" />
      </b-container>
    </div>
    <div class="header-bottom">
      <b-container class="d-flex flex-column justify-content-start h-100">
        <img
          v-if="!loading"
          class="header-bottom-logo"
          :src="require(`~/assets/icons/${LogoPath}`)"
          @click="goHome"
        />
        <div class="divider-line w-100" />
      </b-container>
    </div>
  </div>
</template>

<script>
import LanguageSwitcher from "./LanguageSwitcher.vue";
export default {
  components: { LanguageSwitcher },
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
    LogoPath: {
      get() {
        if (this.Brand === "sbw") return "self-build-wales-logo.svg";
        else return "dev-bank-wales-logo.png";
      },
    },
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    goHome() {
      $nuxt.$emit("takeUserToDefaultHomeScreen");
      this.$store.commit("Global/resetSelectedCase");
      this.$router.push("/user-account-area/my-applications");
    },
  },
};
</script>

<style lang="scss">
.header-top {
  height: 50px;
  background-color: #3c3c3c;
}
.header-top-logo {
  height: 30px;
}
.header-bottom-logo {
  height: 64px;
  width: 147px;
  margin: 25px 0 20px 0;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: map-get($grid-breakpoints, "lg")) {
    height: 53px;
    width: 122px;
    margin: 16px 0;
  }
}
.divider-line {
  height: 1px;
  background-color: #3c3c3c;
  opacity: 0.1;
}
</style>
