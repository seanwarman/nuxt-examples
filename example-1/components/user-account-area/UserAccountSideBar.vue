<template>
  <div>
    <div
      class="hamburger"
      tabindex="1"
      @click="showOptions = !showOptions"
      @keyup.enter="showOptions = !showOptions"
    >
      <img class="hamburger-icon" src="~/assets/icons/bars-solid.svg" />
    </div>

    <div v-if="showOptions" class="fullscreen-options">
      <h4 class="sidebar-header mb-3">
        Logged in as {{ AccountData.FirstName }} {{ AccountData.LastName }}
        <span v-if="AccountData.IFA">(IFA)</span>
      </h4>
      <div
        v-for="(item, index) in sideBarItems"
        :key="index"
        class="item mb-3"
        tabindex="1"
        @click="handleClick(item)"
        @keyup.enter="handleClick(item)"
      >
        <div
          class="
            title-wrapper
            d-flex
            flex-row
            justify-content-between
            align-items-center
          "
        >
          <h4 class="title mb-0">{{ item.title }}</h4>
          <img class="angle" src="~/assets/icons/angle-right-solid-green.svg" />
        </div>
        <div class="underline" />
      </div>
    </div>

    <div class="sidebar-options">
      <h4 class="sidebar-header mb-3">
        Logged in as {{ AccountData.FirstName }} {{ AccountData.LastName }}
        <span v-if="AccountData.IFA">(IFA)</span>
      </h4>
      <div
        v-for="(item, index) in sideBarItems"
        :key="index"
        class="item mb-3"
        tabindex="1"
        @click="handleClick(item)"
        @keyup.enter="handleClick(item)"
      >
        <div
          class="
            title-wrapper
            d-flex
            flex-row
            justify-content-between
            align-items-center
          "
        >
          <h4 class="title mb-0">{{ item.title }}</h4>
          <img class="angle" src="~/assets/icons/angle-right-solid-green.svg" />
        </div>
        <div class="underline" />
      </div>

      <div class="faq-modal-wrapper">
        <FAQModal />
      </div>

      <b-modal v-model="signOutModalOpen" centered>
        <p class="mb-0">Are you sure you want to sign out?</p>
        <template #modal-footer="{ cancel }">
          <b-button variant="outline-primary" @click="cancel()">
            No cancel
          </b-button>
          <b-button variant="primary" @click="signOut"> Yes continue </b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import * as msal from "@azure/msal-browser";
import FAQModal from "~/components/user-account-area/FAQModal.vue";
export default {
  components: {
    FAQModal,
  },
  data() {
    return {
      showOptions: false,
      largeScreen: true,
      screenWidth: null,
      sideBarItems: [
        {
          title: "My applications",
          url: "/user-account-area/my-applications",
        },
        {
          title: "My account details",
          url: "/user-account-area/my-account-details",
        },
        {
          title: "Sign out",
          url: "/",
        },
      ],
      myMSALObj: new msal.PublicClientApplication(this.$authService.msalConfig),
      signOutModalOpen: false,
    };
  },
  computed: {
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
      },
    },
  },
  mounted() {
    this.$root.$on("userTypeUpdated", (data) => {
      this.updateSidebar(data);
    });
  },
  methods: {
    updateSidebar(isIFA) {
      // check array for this item
      const sidebarChecker = (element) =>
        element.title === "View my client’s cases";
      if (isIFA && !this.sideBarItems.some(sidebarChecker)) {
        this.sideBarItems.unshift({
          title: "View my client’s cases",
          url: "/user-account-area/my-applications?data=clientList",
        });
      }
    },
    handleClick(item) {
      if (item.title === "Sign out") this.signOutModalOpen = true;
      else {
        // If the user is clicking these links, they're going
        // to expect the default views of the account area
        this.$store.commit("Global/resetSelectedCase");
        $nuxt.$emit("takeUserToDefaultHomeScreen");
        this.$router.push(item.url);
        this.showOptions = false;
      }
    },
    signOut() {
      const logoutRequest = {
        account: this.myMSALObj.getAccountByHomeId(
          this.AccountData.HomeAccountId
        ),
      };
      this.myMSALObj.logout(logoutRequest);
      // reset all store data
      this.$store.commit("Global/resetGlobalData");
      this.$store.commit("Global/resetSelectedCase");
      this.$store.commit("DecisionInPrinciple/setDIPData", null);
      this.$store.commit("PlotApplication/setPlotApplicationData", null);
      this.$store.commit(
        "DetailedApplication/setDetailedApplicationData",
        null
      );
      this.$store.commit(
        "InvestmentApplication/setInvestmentApplicationData",
        null
      );
      this.$store.commit(
        "InvestmentApplication/setInvestmentApplications",
        null
      );
    },
  },
};
</script>

<style lang="scss">
.hamburger {
  width: 86px;
  height: 86px;
  background-color: $dbw-background-green;
  position: absolute;
  top: -86px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: map-get($grid-breakpoints, "lg")) {
    display: none;
  }
  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: none;
    background-color: $dbw-background-green-hover;
  }
}
.hamburger-icon {
  width: 26px;
  opacity: 0.75;
}
// side-bar
.fullscreen-options {
  height: 100%;
  width: 380px;
  padding: 50px 40px 50px 0;
  background-color: $dbw-background-green;
  position: absolute;
  left: 0;
  width: 100%;
  padding: 30px 20px;
  z-index: 1;
  @media screen and (min-width: map-get($grid-breakpoints, "lg")) {
    display: none;
  }
}
.sidebar-options {
  height: 100%;
  min-height: 800px;
  width: 380px;
  padding: 50px 40px 50px 0;
  background-color: $dbw-background-green;
  @media screen and (max-width: map-get($grid-breakpoints, "lg")) {
    display: none;
  }
  @media screen and (min-width: map-get($grid-breakpoints, "lg")) and (max-width: map-get($grid-breakpoints, "xl")) {
    width: 330px;
  }
}
.sidebar-header {
  padding: 10px 15px;
  color: $dbw-green;
}
.item {
  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: none;
    .title-wrapper {
      background-color: $dbw-background-green-hover;
    }
  }
}
.title-wrapper {
  padding: 10px 15px;
  &:hover {
    background-color: $dbw-background-green-hover;
  }
}
.title {
  color: $dbw-green;
  text-decoration: underline;
}
.angle {
  width: 18px;
}
.underline {
  width: 100%;
  height: 1px;
  background-color: $dbw-light-green;
  opacity: 0.35;
}
.faq-modal-wrapper {
  position: absolute;
  top: 60%;
  margin-left: 15px;
}
</style>
