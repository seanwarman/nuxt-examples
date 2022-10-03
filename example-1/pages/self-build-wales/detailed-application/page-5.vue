<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Address history</h1>
      <p class="mb-5">
        You must provide at least 3 years address history for each applicant.
        (This can include addresses outside the UK.)
      </p>

      <ul class="applicants mb-5">
        <li
          v-for="(applicant, applicantIndex) in $v.applicantsArray.$each.$iter"
          :key="applicantIndex"
          class="mb-5"
        >
          <h3 class="font-weight-bold mb-4">
            Applicant {{ Number(applicantIndex) + 1 }}
          </h3>
          <h6 class="font-weight-bold mb-1">Applicant name</h6>
          <p class="mb-4">
            {{ applicant.applicantFirstName.$model }}
            {{ applicant.applicantLastName.$model }}
          </p>

          <h6 class="font-weight-bold mb-1">Current address</h6>
          <p class="mb-1">
            {{ applicant.addresses.$each[0].address.address1.$model }}
          </p>
          <p class="mb-1">
            {{ applicant.addresses.$each[0].address.city.$model }}
          </p>
          <p class="mb-4">
            {{ applicant.addresses.$each[0].address.postCode.$model }}
          </p>
          <b-form-invalid-feedback
            class="error mb-3"
            :state="
              validateState(
                $v.applicantsArray.$each[applicantIndex].addressHistoryComplete
              )
            "
          >
            You must provide at least 3 years address history with no gaps.
          </b-form-invalid-feedback>

          <h6
            :id="`applicantsArray-${applicantIndex}-addressHistoryComplete`"
            class="font-weight-bold mb-2"
          >
            When did you move to your current address?
          </h6>
          <b-form-invalid-feedback
            :id="`moveInMonth-${applicantIndex}-feedback`"
            class="error"
            style="color: crimson"
            :state="
              validateState(
                $v.applicantsArray.$each[applicantIndex].addresses.$each[0]
                  .moveInMonth
              )
            "
          >
            Please provide the month you moved in
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            :id="`moveInYear-${applicantIndex}-feedback`"
            class="error"
            style="color: crimson"
            :state="
              validateState(
                $v.applicantsArray.$each[applicantIndex].addresses.$each[0]
                  .moveInYear
              )
            "
          >
            Please provide the year you moved in
          </b-form-invalid-feedback>
          <b-row no-gutters class="mb-5">
            <b-col cols="2" class="mr-2">
              <p class="mb-1">Month</p>
              <b-form-input
                :id="`applicantsArray-${applicantIndex}-addresses-${0}-moveInMonth`"
                v-model="applicant.addresses.$each[0].moveInMonth.$model"
                :disabled="ReadOnlyDA"
                type="number"
                placeholder="mm"
              />
            </b-col>
            <b-col cols="2">
              <p class="mb-1">Year</p>
              <b-form-input
                :id="`applicantsArray-${applicantIndex}-addresses-${0}-moveInYear`"
                v-model="applicant.addresses.$each[0].moveInYear.$model"
                :disabled="ReadOnlyDA"
                type="number"
                placeholder="yyyy"
              />
            </b-col>
          </b-row>

          <template
            v-if="Object.keys(applicant.addresses.$each.$iter).length > 1"
          >
            <h5 class="font-weight-bold mb-3">Previous addresses</h5>
            <div
              v-for="(address, addressIndex) in applicant.addresses.$each.$iter"
              :key="addressIndex"
            >
              <template v-if="!address.$model.isCurrentAddress">
                <h6 class="font-weight-bold mb-1">Add a new address</h6>
                <AddressFinder
                  :id="`addressFinder-${applicant.$model.id}-${address.$model.id}`"
                  :ref="`addressFinder-${applicant.$model.id}-${address.$model.id}`"
                  :key="renderKey"
                  :address="address.address.$model"
                  :disabled="ReadOnlyDA"
                  :index="Number(addressIndex)"
                />

                <h6 class="font-weight-bold mb-2">
                  When did you move to this address?
                </h6>
                <b-form-invalid-feedback
                  :id="`moveInMonth-${applicantIndex}-feedback`"
                  class="error"
                  style="color: crimson"
                  :state="
                    validateState(
                      $v.applicantsArray.$each[applicantIndex].addresses.$each[
                        addressIndex
                      ].moveInMonth
                    )
                  "
                >
                  Please provide the month you moved in
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  :id="`moveInYear-${applicantIndex}-feedback`"
                  class="error"
                  style="color: crimson"
                  :state="
                    validateState(
                      $v.applicantsArray.$each[applicantIndex].addresses.$each[
                        addressIndex
                      ].moveInYear
                    )
                  "
                >
                  Please provide the year you moved in
                </b-form-invalid-feedback>
                <b-row no-gutters class="mb-3">
                  <b-col cols="2" class="mr-2">
                    <p class="mb-1">Month</p>
                    <b-form-input
                      :id="`applicantsArray-${applicantIndex}-addresses-${addressIndex}-moveInMonth`"
                      v-model="address.moveInMonth.$model"
                      :disabled="ReadOnlyDA"
                      type="number"
                      placeholder="mm"
                    />
                  </b-col>
                  <b-col cols="2">
                    <p class="mb-1">Year</p>
                    <b-form-input
                      :id="`applicantsArray-${applicantIndex}-addresses-${addressIndex}-moveInYear`"
                      v-model="address.moveInYear.$model"
                      :disabled="ReadOnlyDA"
                      type="number"
                      placeholder="yyyy"
                    />
                  </b-col>
                </b-row>

                <h6 class="font-weight-bold mb-2">
                  When did you leave this address?
                </h6>
                <b-form-invalid-feedback
                  :id="`addresses-${addressIndex}-moveOutMonth-${applicantIndex}-feedback`"
                  class="error"
                  style="color: crimson"
                  :state="
                    validateState(
                      $v.applicantsArray.$each[applicantIndex].addresses.$each[
                        addressIndex
                      ].moveOutMonth
                    )
                  "
                >
                  Please provide the month you moved in
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  :id="`addresses-${addressIndex}-moveOutYear-${applicantIndex}-feedback`"
                  class="error"
                  style="color: crimson"
                  :state="
                    validateState(
                      $v.applicantsArray.$each[applicantIndex].addresses.$each[
                        addressIndex
                      ].moveOutYear
                    )
                  "
                >
                  Please provide the year you moved out
                </b-form-invalid-feedback>
                <b-row no-gutters class="mb-4">
                  <b-col cols="2" class="mr-2">
                    <p class="mb-1">Month</p>
                    <b-form-input
                      :id="`applicantsArray-${applicantIndex}-addresses-${addressIndex}-moveOutMonth`"
                      v-model="address.moveOutMonth.$model"
                      :disabled="ReadOnlyDA"
                      type="number"
                      placeholder="mm"
                    />
                  </b-col>
                  <b-col cols="2">
                    <p class="mb-1">Year</p>
                    <b-form-input
                      :id="`applicantsArray-${applicantIndex}-addresses-${addressIndex}-moveOutYear`"
                      v-model="address.moveOutYear.$model"
                      :disabled="ReadOnlyDA"
                      type="number"
                      placeholder="yyyy"
                    />
                  </b-col>
                </b-row>
                <b-row no-gutters class="mb-3">
                  <b-button
                    variant="outline-danger"
                    class="mb-3"
                    :disabled="ReadOnlyDA"
                    @click="$bvModal.show(`modal-${address.$model.id}`)"
                  >
                    Remove this address
                  </b-button>
                  <b-modal
                    :id="`modal-${address.$model.id}`"
                    title="Confirm deletion"
                    centered
                  >
                    <p>Are you sure you want to remove this address?</p>
                    <template #modal-footer="{ cancel }">
                      <b-button @click="cancel()"> Cancel </b-button>
                      <b-button
                        variant="danger"
                        @click="
                          removeAddress(applicant.id.$model, address.$model.id)
                        "
                      >
                        Remove address
                      </b-button>
                    </template>
                  </b-modal>
                </b-row>
              </template>
            </div>
          </template>
          <p class="mb-2">You must provide at least 3 years address history</p>
          <b-button
            variant="outline-primary"
            class="mb-4"
            :disabled="ReadOnlyDA"
            @click="addAddress(applicant.id.$model)"
          >
            I need to add another address
          </b-button>
        </li>
      </ul>

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
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import {
  required,
  minLength,
  maxLength,
  numeric,
  requiredIf,
} from "vuelidate/lib/validators";
import {
  isDateInPast,
  validateFormNew,
  isMonth,
  validateAddress,
} from "~/lib/validation";
import { findMonth, findYear } from "~/lib/globalFunctions";
Vue.use(Vuelidate);

