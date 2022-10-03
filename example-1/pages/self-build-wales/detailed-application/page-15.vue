<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Solicitor details</h1>

      <p class="mb-3">
        Give details of the solicitor who will carry out the land purchase of
        the plot.
      </p>

      <p class="font-weight-bold mb-2">Company name</p>
      <div class="mb-3">
        <b-form-invalid-feedback
          id="solicitorCompanyName-feedback"
          :state="validateState('solicitorCompanyName')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="solicitorCompanyName"
          ref="solicitorCompanyName"
          v-model="$v.solicitorCompanyName.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('solicitorCompanyName')"
          class="w-50 mb-1"
          type="text"
        />
      </div>

      <p class="font-weight-bold mb-2">Company address</p>
      <AddressFinder
        ref="addressFinder"
        :address="solicitorCompanyAddress"
        :disabled="ReadOnlyDA"
      />

      <p class="font-weight-bold mb-2">Contact name</p>
      <div class="mb-3">
        <b-form-invalid-feedback
          id="solicitorContactName-feedback"
          :state="validateState('solicitorContactName')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="solicitorContactName"
          ref="solicitorContactName"
          v-model="$v.solicitorContactName.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('solicitorContactName')"
          class="w-50 mb-1"
          type="text"
        />
      </div>

      <p class="font-weight-bold mb-2">Contact phone number</p>
      <div class="mb-3">
        <b-form-invalid-feedback
          id="solicitorContactNumber-feedback"
          :state="validateState('solicitorContactNumber')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="solicitorContactNumber"
          ref="solicitorContactNumber"
          v-model="$v.solicitorContactNumber.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('solicitorContactNumber')"
          class="w-50 mb-1"
          type="text"
        />
      </div>

      <p class="font-weight-bold mb-2">Contact email</p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="solicitorContactEmail-feedback"
          :state="validateState('solicitorContactEmail')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="solicitorContactEmail"
          ref="solicitorContactEmail"
          v-model="$v.solicitorContactEmail.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('solicitorContactEmail')"
          class="w-50 mb-1"
          type="email"
        />
      </div>

      <div class="d-flex flex-column">
        <b-button
          variant="primary"
          class="align-self-start mb-3"
          :disabled="ReadOnlyDA || requestInProgress"
          @click="save"
        >
          Save
        </b-button>
        <b-button
          variant="outline-primary"
          class="align-self-start"
          :disabled="requestInProgress"
          @click="backWithoutSaving"
        >
          Back without saving
        </b-button>
      </div>
    </b-form>
  </b-container>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required } from "vuelidate/lib/validators";
import {
  validateForm,
  validateAddress,
  isPhoneNumber,
  isEmail,
} from "~/lib/validation";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      solicitorCompanyName: null,
      solicitorCompanyAddress: {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      },
      solicitorContactName: null,
      solicitorContactNumber: null,
      solicitorContactEmail: null,
    };
  },
  computed: {
    ReadOnlyDA: {
      get() {
        return this.$store.getters["Global/ReadOnlyDA"];
      },
    },
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
    DetailedApplicationData: {
      get() {
        return this.$store.getters[
          "DetailedApplication/DetailedApplicationData"
        ];
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.DetailedApplicationData) {
        this.mapStoreValuesToComponentState();
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "DetailedApplication/setDetailedApplicationData",
              response
            );
            this.mapStoreValuesToComponentState();
            this.loading = false;
          });
      }
    },
    mapStoreValuesToComponentState() {
      const s = this.DetailedApplicationData.Solicitor;
      this.solicitorCompanyName = s.CompanyName;
      this.solicitorCompanyAddress.address1 = s.Address1;
      this.solicitorCompanyAddress.address2 = s.Address2;
      this.solicitorCompanyAddress.address3 = s.Address3;
      this.solicitorCompanyAddress.city = s.City;
      this.solicitorCompanyAddress.postCode = s.PostCode;
      this.solicitorContactName = s.CompanyContact;
      this.solicitorContactNumber = s.CompanyContactPhone;
      this.solicitorContactEmail = s.CompanyContactEmail;
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    save() {
      this.requestInProgress = true;
      // validate form
      if (validateForm(this.$v, this)) {
        this.requestInProgress = false;
        return;
      }
      if (validateAddress(this.$refs.addressFinder)) {
        this.requestInProgress = false;
        return;
      }
      // map address to component state
      const sa = this.solicitorCompanyAddress;
      const af = this.$refs.addressFinder;
      sa.address1 = af.address1;
      sa.address2 = af.address2;
      sa.address3 = af.address3;
      sa.city = af.city;
      sa.postCode = af.postCode;
      // map data to store
      this.$store.commit("DetailedApplication/setSolicitorDetails", this);
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 15,
        completed: true,
      });
      // send store data to db
      this.$detailedApplicationPostService
        .$post("", this.DetailedApplicationData, this.ApiOptions)
        .then((response) => {
          this.$store.commit(
            "DetailedApplication/setDetailedApplicationData",
            response
          );
          this.$router.push(`/self-build-wales/detailed-application/page-2`);
          this.requestInProgress = false;
        })
        .catch(() => (this.requestInProgress = false));
    },
    backWithoutSaving() {
      this.$router.push(`/self-build-wales/detailed-application/page-2`);
    },
  },
  validations: {
    solicitorCompanyName: {
      required,
    },
    solicitorContactName: {
      required,
    },
    solicitorContactNumber: {
      required,
      isPhoneNumber,
    },
    solicitorContactEmail: {
      required,
      isEmail,
    },
  },
};
</script>

<style lang="scss"></style>
