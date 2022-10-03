<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-4">Property currently owned</h1>
      <p class="mb-3">
        You must tell us about all property currently owned by any or all of the
        applicants.
      </p>
      <p class="mb-3">
        The completed self-build must also be your only property. To take part
        in the Self Build Wales scheme all applicants must agree to sell any
        existing property that they own after they move into the new home.
      </p>

      <div class="mb-5">
        <p class="mb-3">Do any of the applicants own property?</p>
        <b-form-invalid-feedback
          id="otherProperties-feedback"
          class="error"
          :state="validateState('otherProperties')"
        >
          Please select if this is a joint application or not
        </b-form-invalid-feedback>
        <b-form-radio-group
          id="otherProperties"
          v-model="$v.otherProperties.$model"
          stacked
          :disabled="ReadOnlyDIP"
          :state="validateState('otherProperties')"
          @change="toggleOtherProperties"
        >
          <b-form-radio :value="true">Yes</b-form-radio>
          <b-form-radio :value="false">No</b-form-radio>
        </b-form-radio-group>
      </div>

      <template v-if="otherProperties">
        <div
          v-for="(property, index) in $v.properties.$each.$iter"
          :key="index"
        >
          <h3 class="font-weight-bold mb-3">
            Property {{ Number(index) + 1 }}
          </h3>

          <template v-if="Number(index) === 0">
            <p class="mb-2">Is this the address of the owned property?</p>
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

            <div class="mb-4">
              <b-form-invalid-feedback
                :id="`properties-${index}-sellingMainApplicantAddress`"
                :state="
                  validateArrayItemState(
                    'properties',
                    index,
                    'sellingMainApplicantAddress'
                  )
                "
                class="error mb-1"
              >
                Please select if this is the address of the owned property
              </b-form-invalid-feedback>
              <b-form-radio-group
                v-model="property.$model.sellingMainApplicantAddress"
                :disabled="ReadOnlyDIP"
                stacked
              >
                <b-form-radio :value="true">Yes</b-form-radio>
                <b-form-radio
                  :value="false"
                  @change="resetAddress(property.$model.id)"
                >
                  No
                </b-form-radio>
              </b-form-radio-group>
            </div>
          </template>

          <template
            v-if="
              Number(index) > 0 ||
              property.$model.sellingMainApplicantAddress === false
            "
          >
            <p class="mb-2">Tell us their address</p>
            <AddressFinder
              :ref="`property-address-${index}`"
              :key="renderKey"
              :address="property.$model.address"
              :index="Number(index)"
              :disabled="ReadOnlyDIP"
            />
          </template>

          <p class="mb-1">
            What is the outstanding mortgage amount on this property?
          </p>
          <div class="mb-3">
            <b-form-invalid-feedback
              :state="
                validateArrayItemState(
                  'properties',
                  index,
                  'outstandingMortgageAmount'
                )
              "
              class="error mb-1"
            >
              Please provide a valid outstanding mortgage amount on this
              property
            </b-form-invalid-feedback>
            <b-input-group prepend="£" class="form-input mb-3">
              <b-form-input
                :id="`properties-${index}-outstandingMortgageAmount`"
                v-model="property.$model.outstandingMortgageAmount"
                :disabled="ReadOnlyDIP"
                :state="
                  validateArrayItemState(
                    'properties',
                    index,
                    'outstandingMortgageAmount'
                  )
                "
                type="number"
              />
            </b-input-group>
          </div>

          <p class="mb-1">What is the estimated value of this property?</p>
          <div class="mb-3">
            <b-form-invalid-feedback
              :state="
                validateArrayItemState('properties', index, 'estimatedValue')
              "
              class="error mb-1"
            >
              Please provide a valid estimated value of this property
            </b-form-invalid-feedback>
            <b-input-group prepend="£" class="form-input mb-3">
              <b-form-input
                :id="`properties-${index}-estimatedValue`"
                v-model="property.$model.estimatedValue"
                :disabled="ReadOnlyDIP"
                :state="
                  validateArrayItemState('properties', index, 'estimatedValue')
                "
                type="number"
              />
            </b-input-group>
          </div>

          <p class="mb-1">
            The estimated funds you can raise by selling this property are
          </p>
          <p class="font-weight-bold mb-3">
            £
            {{
              numberWithCommas(
                (
                  property.$model.estimatedValue -
                  property.$model.outstandingMortgageAmount
                ).toFixed(2)
              )
            }}
          </p>

          <p class="mb-1">
            How much of this do you intend to use towards repaying the Self
            Build Wales loan?
          </p>
          <div class="mb-4">
            <b-form-invalid-feedback
              :state="
                validateArrayItemState(
                  'properties',
                  index,
                  'equityToContribute'
                )
              "
              class="error mb-1"
            >
              Please provide a valid estimated value of this property
            </b-form-invalid-feedback>
            <b-input-group prepend="£" class="form-input mb-3">
              <b-form-input
                :id="`properties-${index}-equityToContribute`"
                v-model="property.$model.equityToContribute"
                :disabled="ReadOnlyDIP"
                :state="
                  validateArrayItemState(
                    'properties',
                    index,
                    'equityToContribute'
                  )
                "
                type="number"
              />
            </b-input-group>
          </div>

          <p class="mb-3">Who owns this property? (Choose all that apply.)</p>
          <div class="mb-5">
            <b-form-invalid-feedback
              :id="`properties-${index}-isOwners`"
              :state="validateArrayItemState('properties', index, 'isOwners')"
              class="error mb-1"
            >
              Please select who owns this property
            </b-form-invalid-feedback>
            <b-form-checkbox-group
              v-model="property.$model.owners"
              :disabled="ReadOnlyDIP"
              stacked
            >
              <b-form-checkbox
                v-for="application in Applications"
                :key="application.Id"
                :value="application.Id"
                class="mb-4"
                :disabled="ReadOnlyDIP"
              >
                {{ application.ApplicantFirstName }}
                {{ application.ApplicantLastName }}
              </b-form-checkbox>
            </b-form-checkbox-group>
            <b-form-checkbox
              v-model="property.$model.jointOwnershipWithNonApplicant"
              class="mb-4"
              :disabled="ReadOnlyDIP"
            >
              Joint ownership with a person not named in this application
            </b-form-checkbox>
          </div>

          <b-button
            variant="outline-danger"
            class="mb-5"
            :disabled="ReadOnlyDIP"
            @click="$bvModal.show(`${index}-deleteModal`)"
          >
            Delete Address
          </b-button>

          <b-modal
            :id="`${index}-deleteModal`"
            title="Confirm submission"
            centered
          >
            <p>Are you sure you want to remove this address?</p>
            <template #modal-footer="{ cancel }">
              <b-button variant="outline-primary" @click="cancel()">
                Cancel
              </b-button>
              <b-button
                variant="primary"
                @click="
                  deleteProperty(property.$model.id);
                  cancel();
                "
              >
                Ok
              </b-button>
            </template>
          </b-modal>
        </div>

        <p class="mb-1">
          Do you intend to repay the Self Build Wales loan from the sale
          proceeds of any other property?
        </p>
        <div class="mb-5">
          <b-form-invalid-feedback
            id="moreProperties"
            :state="validateState('moreProperties')"
            class="error mb-1"
          >
            Please select if there are more applicants or not
          </b-form-invalid-feedback>
          <b-form-radio-group
            v-model="$v.moreProperties.$model"
            :disabled="ReadOnlyDIP"
            stacked
            @change="toggleMoreProperties"
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
          Previous
        </b-button>
        <b-button
          variant="primary"
          :disabled="requestInProgress"
          @click="navigateForward"
        >
          Next
        </b-button>
      </b-row>
    </template>
  </b-container>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import Vue from "vue";
