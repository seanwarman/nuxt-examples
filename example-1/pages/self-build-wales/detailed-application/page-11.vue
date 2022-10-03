<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">New mortgage details</h1>

      <b-row no-gutters class="mb-5">
        <b-col>
          <p class="mb-3">
            Do you intend to finance the Self Build Wales loan by taking out a
            new mortgage?
          </p>
          <b-form-invalid-feedback
            id="usingMortgage-feedback"
            :state="validateState('usingMortgage')"
            class="error mb-1"
          >
            Invalid
          </b-form-invalid-feedback>
          <b-form-group :disabled="ReadOnlyDA">
            <b-form-radio
              v-model="$v.usingMortgage.$model"
              :state="validateState('usingMortgage')"
              :value="true"
              @change="resetToNull"
            >
              Yes
            </b-form-radio>
            <b-form-radio
              v-model="$v.usingMortgage.$model"
              :state="validateState('usingMortgage')"
              :value="false"
              @change="resetToZero"
            >
              No
            </b-form-radio>
          </b-form-group>
        </b-col>
      </b-row>

      <template v-if="usingMortgage">
        <h6 class="font-weight-bold mb-1">New mortgage amount</h6>
        <p class="mb-2">
          The amount you intent to borrow under the new mortgage
        </p>
        <b-form-invalid-feedback
          id="newMortgageAmount-feedback"
          :state="validateState('newMortgageAmount')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-input-group prepend="£" class="mb-4 w-25">
          <b-form-input
            id="newMortgageAmount"
            ref="newMortgageAmount"
            v-model="$v.newMortgageAmount.$model"
            :disabled="ReadOnlyDA"
            :state="validateState('newMortgageAmount')"
            type="number"
          />
        </b-input-group>

        <h6 class="font-weight-bold mb-1">Repayment term</h6>
        <p class="mb-2">How many years is the term of the new mortgage?</p>
        <b-form-invalid-feedback
          id="repaymentTerm-feedback"
          :state="validateState('repaymentTerm')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          id="repaymentTerm"
          ref="repaymentTerm"
          v-model="$v.repaymentTerm.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('repaymentTerm')"
          class="mb-4 w-25"
          type="number"
        />

        <h6 class="font-weight-bold mb-1">Monthly repayments</h6>
        <p class="mb-2">What will be the (estimated) monthly repayments?</p>
        <b-form-invalid-feedback
          id="monthlyRepayments-feedback"
          :state="validateState('monthlyRepayments')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-input-group prepend="£" class="mb-5 w-25">
          <b-form-input
            id="monthlyRepayments"
            ref="monthlyRepayments"
            v-model="$v.monthlyRepayments.$model"
            :disabled="ReadOnlyDA"
            :state="validateState('monthlyRepayments')"
            type="number"
          />
        </b-input-group>

        <h3 class="font-weight-bold mb-1">Employment details</h3>
        <p class="mb-4">
          You need to tell us the employment details of the applicants.
        </p>

        <div
          v-for="(applicant, index) in $v.applicantsArray.$each.$iter"
          :key="index"
          class="mb-5"
        >
          <h5 class="font-weight-bold mb-1">
            Applicant {{ Number(index) + 1 }}
          </h5>
          <p class="mb-3">{{ applicant.name.$model }}</p>

          <p class="mb-1">Employment status</p>
          <div>
            <b-form-invalid-feedback
              id="employmentStatus-feedback"
              :state="
                validateArrayItemState(
                  'applicantsArray',
                  index,
                  'employmentStatus'
                )
              "
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-form-radio-group
              :id="`employmentStatus-${index}`"
              :ref="`employmentStatus-${index}`"
              v-model="applicant.employmentStatus.$model"
              :disabled="ReadOnlyDA"
              :state="
                validateArrayItemState(
                  'applicantsArray',
                  index,
                  'employmentStatus'
                )
              "
              class="mb-3"
              :options="employmentStatusOptions"
              text-field="text"
              stacked
            />
          </div>

          <template
            v-if="
              applicant.employmentStatus.$model === 'employed' ||
              applicant.employmentStatus.$model === 'self-employed'
            "
          >
            <p class="font-weight-bold mb-1">Job title</p>
            <div>
              <b-form-invalid-feedback
                id="jobTitle-feedback"
                :state="
                  validateArrayItemState('applicantsArray', index, 'jobTitle')
                "
                class="error mb-1"
              >
                Invalid
              </b-form-invalid-feedback>
              <b-form-input
                :id="`jobTitle-${index}`"
                :ref="`jobTitle-${index}`"
                v-model="applicant.jobTitle.$model"
                :disabled="ReadOnlyDA"
                :state="
                  validateArrayItemState('applicantsArray', index, 'jobTitle')
                "
                class="mb-3 w-50"
                type="text"
              />
            </div>

            <p class="font-weight-bold mb-1">Name of employer</p>
            <div>
              <b-form-invalid-feedback
                id="nameOfEmployer-feedback"
                :state="
                  validateArrayItemState(
                    'applicantsArray',
                    index,
                    'nameOfEmployer'
                  )
                "
                class="error mb-1"
              >
                Invalid
              </b-form-invalid-feedback>
              <b-form-input
                :id="`nameOfEmployer-${index}`"
                :ref="`nameOfEmployer-${index}`"
                v-model="applicant.nameOfEmployer.$model"
                :disabled="ReadOnlyDA"
                :state="
                  validateArrayItemState(
                    'applicantsArray',
                    index,
                    'nameOfEmployer'
                  )
                "
                class="mb-3 w-50"
                type="text"
              />
            </div>

            <p class="font-weight-bold mb-1">Employer’s address</p>
            <AddressFinder
              :ref="`employer-address-${index}`"
              :index="Number(index)"
              type="employer-address"
              :address="applicant.employerAddress.$model"
              :disabled="ReadOnlyDA"
            />

            <p class="font-weight-bold mb-1">Usual place of work</p>
            <p class="mb-1">Choose a location type</p>
            <div>
              <b-form-invalid-feedback
                id="usualPlaceOfWork-feedback"
                :state="
                  validateArrayItemState(
                    'applicantsArray',
                    index,
                    'usualPlaceOfWork'
                  )
                "
                class="error mb-1"
              >
                Invalid
              </b-form-invalid-feedback>
              <b-form-group
                :id="`usualPlaceOfWork-${index}`"
                :ref="`usualPlaceOfWork-${index}`"
                :disabled="ReadOnlyDA"
                class="mb-3"
              >
                <b-form-radio
                  v-model="applicant.usualPlaceOfWork.$model"
                  :state="
                    validateArrayItemState(
                      'applicantsArray',
                      index,
                      'usualPlaceOfWork'
                    )
                  "
                  :value="'Fixed address'"
                >
                  Fixed address
                </b-form-radio>
                <b-form-radio
                  v-model="applicant.usualPlaceOfWork.$model"
                  :state="
                    validateArrayItemState(
                      'applicantsArray',
                      index,
                      'usualPlaceOfWork'
                    )
                  "
                  :value="'Mobile'"
                >
                  Mobile
                </b-form-radio>
              </b-form-group>
            </div>
            <template
              v-if="applicant.usualPlaceOfWork.$model === 'Fixed address'"
            >
              <AddressFinder
                :ref="`work-address-${index}`"
                :index="Number(index)"
                type="work-address"
                :address="applicant.workAddress.$model"
                :disabled="ReadOnlyDA"
              />
            </template>

            <h6 class="font-weight-bold mb-2">
              When did you start working for this employer?
            </h6>
            <b-form-invalid-feedback
              id="startDate-feedback"
              :state="
                validateArrayItemNestedValueState(
                  'applicantsArray',
                  index,
                  'startDate',
                  'month'
                )
              "
              class="error mb-1"
            >
              Invalid month
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
              id="startDate-feedback"
              :state="
                validateArrayItemNestedValueState(
                  'applicantsArray',
                  index,
                  'startDate',
                  'year'
                )
              "
              class="error mb-1"
            >
              Invalid year
            </b-form-invalid-feedback>
            <b-row
              :id="`startDate-${index}`"
              :ref="`startDate-${index}`"
              no-gutters
              class="mb-3"
            >
              <b-col cols="2" class="mr-2">
                <p class="mb-1">Month</p>
                <b-form-input
                  v-model="applicant.startDate.$model.month"
                  :disabled="ReadOnlyDA"
                  :state="
                    validateArrayItemNestedValueState(
                      'applicantsArray',
                      index,
                      'startDate',
                      'month'
                    )
                  "
                  type="number"
                  placeholder="mm"
                />
              </b-col>
              <b-col cols="2">
                <p class="mb-1">Year</p>
                <b-form-input
                  v-model="applicant.startDate.$model.year"
                  :disabled="ReadOnlyDA"
                  :state="
                    validateArrayItemNestedValueState(
                      'applicantsArray',
                      index,
                      'startDate',
                      'year'
                    )
                  "
                  type="number"
                  placeholder="yyyy"
                />
              </b-col>
            </b-row>
          </template>
        </div>
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
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required, requiredIf, numeric } from "vuelidate/lib/validators";
import {
  validateRepeat,
  validateAddress,
  isAssigned,
  isMonth,
  isYear,
} from "~/lib/validation";
import { findBoolean, findMonth, findYear } from "~/lib/globalFunctions";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      usingMortgage: null,
      newMortgageAmount: null,
      repaymentTerm: null,
      monthlyRepayments: null,
      applicantsArray: [],
      employmentStatusOptions: ["employed", "self-employed", "not employed"],
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
      const d = this.DetailedApplicationData;
      this.usingMortgage = findBoolean(d.UsingMortgage);
      this.newMortgageAmount = d.MortgageAmount;
      this.repaymentTerm = d.MortgageRepaymentTerm;
      this.monthlyRepayments = d.MortgagePaymentMonthlyEstimated;
      // create applicants array
      d.Applications.forEach((applicant) => {
        const es = applicant.Employer.EmploymentStatus;
        let employmentStatus;
        if (es === "UnSelected") employmentStatus = null;
        if (es === "Employed") employmentStatus = "employed";
        if (es === "NotEmployed") employmentStatus = "not employed";
        if (es === "SelfEmployed") employmentStatus = "self-employed";
        const wp = applicant.Employer.WorkPlaceAddress.WorkPlaceLocationType;
        let usualPlaceOfWork;
        if (wp === "UnAssigned") usualPlaceOfWork = null;
        if (wp === "FixedAddress") usualPlaceOfWork = "Fixed address";
        if (wp === "Mobile") usualPlaceOfWork = "Mobile";
        let nullStartDate = false;
        if (applicant.Employer.EmploymentStartDate.includes("0001-01-01"))
          nullStartDate = true;
        this.applicantsArray.push({
          id: applicant.Id,
          name: `${
            applicant.ApplicantFirstName ? applicant.ApplicantFirstName : ""
          } ${applicant.ApplicantLastName ? applicant.ApplicantLastName : ""}`,
          employmentStatus,
          jobTitle: applicant.Employer.JobTitle,
          nameOfEmployer: applicant.Employer.EmployerName,
          employerAddress: {
            address1: applicant.Employer.Address1,
            address2: applicant.Employer.Address2,
            address3: applicant.Employer.Address3,
            city: applicant.Employer.City,
            postCode: applicant.Employer.PostCode,
          },
          usualPlaceOfWork,
          workAddress: {
            address1: applicant.Employer.WorkPlaceAddress.Address1,
            address2: applicant.Employer.WorkPlaceAddress.Address2,
            address3: applicant.Employer.WorkPlaceAddress.Address3,
            city: applicant.Employer.WorkPlaceAddress.City,
            postCode: applicant.Employer.WorkPlaceAddress.PostCode,
          },
          startDate: {
            id: applicant.Id,
            month: nullStartDate
              ? ""
              : findMonth(applicant.Employer.EmploymentStartDate),
            year: nullStartDate
              ? ""
              : findYear(applicant.Employer.EmploymentStartDate),
          },
          isMainApplication: applicant.IsMainApplication,
        });
      });
      // move main applicant to top of applicantsArray
      const mainApplicant = this.applicantsArray.find(
        (a) => a.isMainApplication
      );
      this.applicantsArray.unshift(mainApplicant);
      this.applicantsArray = this.applicantsArray.filter(
        (a, i) => i === 0 || !a.isMainApplication
      );
    },
    resetApplicantsArray() {
      this.applicantsArray.forEach((applicant) => {
        applicant.employerAddress.address1 = null;
        applicant.employerAddress.address2 = null;
        applicant.employerAddress.address3 = null;
        applicant.employerAddress.city = null;
        applicant.employerAddress.postCode = null;
        applicant.employmentStatus = null;
        applicant.jobTitle = null;
        applicant.nameOfEmployer = null;
        applicant.startDate.month = "";
        applicant.startDate.year = "";
        applicant.usualPlaceOfWork = null;
        applicant.workAddress.address1 = null;
        applicant.workAddress.address2 = null;
        applicant.workAddress.address3 = null;
        applicant.workAddress.city = null;
        applicant.workAddress.postCode = null;
      });
    },
    resetToZero() {
      this.newMortgageAmount = 0;
      this.repaymentTerm = 0;
      this.monthlyRepayments = 0;
      this.resetApplicantsArray();
    },
    resetToNull() {
      this.newMortgageAmount = null;
      this.repaymentTerm = null;
      this.monthlyRepayments = null;
      this.resetApplicantsArray();
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    validateArrayItemState(array, index, name) {
      const { $dirty, $error } = this.$v[array].$each.$iter[index][name];
      return $dirty ? !$error : null;
    },
    validateArrayItemNestedValueState(array, index, name, value) {
      const { $dirty, $error } = this.$v[array].$each.$iter[index][name][value];
      return $dirty ? !$error : null;
    },
    save() {
      this.requestInProgress = true;
      // validate form
      if (validateRepeat(this.$v, this)) {
        this.requestInProgress = false;
        return;
      }
      let anyInvalid = false;
      this.applicantsArray.forEach((applicant, index) => {
        if (
          applicant.employmentStatus === "employed" ||
          applicant.employmentStatus === "self-employed"
        ) {
          if (validateAddress(this.$refs[`employer-address-${index}`][0]))
            anyInvalid = true;
          if (applicant.usualPlaceOfWork === "Fixed address") {
            if (validateAddress(this.$refs[`work-address-${index}`][0]))
              anyInvalid = true;
          }
        }
      });
      if (anyInvalid) {
        this.requestInProgress = false;
        return;
      }
      // add addresses to array
      this.applicantsArray.forEach((applicant, index) => {
        if (
          applicant.employmentStatus === "employed" ||
          applicant.employmentStatus === "self-employed"
        ) {
          const employerAddress = this.$refs[`employer-address-${index}`][0];
          applicant.employerAddress = {
            address1: employerAddress.address1,
            address2: employerAddress.address2,
            address3: employerAddress.address3,
            city: employerAddress.city,
            postCode: employerAddress.postCode,
          };
        }
        if (applicant.usualPlaceOfWork === "Fixed address") {
          const workAddress = this.$refs[`work-address-${index}`][0];
          applicant.workAddress = {
            address1: workAddress.address1,
            address2: workAddress.address2,
            address3: workAddress.address3,
            city: workAddress.city,
            postCode: workAddress.postCode,
          };
        }
      });
      // map array to store
      this.$store.commit("DetailedApplication/setNewMortgageDetails", this);
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 11,
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
      usingMortgage: {
        required,
        isAssigned,
      },
      newMortgageAmount: {
        required: requiredIf(function () {
          return this.usingMortgage;
        }),
        numeric,
      },
      repaymentTerm: {
        required: requiredIf(function () {
          return this.usingMortgage;
        }),
        numeric,
        minValue: (value) => {
          return this.usingMortgage ? value >= 1 : true;
        },
        maxValue: (value) => {
          return this.usingMortgage ? value <= 40 : true;
        },
      },
      monthlyRepayments: {
        required: requiredIf(function () {
          return this.usingMortgage;
        }),
        numeric,
      },
      applicantsArray: {
        $each: {
          id: {},
          name: {},
          employmentStatus: {
            required: requiredIf(function () {
              return this.usingMortgage;
            }),
          },
          jobTitle: {
            required: requiredIf(function (object) {
              return (
                this.usingMortgage &&
                (object.employmentStatus === "employed" ||
                  object.employmentStatus === "self-employed")
              );
            }),
          },
          nameOfEmployer: {
            required: requiredIf(function (object) {
              return (
                this.usingMortgage &&
                (object.employmentStatus === "employed" ||
                  object.employmentStatus === "self-employed")
              );
            }),
          },
          employerAddress: {},
          usualPlaceOfWork: {
            required: requiredIf(function (object) {
              return (
                this.usingMortgage &&
                (object.employmentStatus === "employed" ||
                  object.employmentStatus === "self-employed")
              );
            }),
          },
          workAddress: {},
          startDate: {
            month: {
              required: requiredIf(function (object) {
                const key = _.findKey(
                  this.$v.applicantsArray.$each.$iter,
                  (value) => {
                    return value.id.$model === object.id;
                  }
                );
                const employmentStatus =
                  this.$v.applicantsArray.$each.$iter[key].employmentStatus
                    .$model;
                return (
                  this.usingMortgage &&
                  (employmentStatus === "employed" ||
                    employmentStatus === "self-employed")
                );
              }),
              isMonth,
            },
            year: {
              required: requiredIf(function (object) {
                const key = _.findKey(
                  this.$v.applicantsArray.$each.$iter,
                  (value) => {
                    return value.id.$model === object.id;
                  }
                );
                const employmentStatus =
                  this.$v.applicantsArray.$each.$iter[key].employmentStatus
                    .$model;
                return (
                  this.usingMortgage &&
                  (employmentStatus === "employed" ||
                    employmentStatus === "self-employed")
                );
              }),
              isYear,
            },
          },
        },
      },
    };
  },
};
</script>

<style lang="scss"></style>
