<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <b-row>
        <b-col>
          <h1 class="font-weight-bold mb-5">Register IFA / MA</h1>
          <template v-if="!LoggedIn">
            <p>Please log in to register IFA / MA</p>
            <b-button variant="primary" class="btn-primary" @click="login">
              Log In
            </b-button>
          </template>
          <template v-else>
            <template v-if="!success">
              <b-form-group
                class="mb-3"
                description="Please enter an FCA number for the company"
              >
                <b-form-invalid-feedback
                  id="fcaNumber-feedback"
                  :state="validateState('fcaNumber')"
                  class="error mb-1"
                >
                  Invalid FCA number
                </b-form-invalid-feedback>
                <label class="sr-only" for="fcaNumber">
                  Company FCA number
                </label>
                <b-form-input
                  id="fcaNumber"
                  v-model="$v.fcaNumber.$model"
                  :state="validateState('fcaNumber')"
                  class="form-input text-uppercase"
                  type="text"
                />
              </b-form-group>
              <div class="mb-5 d-flex align-items-center">
                <b-button
                  variant="primary"
                  :disabled="!fcaNumber || requestInProgress"
                  class="mr-3"
                  @click="fetchIfa"
                >
                  Search FCA number
                </b-button>
                <img
                  v-if="lookupInProgress"
                  class="spinner"
                  src="/loadingwheel3.gif"
                />
              </div>
              <template v-if="lookupFound">
                <b-alert variant="success" class="form-input" show>
                  <p class="font-weight-bold mb-0">Found Company:</p>
                  <p class="mb-3">{{ lookupCompanyName }}</p>
                  <p class="mb-0 font-italic">
                    {{ lookupCompanyAddress.address1 }}
                  </p>
                  <p class="mb-0 font-italic">
                    {{ lookupCompanyAddress.address2 }}
                  </p>
                  <p class="mb-0 font-italic">
                    {{ lookupCompanyAddress.address3 }}
                  </p>
                  <p class="mb-0 font-italic">
                    {{ lookupCompanyAddress.city }}
                  </p>
                  <p class="mb-0 font-italic">
                    {{ lookupCompanyAddress.postCode }}
                  </p>
                </b-alert>
                <b-form-invalid-feedback
                  id="lookupCorrect-feedback"
                  :state="validateState('lookupCorrect')"
                  class="error mb-1"
                >
                  Please confirm that this is the correct company
                </b-form-invalid-feedback>
                <b-form-checkbox
                  id="lookupCorrect"
                  v-model="$v.lookupCorrect.$model"
                  class="mb-5"
                  name="fca-checkbox"
                  value="accepted"
                  unchecked-value="not_accepted"
                >
                  I accept this is the correct company
                </b-form-checkbox>
              </template>

              <template v-if="serviceAvailable === false">
                <p class="font-italic mb-4">
                  FCA number search is currently unavailable. Please try again
                  later.
                </p>
              </template>

              <b-form-group
                v-if="lookupFound === false && serviceAvailable === true"
                class="mb-0"
              >
                <p class="font-italic mb-4">
                  No existing company records found. Add your details manually
                  below to create a new record.
                </p>
                <h3 class="font-weight-bold mb-4">Company Details</h3>
                <b-form-group
                  id="input-company-name"
                  class="mb-4"
                  label="Company Name"
                  label-for="company-name"
                  label-class="font-weight-bold"
                  description="Please enter a name for the company"
                >
                  <b-form-invalid-feedback
                    id="companyName-feedback"
                    :state="validateState('companyName')"
                    class="error mb-1"
                  >
                    Invalid company name
                  </b-form-invalid-feedback>
                  <b-form-input
                    id="companyName"
                    v-model="$v.companyName.$model"
                    :state="validateState('companyName')"
                    type="text"
                    class="form-input"
                  />
                </b-form-group>
                <b-form-group
                  id="input-company-address"
                  label="Company Address"
                  label-for="company-address"
                  label-class="font-weight-bold"
                >
                  <AddressFinder
                    ref="addressFinder"
                    :address="companyAddress"
                  />
                </b-form-group>
                <b-form-group
                  id="input-company-web"
                  label="Company Website URL"
                  label-for="company-website"
                  label-class="font-weight-bold"
                  description="Please enter a website address for the company (optional)"
                >
                  <b-form-invalid-feedback
                    id="webAddressUrl-feedback"
                    :state="validateState('webAddressUrl')"
                    class="error mb-1"
                  >
                    Invalid website address
                  </b-form-invalid-feedback>
                  <b-form-input
                    id="webAddressUrl"
                    v-model="$v.webAddressUrl.$model"
                    :state="validateState('webAddressUrl')"
                    class="form-input"
                    type="text"
                  />
                </b-form-group>
              </b-form-group>
              <b-form-group label-class="font-weight-bold pt-0" class="mb-0">
                <b-form-group
                  id="input-ifa-number"
                  :class="lookupFound !== null && 'mb-5'"
                  label="Personal FCA number"
                  label-for="ifa-number"
                  label-class="font-weight-bold"
                  description="Please enter your FCA number"
                >
                  <b-form-invalid-feedback
                    id="fcaNumber-feedback"
                    :state="validateState('ifaNumber')"
                    class="error mb-1"
                  >
                    Invalid FCA number
                  </b-form-invalid-feedback>
                  <b-form-input
                    id="ifaNumber"
                    v-model="$v.ifaNumber.$model"
                    :state="validateState('ifaNumber')"
                    class="text-uppercase form-input"
                    type="text"
                  />
                </b-form-group>
              </b-form-group>
              <b-button
                variant="primary"
                class="mb-5"
                :disabled="lookupFound === null || requestInProgress"
                @click="submit"
              >
                Submit
              </b-button>
              <div id="errorMessage">
                <b-alert
                  v-if="error"
                  variant="danger"
                  class="form-input mb-5"
                  show
                >
                  <p class="font-weight-bold mb-0">{{ errorMessage }}</p>
                </b-alert>
              </div>
            </template>
            <template v-else>
              <b-alert variant="success" class="form-input" centered show>
                <p class="font-weight-bold mb-0">Success!</p>
              </b-alert>
            </template>
          </template>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import * as msal from "@azure/msal-browser";
