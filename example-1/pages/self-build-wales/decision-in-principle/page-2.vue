<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-3">
        {{ $t("decision_in_principle") }} {{ $t("application") }}
      </h1>
      <p class="mb-5">
        {{ $t("dip_form_intro") }}
      </p>

      <p class="font-weight-bold mb-1">{{ $t("Applicant name") }}</p>
      <p class="mb-4">
        {{ MainApplicant.ApplicantFirstName }}
        {{ MainApplicant.ApplicantLastName }}
      </p>

      <p class="font-weight-bold mb-1">{{ $t("address_title") }}</p>
      <address>
        <p v-if="MainApplicant.ApplicantAddress.Address1" class="mb-0">
          {{ MainApplicant.ApplicantAddress.Address1 }},
        </p>
        <p v-if="MainApplicant.ApplicantAddress.Address2" class="mb-0">
          {{ MainApplicant.ApplicantAddress.Address2 }},
        </p>
        <p v-if="MainApplicant.ApplicantAddress.Address3" class="mb-0">
          {{ MainApplicant.ApplicantAddress.Address3 }},
        </p>
        <p v-if="MainApplicant.ApplicantAddress.City" class="mb-0">
          {{ MainApplicant.ApplicantAddress.City }},
        </p>
        <p v-if="MainApplicant.ApplicantAddress.PostCode" class="mb-0">
          {{ MainApplicant.ApplicantAddress.PostCode }}
        </p>
      </address>

      <p class="font-weight-bold mb-1">{{ $t("site_name") }}</p>
      <p class="mb-4">{{ PlotName }}</p>

      <p class="font-weight-bold mb-1">{{ $t("plot_id_title") }}</p>
      <p class="mb-4">{{ PlotId }}</p>

      <p class="font-weight-bold mb-1">{{ $t("chosen_build_title") }}</p>
      <p class="mb-4">{{ BuildingType }}</p>

      <h3 class="font-weight-bold mb-1">{{ $t("joint_application_title") }}</h3>
      <div class="mb-5">
        <p class="mb-3">{{ $t("is_this_a_joint_application") }}</p>
        <b-form-invalid-feedback
          id="jointApplication-feedback"
          class="error"
          :state="validateState('jointApplication')"
        >
          {{ $t("please_select_joint_application") }}
        </b-form-invalid-feedback>
        <b-form-radio-group
          id="jointApplication"
          v-model="$v.jointApplication.$model"
          stacked
          :disabled="ReadOnlyDIP"
          :state="validateState('jointApplication')"
          @change="toggleJointApplication"
        >
          <b-form-radio :value="true">{{ $t("yes") }}</b-form-radio>
          <b-form-radio :value="false">{{ $t("no") }}</b-form-radio>
        </b-form-radio-group>
      </div>

      <template v-if="jointApplication">
        <div
          v-for="(applicant, index) in $v.applicants.$each.$iter"
          :key="index"
        >
          <h3 class="font-weight-bold mb-3">
            Applicant {{ Number(index) + 2 }}
          </h3>
          <p class="mb-1">First name</p>
          <div class="mb-3">
            <b-form-invalid-feedback
              id="firstName-feedback"
              :state="validateArrayItemState('applicants', index, 'firstName')"
              class="error mb-1"
            >
              Please provide the applicant's first name
            </b-form-invalid-feedback>
            <b-form-input
              :id="`applicants-${index}-firstName`"
              v-model="applicant.$model.firstName"
              :disabled="ReadOnlyDIP"
              :state="validateArrayItemState('applicants', index, 'firstName')"
              class="w-50 mb-3"
              type="text"
            />
          </div>

          <p class="mb-1">Last name</p>
          <div class="mb-3">
            <b-form-invalid-feedback
              id="firstName-feedback"
              :state="validateArrayItemState('applicants', index, 'lastName')"
              class="error mb-1"
            >
              Please provide the applicant's last name
            </b-form-invalid-feedback>
            <b-form-input
              :id="`applicants-${index}-lastName`"
              v-model="applicant.$model.lastName"
              :disabled="ReadOnlyDIP"
              :state="validateArrayItemState('applicants', index, 'lastName')"
              class="w-50 mb-3"
              type="text"
            />
          </div>

          <p class="mb-1">Email address</p>
          <div class="mb-3">
            <b-form-invalid-feedback
              id="email-feedback"
              :state="validateArrayItemState('applicants', index, 'email')"
              class="error mb-1"
            >
              Please provide a unique email for the applicant
            </b-form-invalid-feedback>
            <b-form-input
              :id="`applicants-${index}-email`"
              v-model="applicant.$model.email"
              :disabled="ReadOnlyDIP"
              :state="validateArrayItemState('applicants', index, 'email')"
              class="w-50 mb-3"
              type="text"
              @blur="applicant.email.$touch"
            />
          </div>

          <p class="mb-1">Confirm your email address</p>
          <div class="mb-3">
            <b-form-invalid-feedback
              id="confirmedEmail-feedback"
              :state="
                validateArrayItemState('applicants', index, 'confirmedEmail')
              "
              class="error mb-1"
            >
              Please provide an email address that matches the above
            </b-form-invalid-feedback>
            <b-form-input
              :id="`applicants-${index}-confirmedEmail`"
              v-model="applicant.$model.confirmedEmail"
              :disabled="ReadOnlyDIP"
              :state="
                validateArrayItemState('applicants', index, 'confirmedEmail')
              "
              class="w-50 mb-3"
              type="text"
              @blur="applicant.confirmedEmail.$touch"
            />
          </div>

          <p class="mb-3">Does this applicant live at</p>
          <p class="font-italic mb-0">
            {{ MainApplicant.ApplicantAddress.Address1 }}
            {{ MainApplicant.ApplicantAddress.Address2 }}
            {{ MainApplicant.ApplicantAddress.Address3 }}
          </p>
          <p class="font-italic mb-3">
            {{ MainApplicant.ApplicantAddress.City }}
            {{ MainApplicant.ApplicantAddress.PostCode }}
          </p>

          <div class="mb-4">
            <b-form-invalid-feedback
              :id="`applicants-${index}-livesAtMainApplicantAddress`"
              :state="
                validateArrayItemState(
                  'applicants',
                  index,
                  'livesAtMainApplicantAddress'
                )
              "
              class="error mb-1"
            >
              Please select if the applicant lives at this address or not
            </b-form-invalid-feedback>
            <b-form-radio-group
              v-model="applicant.$model.livesAtMainApplicantAddress"
              :disabled="ReadOnlyDIP"
              stacked
            >
              <b-form-radio :value="true">Yes</b-form-radio>
              <b-form-radio
                :value="false"
                @change="toggleLiveAtMainApplicantAddress(applicant.$model.id)"
              >
                No
              </b-form-radio>
            </b-form-radio-group>
          </div>

          <template v-if="!applicant.$model.livesAtMainApplicantAddress">
            <p class="mb-2">Tell us their address</p>
            <AddressFinder
              :ref="`applicant-address-${index}`"
              :key="renderKey"
              :address="applicant.$model.address"
              :index="Number(index)"
              :disabled="ReadOnlyDIP"
            />
          </template>

          <b-button
            variant="outline-danger"
            class="mb-5"
            :disabled="ReadOnlyDIP"
            @click="$bvModal.show(`${applicant.$model.id}-deleteModal`)"
          >
            Delete Applicant
          </b-button>

          <b-modal
            :id="`${applicant.$model.id}-deleteModal`"
            title="Confirm submission"
            centered
          >
            <p>Are you sure you want to remove this applicant?</p>
            <template #modal-footer="{ cancel }">
              <b-button variant="outline-primary" @click="cancel()">
                Cancel
              </b-button>
              <b-button
                variant="primary"
                @click="
                  deleteApplicant(applicant.$model.id);
                  cancel();
                "
              >
                Ok
              </b-button>
            </template>
          </b-modal>
        </div>

        <p class="mb-1">Are there any more joint applicants?</p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="moreApplicants"
            :state="validateState('moreApplicants')"
            class="error mb-1"
          >
            Please select if there are more applicants or not
          </b-form-invalid-feedback>
          <b-form-radio-group
            v-model="$v.moreApplicants.$model"
            :disabled="ReadOnlyDIP"
            stacked
            @change="toggleMoreApplicants"
          >
            <b-form-radio :value="true">Yes</b-form-radio>
            <b-form-radio :value="false">No</b-form-radio>
          </b-form-radio-group>
        </div>
      </template>

      <b-row no-gutters>
        <b-button
          variant="outline-primary"
          class="mr-2"
          :disabled="requestInProgress"
          @click="navigateBack"
        >
          {{ $t("previous") }}
        </b-button>
        <b-button
          variant="primary"
          :disabled="requestInProgress"
          @click="navigateForward"
        >
          {{ $t("next") }}
        </b-button>
      </b-row>
    </template>
  </b-container>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import { v4 as uuidv4 } from "uuid";
