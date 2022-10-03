<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Contract administrator details</h1>

      <p class="mb-3">
        Give details of the person who will be responsible for the
        administrating the JCT contract.
      </p>

      <p class="font-weight-bold mb-2">Company name</p>
      <div class="mb-3">
        <b-form-invalid-feedback
          id="contractAdminCompanyName-feedback"
          :state="validateState('contractAdminCompanyName')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="contractAdminCompanyName"
          ref="contractAdminCompanyName"
          v-model="$v.contractAdminCompanyName.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('contractAdminCompanyName')"
          class="w-50 mb-1"
          type="text"
        />
      </div>

      <p class="font-weight-bold mb-2">Company address</p>
      <AddressFinder
        ref="addressFinder"
        :address="contractAdminCompanyAddress"
        :disabled="ReadOnlyDA"
      />

      <p class="font-weight-bold mb-2">Contact name</p>
      <div class="mb-3">
        <b-form-invalid-feedback
          id="contractAdminContactName-feedback"
          :state="validateState('contractAdminContactName')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="contractAdminContactName"
          ref="contractAdminContactName"
          v-model="$v.contractAdminContactName.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('contractAdminContactName')"
          class="w-50 mb-1"
          type="text"
        />
      </div>

      <p class="font-weight-bold mb-2">Contact phone number</p>
      <div class="mb-3">
        <b-form-invalid-feedback
          id="contractAdminContactNumber-feedback"
          :state="validateState('contractAdminContactNumber')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="contractAdminContactNumber"
          ref="contractAdminContactNumber"
          v-model="$v.contractAdminContactNumber.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('contractAdminContactNumber')"
          class="w-50 mb-1"
          type="text"
        />
      </div>

      <p class="font-weight-bold mb-2">Contact email</p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="contractAdminContactEmail-feedback"
          :state="validateState('contractAdminContactEmail')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="contractAdminContactEmail"
          ref="contractAdminContactEmail"
          v-model="$v.contractAdminContactEmail.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('contractAdminContactEmail')"
          class="w-50 mb-1"
          type="email"
        />
      </div>

      <p class="font-weight-bold mb-2">Profession</p>
      <p class="mb-2">
        What is the professional role the contract administrator?
      </p>
      <b-form-group
        id="adminRole"
        ref="adminRole"
        :disabled="ReadOnlyDA"
        class="w-100 mb-5"
      >
        <b-form-invalid-feedback
          id="adminRole-feedback"
          :state="validateState('adminRole')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-radio
          v-for="(role, index) in defaultAdminRoles"
          :key="index"
          v-model="$v.adminRole.$model"
          :state="validateState('adminRole')"
          :value="role"
        >
          {{ role }}
        </b-form-radio>
        <b-form-radio
          v-model="$v.adminRole.$model"
          :state="validateState('adminRole')"
          value="Other"
        >
          Other{{ adminRole === "Other" ? ". Please specify" : "" }}
          <div class="mb-3">
            <b-form-input
              v-if="adminRole === 'Other'"
              id="roleDescription"
              ref="roleDescription"
              v-model="$v.roleDescription.$model"
              :state="validateState('roleDescription')"
              class="mb-1"
              type="text"
            />
            <b-form-invalid-feedback
              id="roleDescription-feedback"
              :state="validateState('roleDescription')"
              class="error"
            >
              Invalid
            </b-form-invalid-feedback>
          </div>
        </b-form-radio>
      </b-form-group>

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
import { required, requiredIf } from "vuelidate/lib/validators";
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
      contractAdminCompanyName: null,
      contractAdminCompanyAddress: {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      },
      contractAdminContactName: null,
      contractAdminContactNumber: null,
      contractAdminContactEmail: null,
      defaultAdminRoles: [
        "Architect",
        "Quantity surveyor",
        "Valuer",
        "Project manager",
      ],
      adminRole: null,
      roleDescription: null,
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
      const ca = this.DetailedApplicationData.ContractAdmin;
      this.contractAdminCompanyName = ca.CompanyName;
      this.contractAdminCompanyAddress.address1 = ca.Address1;
      this.contractAdminCompanyAddress.address2 = ca.Address2;
      this.contractAdminCompanyAddress.address3 = ca.Address3;
      this.contractAdminCompanyAddress.city = ca.City;
      this.contractAdminCompanyAddress.postCode = ca.PostCode;
      this.contractAdminContactName = ca.CompanyContact;
      this.contractAdminContactNumber = ca.CompanyContactPhone;
      this.contractAdminContactEmail = ca.CompanyContactEmail;
      if (ca.Professsion && !this.defaultAdminRoles.includes(ca.Professsion)) {
        this.adminRole = "Other";
        this.roleDescription = ca.Professsion;
      } else {
        this.adminRole = ca.Professsion;
      }
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
      const a = this.contractAdminCompanyAddress;
      const af = this.$refs.addressFinder;
      a.address1 = af.address1;
      a.address2 = af.address2;
      a.address3 = af.address3;
      a.city = af.city;
      a.postCode = af.postCode;
      // map data to store
      this.$store.commit("DetailedApplication/setContractAdminDetails", this);
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 16,
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
    contractAdminCompanyName: {
      required,
    },
    contractAdminContactName: {
      required,
    },
    contractAdminContactNumber: {
      required,
      isPhoneNumber,
    },
    contractAdminContactEmail: {
      required,
      isEmail,
    },
    adminRole: {
      required,
    },
    roleDescription: {
      required: requiredIf(function () {
        return this.adminRole === "Other";
      }),
    },
  },
};
</script>

<style lang="scss"></style>
