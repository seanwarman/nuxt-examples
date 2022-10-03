<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Property ownership</h1>

      <p class="mb-3">
        You must tell us about all properties owned by any of the applicants
        (either individual or joint ownership, with an applicant or with anyone
        else).
      </p>

      <p class="mb-3">Do any of the applicants own any property?</p>
      <b-form-group class="mb-5" :disabled="ReadOnlyDA">
        <b-form-invalid-feedback
          :id="`ownHouse-feedback`"
          class="error"
          style="color: crimson"
          :state="validateState($v.ownHouse)"
          >Please provide the month you moved in</b-form-invalid-feedback
        >
        <b-form-radio v-model="ownHouse" :value="true" @change="addProperty()">
          Yes
        </b-form-radio>
        <b-form-radio
          v-model="$v.ownHouse.$model"
          :value="false"
          @change="removeAllProperties()"
        >
          No
        </b-form-radio>
      </b-form-group>
      <template v-if="ownHouse">
        <div
          v-for="(address, AddressIndex) in $v.propertyArray.$each.$iter"
          :key="AddressIndex"
        >
          <h3 class="font-weight-bold mb-3">
            Property {{ Number(AddressIndex) + 1 }}
          </h3>
          <h5 class="font-weight-bold mb-2">Address</h5>
          <AddressFinder
            v-if="address.$model.New"
            :id="`addressFinder-${address.$model.Id}`"
            :ref="`addressFinder-${address.$model.Id}`"
            :key="renderKey"
            :address="address.$model.Address"
            :disabled="ReadOnlyDA"
            :index="Number(AddressIndex)"
          />
          <template v-else>
            <p class="font-italic mb-0">
              {{ address.Address.$model.address1 }}
              {{ address.Address.$model.address2 }}
              {{ address.Address.$model.address3 }}
            </p>
            <p class="font-italic mb-3">
              {{ address.Address.$model.city }}
              {{ address.Address.$model.postCode }}
            </p>
          </template>

          <p class="mb-1">Who owns this property? (Choose all that apply.)</p>
          <b-form-invalid-feedback
            class="error mb-2"
            :state="
              validateArrayItemState('propertyArray', AddressIndex, 'isOwners')
            "
          >
            Please select who owns this property
          </b-form-invalid-feedback>
          <b-form-checkbox-group
            :id="`propertyArray-${AddressIndex}-isOwners`"
            v-model="address.Owners.$model"
            :disabled="ReadOnlyDA"
            stacked
          >
            <b-form-checkbox
              v-for="(applicant, i) in Applications"
              :id="`addressOwner-${AddressIndex}-${i}`"
              :key="i"
              :value="applicant.Id"
            >
              {{ applicant.ApplicantFirstName }}
              {{ applicant.ApplicantLastName }}
            </b-form-checkbox>
          </b-form-checkbox-group>
          <b-form-checkbox
            :checked="address.$model.OwnershipType === 'JointWithNonApplicant'"
            class="mb-4"
            :disabled="ReadOnlyDA"
            @change="updateOwnershipType(address.$model.Id)"
          >
            another person not named in this application
          </b-form-checkbox>

          <label for="outstanding-mortgage-amount">
            What is the outstanding mortgage amount on this property?
          </label>
          <b-form-invalid-feedback
            class="error mb-2"
            :state="
              validateArrayItemState(
                'propertyArray',
                AddressIndex,
                'OutstandingMortgageAmount'
              )
            "
          >
            Invalid amount
          </b-form-invalid-feedback>
          <b-input-group prepend="£" class="w-25 mb-3">
            <b-form-input
              :id="`propertyArray-${AddressIndex}-OutstandingMortgageAmount`"
              v-model="address.OutstandingMortgageAmount.$model"
              :disabled="ReadOnlyDA"
              class="w-25"
              type="number"
            />
          </b-input-group>

          <label for="property-value">
            What is the estimated value of this property?
          </label>
          <b-form-invalid-feedback
            class="error mb-2"
            :state="
              validateArrayItemState(
                'propertyArray',
                AddressIndex,
                'EstimatedValue'
              )
            "
          >
            Invalid value
          </b-form-invalid-feedback>
          <b-input-group prepend="£" class="w-25 mb-3">
            <b-form-input
              :id="`propertyArray-${AddressIndex}-EstimatedValue`"
              v-model="address.EstimatedValue.$model"
              :disabled="ReadOnlyDA"
              class="w-25"
              type="number"
            />
          </b-input-group>

          <p class="mb-1">
            The estimated funds you can raise by selling this property are
          </p>
          <p class="font-weight-bold mb-3">
            £
            {{
              numberWithCommas(
                (
                  Number(address.EstimatedValue.$model) -
                  Number(address.OutstandingMortgageAmount.$model)
                ).toFixed(2)
              )
            }}
          </p>

          <label for="equity-contribution">
            How much of this do you intend to use towards repaying the Self
            Build Wales loan?
          </label>
          <b-form-invalid-feedback
            class="error mb-2"
            :state="
              validateArrayItemState(
                'propertyArray',
                AddressIndex,
                'EquityToContribute'
              )
            "
          >
            Invalid equity
          </b-form-invalid-feedback>
          <b-input-group class="w-25 mb-4" prepend="£">
            <b-form-input
              :id="`propertyArray-${AddressIndex}-EquityToContribute`"
              v-model="address.EquityToContribute.$model"
              :disabled="ReadOnlyDA"
              class="w-25"
              type="number"
            />
          </b-input-group>

          <h5 class="font-weight-bold mb-3">
            Proposed date of sale of this property
          </h5>
          <b-form-invalid-feedback
            class="error mb-2"
            :state="
              validateArrayItemState(
                'propertyArray',
                AddressIndex,
                'DateOfSaleMonth'
              )
            "
          >
            Invalid month
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            class="error mb-2"
            :state="
              validateArrayItemState(
                'propertyArray',
                AddressIndex,
                'DateOfSaleYear'
              )
            "
          >
            Invalid year
          </b-form-invalid-feedback>
          <b-row no-gutters class="mb-4">
            <b-col cols="2" class="mr-2">
              <p class="mb-1">Month</p>
              <b-form-input
                :id="`propertyArray-${AddressIndex}-DateOfSaleMonth`"
                v-model="address.DateOfSaleMonth.$model"
                :disabled="ReadOnlyDA"
                type="number"
                placeholder="mm"
              />
            </b-col>
            <b-col cols="2">
              <p class="mb-1">Year</p>
              <b-form-input
                :id="`propertyArray-${AddressIndex}-DateOfSaleYear`"
                v-model="address.DateOfSaleYear.$model"
                :disabled="ReadOnlyDA"
                type="number"
                placeholder="yyyy"
              />
            </b-col>
          </b-row>

          <b-button
            variant="outline-danger"
            class="mb-5"
            :disabled="ReadOnlyDA"
            @click="$bvModal.show(`deleteModal-${address.$model.Id}`)"
          >
            Delete this property
          </b-button>
          <b-modal
            :id="`deleteModal-${address.$model.Id}`"
            title="Are you sure you want to remove this address?"
            :hide-header="true"
            centered
            @ok="deleteProperty(address.$model.Id)"
          >
            <p>Are you sure you want to remove this property?</p>
          </b-modal>
        </div>
        <p class="mb-2">
          Do you intend to repay the Self Build Wales loan from the sale
          proceeds of any other property?
        </p>
        <b-form-invalid-feedback
          :id="`DateOfSaleYear-feedback`"
          class="error"
          :state="validateState($v.moreProperties)"
        >
          please select
        </b-form-invalid-feedback>
        <b-form-group class="text mb-5">
          <b-form-radio-group
            id="moreProperties"
            v-model="moreProperties"
            :disabled="ReadOnlyDA"
            stacked
            @change="toggleMoreProperties"
          >
            <b-form-radio name="more-properties" :value="true">
              Yes
            </b-form-radio>
            <b-form-radio name="more-properties" :value="false">
              No
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </template>

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
import { v4 as uuidv4 } from "uuid";
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required, requiredIf, minValue } from "vuelidate/lib/validators";
import {
  validateFormNew,
  isYear,
  isMonth,
  validateAddress,
  isDateInFuture,
} from "@/lib/validation";
import { numberWithCommas, findMonth, findYear } from "~/lib/globalFunctions";
Vue.use(Vuelidate);