export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      applicantsArray: [],
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
  },
  mounted() {
    this.getData();
  },
  methods: {
    createApplicantArray() {
      this.Applications.forEach((applicant) => {
        const newApplicantObject = {
          id: applicant.Id,
          applicantFirstName: applicant.ApplicantFirstName,
          applicantLastName: applicant.ApplicantLastName,
          addressHistoryComplete: null,
          addresses: [],
        };
        const sortedAddressHistory = applicant.AddressHistory.sort(
          (a, b) => a.SequenceNo - b.SequenceNo
        );
        sortedAddressHistory.forEach((address) => {
          let nullFrom = false;
          let nullTo = false;
          if (address.From.includes("0001-01-01")) nullFrom = true;
          if (address.To.includes("0001-01-01")) nullTo = true;
          newApplicantObject.addresses.push({
            id: address.Id,
            sequenceNo: address.SequenceNo,
            isCurrentAddress: address.IsCurrentAddress,
            moveInMonth: nullFrom ? "" : findMonth(address.From),
            moveInYear: nullFrom ? "" : findYear(address.From),
            moveOutMonth: nullTo ? "" : findMonth(address.To),
            moveOutYear: nullTo ? "" : findYear(address.To),
            address: {
              address1: address.Address1,
              address2: address.Address2,
              address3: address.Address3,
              city: address.City,
              postCode: address.PostCode,
            },
          });
        });
        this.applicantsArray.push(newApplicantObject);
      });
    },
    getData() {
      if (this.DetailedApplicationData) {
        this.createApplicantArray();
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "DetailedApplication/setDetailedApplicationData",
              response
            );
            this.createApplicantArray();
            this.loading = false;
          });
      }
    },
    addAddress(applicantId) {
      const applicant = this.applicantsArray.find(
        (applicant) => applicant.id === applicantId
      );
      applicant.addresses.push({
        id: uuidv4(),
        sequenceNo: applicant.addresses.length + 1,
        isCurrentAddress: false,
        moveInMonth: "",
        moveInYear: "",
        moveOutMonth: "",
        moveOutYear: "",
        address: {
          address1: "",
          address2: "",
          address3: "",
          city: "",
          postCode: "",
        },
      });
    },
    removeAddress(applicantId, addressId) {
      this.mapNewAddressesToPropertiesArray();
      const applicant = this.applicantsArray.find(
        (applicant) => applicant.id === applicantId
      );
      applicant.addresses = applicant.addresses.filter(
        (address) => address.id !== addressId
      );
      this.$bvModal.hide(`modal-${addressId}`);
      this.renderKey += 1;
    },
    mapNewAddressesToPropertiesArray() {
      this.applicantsArray.forEach((applicant, index) => {
        applicant.addresses.forEach((address, index) => {
          if (!address.isCurrentAddress) {
            const newAddress =
              this.$refs[`addressFinder-${applicant.id}-${address.id}`][0];
            if (newAddress) {
              address.address.address1 = newAddress.address1;
              address.address.address2 = newAddress.address2;
              address.address.address3 = newAddress.address3;
              address.address.city = newAddress.city;
              address.address.postCode = newAddress.postCode;
            }
          }
        });
      });
    },
    save() {
      this.requestInProgress = true;
      // validate form
      if (validateFormNew(this)) {
        this.requestInProgress = false;
        return;
      }
      let invalidField = false;
      this.applicantsArray.forEach((applicant) => {
        applicant.addresses.forEach((address) => {
          if (
            !invalidField &&
            !address.isCurrentAddress &&
            validateAddress(
              this.$refs[`addressFinder-${applicant.id}-${address.id}`][0]
            )
          )
            invalidField = true;
        });
      });
      if (invalidField) {
        this.requestInProgress = false;
        return;
      }
      // add addresses to array
      this.mapNewAddressesToPropertiesArray();
      // map array to store
      this.$store.commit(
        "DetailedApplication/setAddressHistories",
        this.applicantsArray
      );
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 5,
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
    validateState(fieldModel) {
      const { $dirty, $error } = fieldModel;
      return $dirty ? !$error : null;
    },
    validateChild() {
      this.$v.$touch();
      let invalidField = _.findKey(
        this.$v.$params,
        (value, key) => this.$v[key].$invalid
      );
      if (invalidField) {
        invalidField = this.$refs[`${invalidField}-${this.applicationIndex}`];
        const invalidFieldId = invalidField.id;
        document.getElementById(invalidFieldId).scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
      return invalidField;
    },
  },
  validations() {
    return {
      applicantsArray: {
        $each: {
          id: {},
          applicantFirstName: {},
          applicantLastName: {},
          addressHistoryComplete: {
            addressHistoryComplete(value, parent) {
              // create dates from address history
              const addressDates = [];
              parent.addresses.forEach((address) => {
                const startDate = new Date(
                  address.moveInYear,
                  address.moveInMonth
                );
                let endDate = new Date();
                if (!address.isCurrentAddress) {
                  endDate = new Date(address.moveOutYear, address.moveOutMonth);
                }
                const monthsAtAddress =
                  endDate.getMonth() -
                  startDate.getMonth() +
                  12 * (endDate.getFullYear() - startDate.getFullYear());
                addressDates.push({ startDate, endDate, monthsAtAddress });
              });
              // order dates
              const sortedAddressDates = addressDates.sort(
                (a, b) => b.endDate - a.endDate
              );
              // check for gaps
              let gap = false;
              sortedAddressDates.forEach((date, index) => {
                if (index < sortedAddressDates.length - 1) {
                  const currentStartDate = date.startDate;
                  const previousEndDate = sortedAddressDates[index + 1].endDate;
                  if (currentStartDate > previousEndDate) {
                    gap = true;
                  }
                }
              });
              // check total length
              const totalMonths =
                sortedAddressDates
                  .map((date) => date.monthsAtAddress)
                  .reduce((a, b) => a + b, 0) + 1;
              return !gap && totalMonths >= 36;
            },
          },
          addresses: {
            $each: {
              address: {
                address1: {},
                city: {},
                postCode: {},
              },
              moveInMonth: {
                required,
                numeric,
                isMonth,
              },
              moveInYear: {
                required,
                numeric,
                minLength: minLength(4),
                maxLength: maxLength(4),
                isDateInPast: (value, property) => {
                  return isDateInPast({
                    year: property.moveInYear,
                    month: Number(property.moveInMonth),
                    day: 1,
                  });
                },
              },
              moveOutMonth: {
                required: requiredIf(function (addresses) {
                  return addresses.sequenceNo > 1;
                }),
                numeric,
                isMonth,
              },
              moveOutYear: {
                required: requiredIf(function (addresses) {
                  return addresses.sequenceNo > 1;
                }),
                numeric,
                minLength: minLength(4),
                maxLength: maxLength(4),
                isDateInPast: (value, property) => {
                  return isDateInPast({
                    year: property.moveOutYear,
                    month: Number(property.moveOutMonth),
                    day: 1,
                  });
                },
              },
            },
          },
        },
      },
    };
  },
};
</script>

<style lang="scss">
.applicants {
  list-style-type: none;
  padding: 0;
}
</style>
