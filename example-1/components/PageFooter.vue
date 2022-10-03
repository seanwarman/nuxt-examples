<template>
  <div>
    <div
      v-if="$route.path.includes('/user-account-area/')"
      class="faq-modal-footer"
    >
      <FAQModal />
    </div>
    <div class="footer">
      <b-container class="d-flex justify-content-end align-items-center h-100">
        <img
          class="footer-logo"
          src="~/assets/icons/dev-bank-wales-logo-white.png"
        />
      </b-container>
    </div>
  </div>
</template>

<script>
import FAQModal from "~/components/user-account-area/FAQModal.vue";
export default {
  components: {
    FAQModal,
  },
};
</script>

<style lang="scss">
.footer {
  height: 88px;
  background-color: #3c3c3c;
}
.footer-logo {
  width: 120px;
}
.faq-modal-footer {
  padding: 20px;
  background-color: $dbw-background-green;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: map-get($grid-breakpoints, "lg")) {
    display: none;
  }
}
</style>