export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      ownHouse: false,
      propertyArray: [],
      moreProperties: false,
      renderKey: 0,
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
    Applications: {
      get() {
        return this.$store.getters["DetailedApplication/Applications"];
      },
    },
    EnoughFunding: {
      get() {
        return this.$store.getters["DetailedApplication/EnoughFunding"];
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    numberWithCommas,
    getData() {
      if (this.DetailedApplicationData) {
        this.createPropertyArray();
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "DetailedApplication/setDetailedApplicationData",
              response
            );
            this.createPropertyArray();
            this.loading = false;
          });
      }
    },
    createPropertyArray() {
      // find all owned properties
      const addresses = [];
      this.Applications.forEach((applicant) => {
        applicant.ApplicationAddresses.forEach((address) => {
          if (!address.Delete) {
            address.Owners = [applicant.Id];
            address.isOwners = true;
            addresses.push(address);
          }
        });
      });
      // work out unique and duplicate addresses
      const uniqueAddresses = [];
      const duplicateAddresses = [];
      addresses.forEach((address) => {
        // find duplicates
        const matches = addresses.filter(
          (a) => a.Address.Id === address.Address.Id
        );
        if (matches.length > 1) {
          const owners = matches.map((match) => match.Owners[0]);
          // if match not already included in duplicate addresses, add to duplicateAddresses
          const duplicateAddressMatches = duplicateAddresses.filter(
            (a) => a.Address.Id === address.Address.Id
          );
          if (!duplicateAddressMatches.length) {
            address.Owners = [...owners];
            duplicateAddresses.push(address);
          }
        } else {
          uniqueAddresses.push(address);
        }
      });
      const filteredAddresses = [...uniqueAddresses, ...duplicateAddresses];
      filteredAddresses.forEach((address) => {
        // add previous owners array to keep track of ownership changes
        address.PreviousOwners = address.Owners.map((o) => o);
        // add date of sale (month and year)
        let nullDateOfSale = false;
        if (address.ProposedDateOfSale.includes("0001-01-01"))
          nullDateOfSale = true;
        address.DateOfSaleMonth = nullDateOfSale
          ? ""
          : findMonth(address.ProposedDateOfSale);
        address.DateOfSaleYear = nullDateOfSale
          ? ""
          : findYear(address.ProposedDateOfSale);
        // rename address fields
        address.Address = {
          Id: address.Address.Id,
          IsDirty: address.Address.IsDirty,
          address1: address.Address.Address1,
          address2: address.Address.Address2,
          address3: address.Address.Address3,
          city: address.Address.City,
          postCode: address.Address.PostCode,
        };
      });
      const sortedAddresses = filteredAddresses.sort(
        (a, b) => a.ApplicationAddressNo - b.ApplicationAddressNo
      );
      this.propertyArray = sortedAddresses;
      if (this.propertyArray.length) this.ownHouse = true;
    },
    addProperty() {
      this.propertyArray.push({
        New: true,
        IsDirty: true,
        Delete: false,
        Id: uuidv4(),
        ApplicationAddressNo: this.propertyArray.length + 1,
        Address: {
          Id: uuidv4(),
          IsDirty: true,
          address1: "",
          address2: "",
          address3: "",
          city: "",
          postCode: "",
        },
        AddressType: "Additional",
        EquityToContribute: null,
        EstimatedValue: null,
        OutstandingMortgageAmount: null,
        Owners: [],
        isOwners: false,
        OwnershipType: "SoleOwnership",
        DateOfSaleMonth: "",
        DateOfSaleYear: "",
      });
      this.moreProperties = null;
    },
    deleteProperty(addressId) {
      this.mapNewAddressesToPropertiesArray();
      this.propertyArray = this.propertyArray.filter(
        (address) => address.Id !== addressId
      );
      if (!this.propertyArray.length) this.ownHouse = false;
    },
    removeAllProperties() {
      this.propertyArray = [];
    },
    toggleMoreProperties() {
      if (this.moreProperties) {
        this.addProperty();
      }
    },
    updateOwnershipType(addressId) {
      const match = this.propertyArray.find(
        (address) => address.Id === addressId
      );
      if (match.OwnershipType === "JointWithNonApplicant") {
        if (match.Owners.length > 1) match.OwnershipType = "JointOwnership";
        else match.OwnershipType = "SoleOwnership";
      } else match.OwnershipType = "JointWithNonApplicant";
    },
    mapNewAddressesToPropertiesArray() {
      this.propertyArray.forEach((property) => {
        if (property.New) {
          const newAddress = this.$refs[`addressFinder-${property.Id}`][0];
          if (newAddress) {
            property.Address.address1 = newAddress.address1;
            property.Address.address2 = newAddress.address2;
            property.Address.address3 = newAddress.address3;
            property.Address.city = newAddress.city;
            property.Address.postCode = newAddress.postCode;
          }
        }
      });
      this.renderKey += 1;
    },
    validateState(fieldModel) {
      const { $dirty, $error } = fieldModel;
      return $dirty ? !$error : null;
    },
    validateArrayItemState(array, index, name) {
      const { $dirty, $error } = this.$v[array].$each.$iter[index][name];
      return $dirty ? !$error : null;
    },
    save() {
      this.requestInProgress = true;
      // validate form
      if (validateFormNew(this)) {
        this.requestInProgress = false;
        return;
      }
      let anyInvalid = false;
      this.propertyArray.forEach((property) => {
        if (
          !anyInvalid &&
          property.New &&
          validateAddress(this.$refs[`addressFinder-${property.Id}`][0])
        ) {
          anyInvalid = true;
        }
      });
      if (anyInvalid) {
        this.requestInProgress = false;
        return;
      }
      // map data to store
      this.mapNewAddressesToPropertiesArray();
      this.$store.commit(
        "DetailedApplication/setPropertyOwnership",
        this.propertyArray
      );
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 10,
        completed: true,
      });
      // mark loan summary incomplete if insufficient funds
      if (!this.EnoughFunding) {
        this.$store.commit("DetailedApplication/updateSectionStatus", {
          pageNumber: 21,
          completed: false,
        });
      }
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
  validations() {
    return {
      ownHouse: {
        required,
      },
      propertyArray: {
        $each: {
          id: {},
          applicantFirstName: {},
          applicantLastName: {},
          Owners: {},
          isOwners: {
            isOwner(value, parent) {
              return parent.Owners.length;
            },
          },
          OutstandingMortgageAmount: {
            required,
            minValue: minValue(0),
          },
          EstimatedValue: {
            required,
            minValue: minValue(0),
          },
          EquityToContribute: {
            required,
            minValue: minValue(0),
            availableFunds(value, property) {
              const availableFunds =
                +property.EstimatedValue - +property.OutstandingMortgageAmount;
              return value <= availableFunds;
            },
          },
          DateOfSaleMonth: {
            required,
            isMonth,
          },
          DateOfSaleYear: {
            required,
            isYear,
            isDateInFuture: (value, property) => {
              return isDateInFuture({
                year: property.DateOfSaleYear,
                month: Number(property.DateOfSaleMonth),
                day: 1,
              });
            },
          },
          Address: {
            $each: {
              address1: {},
              address2: {},
              address3: {},
              city: {},
              postCode: {},
            },
          },
        },
      },
      moreProperties: {
        required: requiredIf(function () {
          return this.ownHouse;
        }),
      },
    };
  },
};
</script>

<style lang="scss"></style>
