<template>
  <b-container class="p-3 dbw">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-5">Type of business</h1>

      <p class="font-weight-bold mb-2">Type of business</p>
      <div class="mb-5">
        <b-form-group
          id="businessType"
          ref="businessType"
          class="w-100"
          :disabled="ReadOnlyIA"
        >
          <b-form-invalid-feedback
            id="businessType-feedback"
            :state="validateState('businessType')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-radio
            v-for="(option, index) in businessTypeOptions"
            :key="index"
            v-model="$v.businessType.$model"
            :state="validateState('businessType')"
            :value="option"
            @change="resetValues"
          >
            {{ option }}
          </b-form-radio>
          <b-form-radio
            v-model="$v.businessType.$model"
            :state="validateState('businessType')"
            value="Other"
            @change="resetValues"
          >
            Other{{ businessType === "Other" ? ". Please specify" : "" }}
            <div class="mt-2 mb-3">
              <b-form-input
                v-if="businessType === 'Other'"
                id="businessTypeOtherDescription"
                ref="businessTypeOtherDescription"
                v-model="$v.businessTypeOtherDescription.$model"
                :state="validateState('businessTypeOtherDescription')"
                class="mb-1"
                type="text"
              />
              <b-form-invalid-feedback
                id="businessTypeOtherDescription-feedback"
                :state="validateState('businessTypeOtherDescription')"
                class="error"
              >
                Invalid
              </b-form-invalid-feedback>
            </div>
          </b-form-radio>
        </b-form-group>
      </div>

      <template
        v-if="
          businessType === 'Limited company' ||
          businessType === 'Company limited by guarantee' ||
          businessType === 'Limited liability partnership'
        "
      >
        <p class="font-weight-bold mb-2">Registered number</p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="registeredNumber-feedback"
            :state="validateState('registeredNumber')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-input
            id="registeredNumber"
            ref="registeredNumber"
            v-model="$v.registeredNumber.$model"
            :disabled="ReadOnlyIA"
            :state="validateState('registeredNumber')"
            class="w-50 mb-3"
            type="text"
          />
          <template v-if="showNoCompanyFoundError">
            <p class="error">No company found</p>
          </template>
          <b-button
            :variant="
              registeredNumber ? 'outline-primary' : 'outline-secondary'
            "
            :disabled="ReadOnlyIA"
            @click="checkCompany"
          >
            Check
          </b-button>
        </div>
        <template v-if="companyChecked">
          <p class="mb-2"><b>Business name:</b> {{ businessName }}</p>

          <p class="font-weight-bold mb-2">Registered office address:</p>
          <p v-if="registeredOfficeAddress.address1" class="ml-4 mb-2">
            <i>{{ registeredOfficeAddress.address1 }}</i>
          </p>
          <p v-if="registeredOfficeAddress.address2" class="ml-4 mb-2">
            <i>{{ registeredOfficeAddress.address2 }}</i>
          </p>
          <p v-if="registeredOfficeAddress.address3" class="ml-4 mb-2">
            <i>{{ registeredOfficeAddress.address3 }}</i>
          </p>
          <p v-if="registeredOfficeAddress.city" class="ml-4 mb-2">
            <i>{{ registeredOfficeAddress.city }}</i>
          </p>
          <p v-if="registeredOfficeAddress.postCode" class="ml-4 mb-2">
            <i>{{ registeredOfficeAddress.postCode }}</i>
          </p>

          <p class="mb-5">
            <b>Companies house registration number:</b>
            {{ companiesHouseRegistrationNumber }}
          </p>

          <p class="font-weight-bold mb-2">Are these details correct?</p>
          <div class="mb-5">
            <b-form-group
              id="detailsCorrect"
              ref="detailsCorrect"
              class="w-100"
              :disabled="ReadOnlyIA"
            >
              <b-form-invalid-feedback
                id="detailsCorrect-feedback"
                :state="validateState('detailsCorrect')"
                class="error mb-1"
              >
                Invalid
              </b-form-invalid-feedback>
              <b-form-radio
                v-for="(option, index) in detailsCorrectOptions"
                :key="index"
                v-model="$v.detailsCorrect.$model"
                :state="validateState('detailsCorrect')"
                :value="option"
                @change="
                  detailsCorrect === 'No, this is not my business'
                    ? (registeredNumber = null)
                    : null
                "
              >
                {{ option }}
              </b-form-radio>
            </b-form-group>
            <template v-if="detailsCorrect === 'No, this is not my business'">
              <p>Guidance text</p>
            </template>
          </div>
        </template>
      </template>

      <div class="d-flex flex-column pt-5">
        <b-button
          variant="primary"
          class="align-self-start mb-3"
          :disabled="
            requestInProgress ||
            detailsCorrect === 'No, this is not my business' ||
            ((businessType === 'Limited company' ||
              businessType === 'Company limited by guarantee' ||
              businessType === 'Limited liability partnership') &&
              !companyChecked)
          "
          @click="save"
        >
          {{ ReadOnlyIA ? "Continue" : "Save and continue" }}
        </b-button>
        <b-button
          variant="outline-primary"
          class="align-self-start"
          :disabled="requestInProgress"
          @click="backWithoutSaving"
        >
          {{ ReadOnlyIA ? "Back" : "Back without saving" }}
        </b-button>
      </div>
    </template>
  </b-container>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required, requiredIf, maxLength } from "vuelidate/lib/validators";