import Vuelidate from "vuelidate";
import {
  required,
  requiredIf,
  minValue,
  between,
} from "vuelidate/lib/validators";
import { validateFormNew, validateAddress } from "~/lib/validation";
import { findBoolean, numberWithCommas } from "~/lib/globalFunctions";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      renderKey: 0,
      otherProperties: null,
      properties: [],
      sellingMainApplicantAddress: null,
      moreProperties: false,
    };
  },
  computed: {
    ReadOnlyDIP: {
      get() {
        return this.$store.getters["Global/ReadOnlyDIP"];
      },
    },
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
    DIPData: {
      get() {
        return this.$store.getters["DecisionInPrinciple/DIPData"];
      },
    },
    MainApplicant: {
      get() {
        return this.$store.getters["DecisionInPrinciple/MainApplicant"];
      },
    },
    Applications: {
      get() {
        return this.$store.getters["DecisionInPrinciple/Applications"];
      },
    },
  },
  beforeMount() {
    this.getData();
  },
  methods: {
    numberWithCommas,
    getData() {
      this.$dipGetService.$get(``, this.ApiOptions).then((response) => {
        this.$store.commit("DecisionInPrinciple/setDIPData", response);
        this.otherProperties = findBoolean(
          this.DIPData.RepayFromSaleOfProperty
        );
        this.mapPropertiesToComponentState();
        this.loading = false;
      });
    },
    mapPropertiesToComponentState() {
      const mainA = this.DIPData.Applications.find(
        (applicant) => applicant.IsMainApplication
      );
      const mainAA = mainA.ApplicationAddresses.find(
        (address) => address.AddressType === "Home"
      ).Address;
      this.DIPData.Applications.forEach((applicant) => {
        applicant.ApplicationAddresses.forEach((address) => {
          if (address.AddressType === "Additional") {
            const AA = address.Address;
            const match = this.properties.find((a) => a.id === AA.Id);
            if (match) {
              match.owners.push(applicant.Id);
            } else {
              this.properties.push({
                id: AA.Id,
                sellingMainApplicantAddress: mainAA.Id === AA.Id,
                address: {
                  address1: AA.Address1,
                  address2: AA.Address2,
                  address3: AA.Address3,
                  city: AA.City,
                  postCode: AA.PostCode,
                },
                outstandingMortgageAmount: address.OutstandingMortgageAmount,
                estimatedValue: address.EstimatedValue,
                equityToContribute: address.EquityToContribute,
                owners: [applicant.Id],
                isOwners: true,
                jointOwnershipWithNonApplicant:
                  address.OwnershipType === "JointWithNonApplicant",
              });
            }
          }
        });
      });
    },
    mapAddressesToComponentState() {
      this.properties.forEach((property, index) => {
        if (!property.sellingMainApplicantAddress || index > 0) {
          const newAddress = this.$refs[`property-address-${index}`];
          if (newAddress) {
            property.address = {
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
    toggleOtherProperties() {
      if (this.otherProperties) {
        this.addProperty();
        this.$nextTick(() => {
          this.$v.$reset();
        });
      } else {
        this.properties = [];
      }
    },
    toggleMoreProperties() {
      if (this.moreProperties) {
        this.addProperty();
      }
    },
    addProperty() {
      this.properties.push({
        id: uuidv4(),
        sellingMainApplicantAddress: null,
        address: {
          address1: null,
          address2: null,
          address3: null,
          city: null,
          postCode: null,
        },
        outstandingMortgageAmount: null,
        estimatedValue: null,
        equityToContribute: null,
        owners: [],
        isOwners: false,
        jointOwnershipWithNonApplicant: false,
      });
      this.moreProperties = false;
    },
    deleteProperty(id) {
      this.mapAddressesToComponentState();
      this.properties = this.properties.filter(
        (property) => property.id !== id
      );
      if (this.properties.length === 0) this.otherProperties = false;
    },
    isOwner(propertyId, applicationId) {
      const match = this.properties.find(
        (property) => property.id === propertyId
      );
      return match.owners.includes(applicationId);
    },
    resetAddress(propertyId) {
      const match = this.properties.find(
        (property) => property.id === propertyId
      );
      match.address = {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      };
      this.renderKey += 1;
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
      this.$router.push("/self-build-wales/decision-in-principle/page-4");
    },
    navigateForward() {
      if (this.ReadOnlyDIP)
        this.$router.push("/self-build-wales/decision-in-principle/page-6");
      else {
        this.requestInProgress = true;
        if (validateFormNew(this)) {
          this.requestInProgress = false;
          return;
        }
        let anyInvalid = false;
        this.properties.forEach((property, index) => {
          if (!property.sellingMainApplicantAddress || index > 0) {
            if (validateAddress(this.$refs[`property-address-${index}`][0]))
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
          "DecisionInPrinciple/setProperties",
          this.properties
        );
        this.$dipPostService
          .$post(
            "",
            this.$store.getters["DecisionInPrinciple/DIPData"],
            this.ApiOptions
          )
          .then((response) => {
            this.$router.push("/self-build-wales/decision-in-principle/page-6");
            this.requestInProgress = false;
          })
          .catch(() => (this.requestInProgress = false));
      }
    },
  },
  validations() {
    return {
      otherProperties: {
        required,
      },
      properties: {
        $each: {
          id: {},
          sellingMainApplicantAddress: {
            required: requiredIf(function (parent) {
              return this.properties[0].id === parent.id;
            }),
          },
          outstandingMortgageAmount: {
            required,
            minValue: minValue(0),
          },
          estimatedValue: {
            required,
            minValue: minValue(0),
          },
          equityToContribute: {
            required,
            between(value, parent) {
              const maxValue =
                parent.estimatedValue - parent.outstandingMortgageAmount;
              return between(0, maxValue)(value);
            },
          },
          owners: {},
          isOwners: {
            isOwner(value, parent) {
              return parent.owners.length;
            },
          },
          jointOwnershipWithNonApplicant: {},
        },
      },
      moreProperties: {},
    };
  },
};
</script>

<style lang="scss"></style>