import {
  validateFormNew,
  isEmail,
  validateAddress,
} from "../../../lib/validation";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      jointApplication: null,
      applicants: [],
      moreApplicants: false,
      renderKey: 0,
    };
  },
  computed: {
    DIPData: {
      get() {
        return this.$store.getters["DecisionInPrinciple/DIPData"];
      },
    },
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
    ReadOnlyDIP: {
      get() {
        return this.$store.getters["Global/ReadOnlyDIP"];
      },
    },
    MainApplicant: {
      get() {
        return this.$store.getters["DecisionInPrinciple/MainApplicant"];
      },
    },
    PlotId: {
      get() {
        return this.$store.getters["DecisionInPrinciple/Plot_Plot_PlotId"];
      },
    },
    BuildingType: {
      get() {
        return this.$store.getters["DecisionInPrinciple/Plot_DesignType_Name"];
      },
    },
    PlotName: {
      get() {
        return this.$store.getters["DecisionInPrinciple/Plot_Name"];
      },
    },
    Applications: {
      get() {
        return this.$store.getters["DecisionInPrinciple/Applications"];
      },
    },
  },
  mounted() {
    this.getData();
    this.mapStoreValuesToComponentState();
  },
  methods: {
    getData() {
      this.$dipGetService.$get("", this.ApiOptions).then((response) => {
        this.$store.commit("DecisionInPrinciple/setDIPData", response);
        this.loading = false;
      });
    },
    mapStoreValuesToComponentState() {
      // set jointApplication boolean
      if (this.Applications.length > 1) this.jointApplication = true;
      else if (this.MainApplicant.OnlyResidence !== "Unassigned")
        this.jointApplication = false;
      // create applicants array
      this.Applications.forEach((applicant) => {
        if (!applicant.IsMainApplication) {
          // work out if applicant lives at main applicants address
          const livesAtMainApplicantAddress =
            this.MainApplicant.ApplicantAddress.Address1 ===
              applicant.ApplicantAddress.Address1 &&
            this.MainApplicant.ApplicantAddress.Address2 ===
              applicant.ApplicantAddress.Address2;
          // push values to applicants array
          this.applicants.push({
            id: applicant.Id,
            firstName: applicant.ApplicantFirstName,
            lastName: applicant.ApplicantLastName,
            email: applicant.ApplicantEmail,
            confirmedEmail: applicant.ApplicantEmail,
            livesAtMainApplicantAddress,
            address: {
              address1: applicant.ApplicantAddress.Address1,
              address2: applicant.ApplicantAddress.Address2,
              address3: applicant.ApplicantAddress.Address3,
              city: applicant.ApplicantAddress.City,
              postCode: applicant.ApplicantAddress.PostCode,
            },
          });
        }
      });
    },
    toggleJointApplication() {
      if (this.jointApplication) {
        this.addApplicant();
        this.$nextTick(() => {
          this.$v.applicants.$reset();
        });
      } else {
        this.applicants = [];
      }
    },
    toggleMoreApplicants() {
      if (this.moreApplicants) {
        this.addApplicant();
      }
    },
    toggleLiveAtMainApplicantAddress(id) {
      const match = this.applicants.find((a) => a.id === id);
      match.address.address1 = null;
      match.address.address2 = null;
      match.address.address3 = null;
      match.address.city = null;
      match.address.postCode = null;
      this.renderKey += 1;
    },
    mapAddressesToComponentState() {
      this.applicants.forEach((applicant, index) => {
        if (!applicant.livesAtMainApplicantAddress) {
          const newAddress = this.$refs[`applicant-address-${index}`];
          if (newAddress) {
            applicant.address = {
              address1: newAddress[0].address1 || null,
              address2: newAddress[0].address2 || null,
              address3: newAddress[0].address3 || null,
              city: newAddress[0].city || null,
              postCode: newAddress[0].postCode || null,
            };
          }
        }
      });
      this.renderKey += 1;
    },
    addApplicant() {
      this.applicants.push({
        id: uuidv4(),
        applicationNumber: this.applicants.length + 2,
        firstName: null,
        lastName: null,
        email: null,
        confirmedEmail: null,
        livesAtMainApplicantAddress: true,
        address: {
          address1: null,
          address2: null,
          address3: null,
          city: null,
          postCode: null,
        },
      });
      this.moreApplicants = false;
    },
    deleteApplicant(id) {
      this.mapAddressesToComponentState();
      this.applicants = this.applicants.filter(
        (applicant) => applicant.id !== id
      );
      if (this.applicants.length === 0) this.jointApplication = false;
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    validateArrayItemState(array, index, name) {
      const { $dirty, $error } = this.$v[array].$each.$iter[index][name];
      return $dirty ? !$error : null;
    },
    navigateBack() {
      this.$router.push("/self-build-wales/decision-in-principle/page-1");
    },
    navigateForward() {
      if (this.ReadOnlyDIP)
        this.$router.push("/self-build-wales/decision-in-principle/page-3");
      else {
        this.requestInProgress = true;
        if (validateFormNew(this)) {
          this.requestInProgress = false;
          return;
        }
        let anyInvalid = false;
        this.applicants.forEach((applicant, index) => {
          if (!applicant.livesAtMainApplicantAddress) {
            if (validateAddress(this.$refs[`applicant-address-${index}`][0]))
              anyInvalid = true;
          }
        });
        if (anyInvalid) {
          this.requestInProgress = false;
          return;
        }
        // send data to store
        this.mapAddressesToComponentState();
        this.$store.commit(
          "DecisionInPrinciple/setApplicants",
          this.applicants
        );
        this.$dipPostService
          .$post(
            "",
            this.$store.getters["DecisionInPrinciple/DIPData"],
            this.ApiOptions
          )
          .then((response) => {
            this.$router.push("/self-build-wales/decision-in-principle/page-3");
            this.requestInProgress = false;
          })
          .catch(() => (this.requestInProgress = false));
      }
    },
  },
  validations() {
    return {
      jointApplication: {
        required,
      },
      applicants: {
        $each: {
          id: {},
          firstName: {
            required,
            maxLength: maxLength(250),
          },
          lastName: {
            required,
            maxLength: maxLength(250),
          },
          email: {
            required,
            isEmail,
            isUniqueEmail: (value, parent) => {
              const emailMatch = this.applicants.find(
                (a) => a.email === value && a.id !== parent.id
              );
              return !emailMatch && value !== this.MainApplicant.ApplicantEmail;
            },
            maxLength: maxLength(500),
          },
          confirmedEmail: {
            required,
            isEmail,
            matchesEmail: (value, parent) => {
              return parent.email === value;
            },
          },
          livesAtMainApplicantAddress: {},
        },
      },
      moreApplicants: {},
    };
  },
};
</script>

<style lang="scss"></style>