import { validateFormNew } from "~/lib/validation";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      businessType: null,
      businessTypeOptions: [
        "Limited company",
        "Sole trader",
        "Partnership",
        "Company limited by guarantee",
        "Limited liability partnership",
      ],
      businessTypeOtherDescription: null,
      registeredNumber: null,
      companyChecked: false,
      showNoCompanyFoundError: false,
      businessName: null,
      registeredOfficeAddress: {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      },
      companiesHouseRegistrationNumber: null,
      formationDate: null,
      directors: [],
      pscs: [],
      paginationLimit: 100,
      directorsPaginationOffset: 0,
      pscsPaginationOffset: 0,
      detailsCorrect: null,
      detailsCorrectOptions: [
        "Yes, this my business and all the details listed are correct",
        "This is my business but some details are not correct",
        "No, this is not my business",
      ],
    };
  },
  computed: {
    ReadOnlyIA: {
      get() {
        return this.$store.getters["Global/ReadOnlyIA"];
      },
    },
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
      },
    },
    InvestmentApplicationData: {
      get() {
        return this.$store.getters[
          "InvestmentApplication/InvestmentApplicationData"
        ];
      },
    },
  },
  mounted() {
    this.isLoggedIn();
  },
  methods: {
    isLoggedIn() {
      if (!this.$store.state.Global.LoggedIn) {
        this.$router.push({
          path: "/dev-bank-wales/investment-application/page-1",
          query: {
            loggedIn: false,
            pageVisited: this.$route.path,
          },
        });
      } else {
        this.mapStoreValuesToComponentState();
        this.loading = false;
      }
    },
    mapStoreValuesToComponentState() {
      const d = this.InvestmentApplicationData;
      // if previous saved data (BusinessType is a required field)
      if (d.BusinessType !== "Unassigned") {
        if (
          d.BusinessType === "LimitedCompany" ||
          d.BusinessType === "CompanyLtdByGuarantee" ||
          d.BusinessType === "LimitedLiabilityPartnership"
        )
          this.companyChecked = true;
        let businessType = null;
        if (d.BusinessType === "LimitedCompany")
          businessType = "Limited company";
        if (d.BusinessType === "SoleTrader") businessType = "Sole trader";
        if (d.BusinessType === "Partnership") businessType = "Partnership";
        if (d.BusinessType === "CompanyLtdByGuarantee")
          businessType = "Company limited by guarantee";
        if (d.BusinessType === "LimitedLiabilityPartnership")
          businessType = "Limited liability partnership";
        if (d.BusinessType === "Other") businessType = "Other";
        this.businessType = businessType;
        this.businessTypeOtherDescription =
          d.BusinessType === "Other" ? d.BusinessDescriptionTypeOther : null;
        this.registeredNumber = d.CompaniesHouseRegistrationNumber;
        this.businessName = d.BusinessName;
        this.registeredOfficeAddress = {
          address1: d.RegisteredAddress.Address1,
          address2: d.RegisteredAddress.Address2,
          address3: d.RegisteredAddress.Address3,
          city: d.RegisteredAddress.City,
          postCode: d.RegisteredAddress.PostCode,
        };
        this.companiesHouseRegistrationNumber =
          d.CompaniesHouseRegistrationNumber;
        this.formationDate = d.FormationDate;
        let detailsCorrect = null;
        if (d.CompanyDetailsCorrect === "MyBusinessAllOk")
          detailsCorrect =
            "Yes, this my business and all the details listed are correct";
        if (d.CompanyDetailsCorrect === "MyBusinessSomeNotOk")
          detailsCorrect =
            "This is my business but some details are not correct";
        if (d.CompanyDetailsCorrect === "NotMyBusiness")
          detailsCorrect = "No, this is not my business";
        this.detailsCorrect = detailsCorrect;
      }
    },
    resetValues() {
      if (
        this.businessType !== "Limited company" &&
        this.businessType !== "Company limited by guarantee" &&
        this.businessType !== "Limited liability partnership"
      ) {
        this.registeredNumber = null;
        this.companyChecked = false;
        this.businessName = null;
        this.registeredOfficeAddress = {
          address1: null,
          address2: null,
          address3: null,
          city: null,
          postCode: null,
        };
        this.companiesHouseRegistrationNumber = null;
        this.detailsCorrect = null;
        this.directors = [];
        this.pscs = [];
      }
      if (this.businessType !== "Other")
        this.businessTypeOtherDescription = null;
    },
    getCompanyData() {
      this.$companiesHouseApiService
        .$get(`/${this.registeredNumber}`)
        .then((res) => {
          this.showNoCompanyFoundError = false;
          this.companyChecked = true;
          this.detailsCorrect = null;
          this.companiesHouseRegistrationNumber = res.company_number;
          this.businessName = res.company_name;
          const a = res.registered_office_address;
          this.registeredOfficeAddress = {
            address1: a.address_line_1,
            address2: a.address_line_2,
            city: a.locality,
            postCode: a.postal_code,
          };
          const date = res.date_of_creation;
          const d = date.split(/[-]/);
          this.formationDate = new Date(
            +d[0],
            +d[1] - 1,
            +d[2],
            13
          ).toISOString();
        })
        .catch(() => (this.showNoCompanyFoundError = true));
    },
    getCompanyOfficers() {
      this.$companiesHouseApiService
        .$get(
          `/${this.registeredNumber}/officers?items_per_page=${this.paginationLimit}&start_index=${this.directorsPaginationOffset}`
        )
        .then((res) => {
          this.directors.push(...res.items);
          if (res.items.length === this.paginationLimit) {
            this.directorsPaginationOffset =
              this.directorsPaginationOffset + this.paginationLimit;
            this.getCompanyOfficers();
          }
        });
    },
    getCompanyPSCs() {
      this.$companiesHouseApiService
        .$get(
          `/${this.registeredNumber}/persons-with-significant-control?items_per_page=${this.paginationLimit}&start_index=${this.pscsPaginationOffset}`
        )
        .then((res) => {
          this.pscs.push(...res.items);
          if (res.items.length === this.paginationLimit) {
            this.pscsPaginationOffset =
              this.pscsPaginationOffset + this.paginationLimit;
            this.getCompanyPSCs();
          }
        });
    },
    checkCompany() {
      if (this.registeredNumber) {
        this.directors = [];
        this.pscs = [];
        this.directorsPaginationOffset = 0;
        this.pscsPaginationOffset = 0;
        this.getCompanyData();
        this.getCompanyOfficers();
        this.getCompanyPSCs();
      }
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    save() {
      if (this.ReadOnlyIA)
        this.$router.push("/dev-bank-wales/investment-application/page-4");
      else {
        this.requestInProgress = true;
        // validate form
        if (validateFormNew(this)) {
          this.requestInProgress = false;
          return;
        }
        // map data to store
        this.$store.commit("InvestmentApplication/setTypeOfBusiness", this);
        // send store data to db
        this.$investmentApplicationUpdateService
          .$post("", this.InvestmentApplicationData, {
            params: { email: this.AccountData.Email },
          })
          .then((response) => {
            this.$store.commit(
              "InvestmentApplication/setInvestmentApplicationData",
              response
            );
            this.$router.push(`/dev-bank-wales/investment-application/page-4`);
            this.requestInProgress = false;
          })
          .catch(() => (this.requestInProgress = false));
      }
    },
    backWithoutSaving() {
      this.$router.push(`/dev-bank-wales/investment-application/page-2`);
    },
  },
  validations: {
    businessType: {
      required,
    },
    businessTypeOtherDescription: {
      required: requiredIf(function () {
        return this.businessType === "Other";
      }),
      maxLength: maxLength(500),
    },
    registeredNumber: {
      required: requiredIf(function () {
        return (
          this.businessType === "Limited company" ||
          this.businessType === "Company limited by guarantee" ||
          this.businessType === "Limited liability partnership"
        );
      }),
    },
    detailsCorrect: {
      required: requiredIf(function () {
        return this.companyChecked;
      }),
    },
  },
};
</script>

<style lang="scss">
.error {
  font-size: 80%;
  color: #dc003e;
}
</style>
