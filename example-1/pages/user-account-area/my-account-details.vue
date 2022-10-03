<template>
  <div>
    <h3 class="font-weight-bold mb-5">Account details</h3>

    <p><b>First name:</b> {{ AccountData.FirstName }}</p>

    <p><b>Last name:</b> {{ AccountData.LastName }}</p>

    <p><b>Mobile number:</b> {{ AccountData.MobileNumber }}</p>

    <p><b>Email:</b> {{ AccountData.Email }}</p>

    <p class="font-weight-bold mb-1">Home address:</p>
    <p>
      {{ AccountData.StreetAddress }}
      <br />
      {{ AccountData.City }}
      <br />
      {{ AccountData.Country }}
      <br />
      {{ AccountData.PostCode }}
    </p>

    <p>
      <b>Language preference for written communication:</b>
      {{ AccountData.LanguagePreference }}
    </p>
  </div>
</template>

<script>
export default {
  layout: "user-account-area",
  computed: {
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
      },
    },
  },
};
</script>

<style lang="scss"></style>