import Vue from "vue";
import Vuelidate from "vuelidate";
import { v4 as uuidv4 } from "uuid";
import { required, requiredIf, minLength } from "vuelidate/lib/validators";
import { validateFormNew, isUrl, validateAddress } from "~/lib/validation";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      myMSALObj: new msal.PublicClientApplication(this.$authService.msalConfig),
      fcaNumber: null,
      companyName: null,
      companyAddress: {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      },
      webAddressUrl: null,
      ifaNumber: null,
      lookupInProgress: false,
      lookupFound: null,
      lookupCompanyName: null,
      lookupCompanyAddress: {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      },
      lookupCorrect: null,
      success: false,
      error: false,
      errorMessage: null,
      serviceAvailable: null,
    };
  },
  computed: {
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
      },
    },
    LoggedIn: {
      get() {
        return this.AccountData.HomeAccountId;
      },
    },
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    login() {
      this.myMSALObj.loginPopup(this.$authService.loginRequest).then((res) => {
        this.$authService.tokenRequest.account =
          this.myMSALObj.getAccountByHomeId(res.account.homeAccountId);
        this.myMSALObj
          .acquireTokenSilent(this.$authService.tokenRequest)
          .then((res) => {
            this.$store.commit("Global/setAccountData", res.account);
            this.$store.commit("Global/setApiHeader", {
              Authorization: `Bearer ${res.accessToken}`,
            });
          });
      });
    },
    fetchIfa() {
      this.requestInProgress = true;
      this.lookupInProgress = true;
      this.error = false;
      this.$getIFAService
        .$get("", { params: { fcano: this.fcaNumber } })
        .then((response) => {
          if (response) {
            this.lookupInProgress = false;
            this.lookupCompanyName = response.CompanyName;
            this.lookupCompanyAddress = {
              address1: response.Address.Address1,
              address2: response.Address.Address2,
              address3: response.Address.Address3,
              city: response.Address.City,
              postCode: response.Address.PostCode,
            };
            this.lookupFound = true;
            this.serviceAvailable = true;
            this.companyName = response.CompanyName;
            this.requestInProgress = false;
          } else {
            this.lookupInProgress = false;
            this.lookupCompanyName = "No company available";
            this.serviceAvailable = true;
            this.lookupFound = false;
            this.companyName = null;
            this.$nextTick(() => {
              this.$v.$reset();
            });
            this.requestInProgress = false;
          }
        })
        .catch(() => {
          this.lookupInProgress = false;
          this.lookupCompanyName = "No company available";
          this.serviceAvailable = false;
          this.companyName = null;
          this.$nextTick(() => {
            this.$v.$reset();
          });
          this.requestInProgress = false;
        });
    },
    scrollIntoView(id) {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    submit() {
      this.error = false;
      this.requestInProgress = true;
      // validate form
      if (validateFormNew(this)) {
        this.requestInProgress = false;
        return;
      }
      if (validateAddress(this.$refs.addressFinder)) {
        this.requestInProgress = false;
        return;
      }
      const state = this;
      // if existing company found, add contact
      if (this.lookupCorrect) {
        this.$IFAContactAddService
          .$post("", null, {
            params: {
              email: this.AccountData.Email,
              fcano: this.fcaNumber,
              ifano: this.ifaNumber,
            },
          })
          .then((response) => {
            state.success = true;
            this.requestInProgress = false;
          })
          .catch((error) => {
            const { ...data } = error.response;

            if (data.status === 500) {
              this.errorMessage =
                "Sorry, it might be that the FCA number you've entered is already in use. Please try again or contact the FCA team on nnnn nnn nnnn.";

              this.error = true;
              this.scrollIntoView("errorMessage");
              this.requestInProgress = false;
            }

            if (data.status === 409) {
              this.errorMessage =
                "The personal FCA number you have entered does not match our records.  Please try again or contact the FCA team on nnnn nnn nnnn.";
              this.error = true;
              this.scrollIntoView("errorMessage");
              this.requestInProgress = false;
            }
          });
      }
      // if no company found, create company then add contact
      if (!this.lookupFound) {
        const companyAddress = this.$refs.addressFinder;
        this.companyAddress = {
          address1: companyAddress.address1,
          address2: companyAddress.address2,
          address3: companyAddress.address3,
          city: companyAddress.city,
          postCode: companyAddress.postCode,
        };
        this.$createIFAService
          .$post("", {
            IsDirty: true,
            FcaNumber: this.fcaNumber,
            Id: uuidv4(),
            CreatedOn: "0001-01-01T00:00:00",
            CompanyName: this.companyName,
            WebSiteUrl: this.webAddressUrl,
            Address: this.companyAddress,
          })
          .then((response) => {
            state.$IFAContactAddService
              .$post("", null, {
                params: {
                  email: this.AccountData.Email,
                  ifano: this.ifaNumber,
                  fcano: response.FcaNumber,
                },
              })
              .then((res) => {
                this.success = true;
                this.requestInProgress = false;
              })
              .catch((error) => {
                if (error.response.status === 409) {
                  this.errorMessage =
                    "The personal FCA number you have entered does not match our records.  Please try again or contact the FCA team on nnnn nnn nnnn.";
                  this.error = true;
                  this.scrollIntoView("errorMessage");
                  this.requestInProgress = false;
                }
              });
          })
          .catch((error) => {
            if (error.response.status === 409) {
              this.errorMessage =
                "A company already exists with that FCA number in our records.  Please try again or contact the FCA team on nnnn nnn nnnn.";
              this.error = true;
              this.scrollIntoView("errorMessage");
              this.requestInProgress = false;
            }
          });
      }
    },
  },
  validations() {
    return {
      fcaNumber: {
        required,
        minLength: minLength(4),
      },
      lookupCorrect: {
        required: requiredIf(function () {
          return this.lookupFound === true;
        }),
        isChecked(value) {
          if (this.lookupFound === true) {
            if (value === "accepted") return true;
            else return false;
          } else {
            return true;
          }
        },
      },
      companyName: {
        required: requiredIf(function () {
          return this.lookupFound === false;
        }),
      },
      webAddressUrl: {
        isUrl(value) {
          if (this.lookupFound === false) {
            return isUrl(value) || value === null;
          } else {
            return true;
          }
        },
      },
      ifaNumber: {
        required,
        minLength: minLength(4),
      },
    };
  },
};
</script>

<style lang="scss">
.spinner {
  height: 45px;
  width: 45px;
  filter: hue-rotate(130deg);
}
</style>
