<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Builder details</h1>

      <p class="mb-5">Builders must be registered on the TrustMark scheme.</p>

      <p class="font-weight-bold mb-2">TrustMark registration number</p>
      <div class="mb-3">
        <b-form-invalid-feedback
          id="builderTrustMarkRegistrationNumber-feedback"
          :state="validateState('builderTrustMarkRegistrationNumber')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="builderTrustMarkRegistrationNumber"
          ref="builderTrustMarkRegistrationNumber"
          v-model="$v.builderTrustMarkRegistrationNumber.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('builderTrustMarkRegistrationNumber')"
          class="w-50 mb-1"
          type="text"
        />
      </div>

      <p class="font-weight-bold mb-2">Company name</p>
      <div class="mb-3">
        <b-form-invalid-feedback
          id="builderCompanyName-feedback"
          :state="validateState('builderCompanyName')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="builderCompanyName"
          ref="builderCompanyName"
          v-model="$v.builderCompanyName.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('builderCompanyName')"
          class="w-50 mb-1"
          type="text"
        />
      </div>

      <p class="font-weight-bold mb-2">Company address</p>
      <AddressFinder
        ref="addressFinder"
        :address="builderCompanyAddress"
        :disabled="ReadOnlyDA"
      />

      <p class="font-weight-bold mb-2">Contact name</p>
      <div class="mb-3">
        <b-form-invalid-feedback
          id="builderContactName-feedback"
          :state="validateState('builderContactName')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="builderContactName"
          ref="builderContactName"
          v-model="$v.builderContactName.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('builderContactName')"
          class="w-50 mb-1"
          type="text"
        />
      </div>

      <p class="font-weight-bold mb-2">Contact phone number</p>
      <div class="mb-3">
        <b-form-invalid-feedback
          id="builderContactNumber-feedback"
          :state="validateState('builderContactNumber')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="builderContactNumber"
          ref="builderContactNumber"
          v-model="$v.builderContactNumber.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('builderContactNumber')"
          class="w-50 mb-1"
          type="text"
        />
      </div>

      <p class="font-weight-bold mb-2">Contact email</p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="builderContactEmail-feedback"
          :state="validateState('builderContactEmail')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="builderContactEmail"
          ref="builderContactEmail"
          v-model="$v.builderContactEmail.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('builderContactEmail')"
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
      builderTrustMarkRegistrationNumber: null,
      builderCompanyName: null,
      builderCompanyAddress: {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      },
      builderContactName: null,
      builderContactNumber: null,
      builderContactEmail: null,
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
      const b = this.DetailedApplicationData.Builder;
      this.builderTrustMarkRegistrationNumber = b.TrustMarkRegistrationNo;
      this.builderCompanyName = b.CompanyName;
      this.builderCompanyAddress.address1 = b.Address1;
      this.builderCompanyAddress.address2 = b.Address2;
      this.builderCompanyAddress.address3 = b.Address3;
      this.builderCompanyAddress.city = b.City;
      this.builderCompanyAddress.postCode = b.PostCode;
      this.builderContactName = b.CompanyContact;
      this.builderContactNumber = b.CompanyContactPhone;
      this.builderContactEmail = b.CompanyContactEmail;
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
      const ba = this.builderCompanyAddress;
      const af = this.$refs.addressFinder;
      ba.address1 = af.address1;
      ba.address2 = af.address2;
      ba.address3 = af.address3;
      ba.city = af.city;
      ba.postCode = af.postCode;
      // map data to store
      this.$store.commit("DetailedApplication/setBuilderDetails", this);
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 18,
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
    builderTrustMarkRegistrationNumber: {
      required,
    },
    builderCompanyName: {
      required,
    },
    builderContactName: {
      required,
    },
    builderContactNumber: {
      required,
      isPhoneNumber,
    },
    builderContactEmail: {
      required,
      isEmail,
    },
  },
};
</script>

<style lang="scss"></style>
