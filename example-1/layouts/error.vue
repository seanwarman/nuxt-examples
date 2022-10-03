<template>
  <b-container class="h-100">
    <div class="error-wrapper">
      <template v-if="error.statusCode === 404">
        <h1 class="font-weight-bold mt-5">404</h1>
        <h4 class="font-weight-bold">Page not found.</h4>
      </template>
      <template v-else>
        <h1 class="font-weight-bold mt-5">Oops!</h1>
        <h4 class="font-weight-bold">There's been a problem.</h4>
      </template>
      <p class="mb-5">
        The page you are looking for doesn’t exist or an error occured. Go back
        to the
        <NuxtLink v-if="!$store.state.Global.LoggedIn" to="/">Login</NuxtLink>
        <NuxtLink v-else to="/user-account-area/my-applications"
          >My Applications</NuxtLink
        >
        page.
      </p>
    </div>
  </b-container>
</template>

<script>
export default {
  layout: "error",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.error-wrapper {
  margin: 0;
  @media screen and (min-width: map-get($grid-breakpoints, "lg")) {
    margin: 0 200px;
  }
}
</style>
