<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Loan summary</h1>
      <p class="mb-5">
        Give details of all costs. Add as many as are needed. The total of all
        costs on this page will be used to calculate the total amount of the
        loan you are applying for.
      </p>

      <h3 class="font-weight-bold mb-3">Costs</h3>
      <h5 class="font-weight-bold mb-1">Build costs</h5>
      <p class="mb-2">Enter the total amount of the builder’s cost estimate</p>
      <b-form-invalid-feedback
        id="buildCostEstimate-feedback"
        :state="validateState('buildCostEstimate')"
        class="error mb-1"
      >
        Invalid
      </b-form-invalid-feedback>
      <b-input-group prepend="£" class="mb-5 w-25">
        <b-form-input
          id="buildCostEstimate"
          ref="buildCostEstimate"
          v-model="$v.buildCostEstimate.$model"
          :disabled="ReadOnlyDA"
          :state="validateState('buildCostEstimate')"
          type="number"
        />
      </b-input-group>

      <b-button
        v-if="!otherCosts.length"
        class="mb-5"
        variant="outline-primary"
        :disabled="ReadOnlyDA"
        @click="addCost"
      >
        Add another cost
      </b-button>

      <b-row
        v-for="(cost, index) in $v.otherCosts.$each.$iter"
        :key="index"
        no-gutters
        class="mb-4"
      >
        <b-col>
          <h5 class="font-weight-bold mb-1">
            Other costs {{ Number(index) + 1 }}
          </h5>
          <p class="mb-1">Select the type of costs</p>
          <div>
            <b-form-invalid-feedback
              id="Amount-feedback"
              :state="validateArrayItemState('otherCosts', index, 'Title')"
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-form-group
              :id="`Title-${index}`"
              :ref="`Title-${index}`"
              :state="validateArrayItemState('otherCosts', index, 'Title')"
              :disabled="ReadOnlyDA"
              class="w-100 mb-3"
            >
              <b-form-radio v-model="cost.$model.Title" value="Architect">
                Architect
              </b-form-radio>
              <b-form-radio v-model="cost.$model.Title" value="Solicitor">
                Solicitor
              </b-form-radio>
              <b-form-radio v-model="cost.$model.Title" value="Contract admin">
                Contract admin
              </b-form-radio>
              <b-form-radio v-model="cost.$model.Title" value="Other">
                Other
                {{ cost.$model.Title === "Other" ? "(please specify)" : "" }}
                <b-form-invalid-feedback
                  id="Description-feedback"
                  :state="
                    validateArrayItemState('otherCosts', index, 'Description')
                  "
                  class="error mb-1"
                >
                  Invalid
                </b-form-invalid-feedback>
                <b-form-input
                  v-if="cost.$model.Title === 'Other'"
                  :id="`Description-${index}`"
                  :ref="`Description-${index}`"
                  v-model="cost.$model.Description"
                  :disabled="ReadOnlyDA"
                  :state="
                    validateArrayItemState('otherCosts', index, 'Description')
                  "
                  class="mb-3"
                  type="text"
                />
              </b-form-radio>
            </b-form-group>
          </div>
          <p class="mb-2">Enter the total amount of these costs</p>
          <div>
            <b-form-invalid-feedback
              id="Amount-feedback"
              :state="validateArrayItemState('otherCosts', index, 'Amount')"
              class="error mb-1"
            >
              Invalid
            </b-form-invalid-feedback>
            <b-input-group prepend="£" class="mb-1 w-25">
              <b-form-input
                :id="`Amount-${index}`"
                :ref="`Amount-${index}`"
                v-model="cost.Amount.$model"
                :disabled="ReadOnlyDA"
                :state="validateArrayItemState('otherCosts', index, 'Amount')"
                type="number"
              />
            </b-input-group>
          </div>
          <div>
            <b-button
              variant="link"
              class="mb-3"
              @click="!ReadOnlyDA && deleteCost(Number(index))"
            >
              Remove this cost
            </b-button>
          </div>
          <b-button
            v-if="otherCosts.length === Number(index) + 1"
            class="mb-5"
            variant="outline-primary"
            :disabled="ReadOnlyDA"
            @click="addCost"
          >
            Add another cost
          </b-button>
        </b-col>
      </b-row>

      <h5 class="font-weight-bold mb-1">Land purchase cost</h5>
      <p class="mb-0">Land purchase total cost</p>
      <p class="mb-3">£{{ numberWithCommas(TotalPlotLandCost) }}</p>

      <p class="mb-0">Plot purchase deposit you intend to pay</p>
      <p class="mb-2">£{{ numberWithCommas(PlotPurchaseDeposit) }}</p>

      <p class="mb-0">
        Remaining land purchase cost that will be part of the Self Build Wales
        loan
      </p>
      <p class="font-weight-bold mb-5">
        £{{ numberWithCommas(TotalPlotLandCost - PlotPurchaseDeposit) }}
      </p>

      <h3 class="font-weight-bold mb-1">Total Self Build Wales loan</h3>
      <p class="mb-2">The total loan you are applying for is</p>
      <b-input-group prepend="£" class="mb-5 w-25" disabled>
        <b-form-input v-model="TotalCosts" disabled type="number" />
      </b-input-group>

      <h3 class="font-weight-bold mb-3">Funding summary</h3>
      <h5 class="font-weight-bold mb-1">
        Sources of funding you have told us about
      </h5>
      <p class="mb-4">
        These are the sources of funding you have entered into this application.
      </p>
      <b-row no-gutters class="w-50">
        <b-col>
          <p class="font-weight-bold">Savings</p>
        </b-col>
        <b-col>
          <p>
            {{
              (SectionSavingsComplete) || Number(TotalUsedSavings) 
                ? `£ ${numberWithCommas(TotalUsedSavings)}`
                : "(none entered)"
            }}
          </p>
        </b-col>
      </b-row>
      <b-row no-gutters class="w-50">
        <b-col>
          <p class="font-weight-bold">Sale of property</p>
        </b-col>
        <b-col>
          <p>
            {{
            (PropertyOwnershipComplete) ||  Number(TotalPropertySales) 
                ? `£ ${numberWithCommas(TotalPropertySales)}`
                : "(none entered)"
            }}
          </p>
        </b-col>
      </b-row>
      <b-row no-gutters class="w-50">
        <b-col>
          <p class="font-weight-bold">New mortgage</p>
        </b-col>
        <b-col>
          <p>
            {{
              (NewMortageDetailsComplete) ||  Number(NewMortgageAmount)
                ? `£ ${numberWithCommas(NewMortgageAmount)}`
                : "(none entered)"
            }}
          </p>
        </b-col>
      </b-row>
      <b-row no-gutters class="total pt-2 pb-2 w-50 mb-5">
        <b-col>
          <p class="font-weight-bold mb-0">Total</p>
        </b-col>
        <b-col>
          <p class="mb-0">£ {{ numberWithCommas(TotalFunding) }}</p>
        </b-col>
      </b-row>

      <b-alert v-if="!EnoughFunding" show variant="danger" class="mb-5 w-50">
        <p>
          The funding you have detailed is not enough to pay for the total loan.
        </p>
        <p>
          You cannot submit the application until the funding is more than the
          loan value.
        </p>
      </b-alert>

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
import { required, requiredIf, integer } from "vuelidate/lib/validators";
import { validateRepeat } from "../../../lib/validation";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      buildCostEstimate: null,
      buildCosts: null,
      otherCosts: [],
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
    TotalPlotLandCost: {
      get() {
        return this.$store.getters["DetailedApplication/TotalPlotLandCost"];
      },
    },
    PlotPurchaseDeposit: {
      get() {
        return this.$store.getters["DetailedApplication/PlotPurchaseDeposit"];
      },
    },
    TotalCosts: {
      get() {
        const buildersCostEstimate = Number(this.buildCostEstimate);
        const totalOtherCosts = this.otherCosts
          .map((cost) => Number(cost.Amount))
          .reduce((a, b) => a + b, 0);
        const remainingLandPurchaseCost =
          Number(this.TotalPlotLandCost) - Number(this.PlotPurchaseDeposit);
        return (
          buildersCostEstimate + totalOtherCosts + remainingLandPurchaseCost
        );
      },
    },
    TotalUsedSavings: {
      get() {
        return this.$store.getters["DetailedApplication/TotalUsedSavings"];
      },
    },
    TotalPropertySales: {
      get() {
        return this.$store.getters["DetailedApplication/TotalPropertySales"];
      },
    },
    NewMortgageAmount: {
      get() {
        return this.$store.getters["DetailedApplication/NewMortgageAmount"];
      },
    },
      SectionStatuses: {
      get() {
        return this.$store.getters["DetailedApplication/SectionStatuses"];
      },
    },
    SectionSavingsComplete:{
      get() {
        //this will be not working when other language will be displayed. 
        //Needs to be added another field for identify the section.
        let savingsSection = this.SectionStatuses.find((item) => item.Title === 'Savings');
        
        if ((typeof savingsSection !== "undefined") && savingsSection.Complete) return true;
        else return false;
      }
    },
    NewMortageDetailsComplete:{
      get() {
        let newMortageSection = this.SectionStatuses.find((item) => item.Title === 'New Mortgage Details');
        
        if ((typeof newMortageSection !== "undefined") && newMortageSection.Complete) return true;
        else return false;
      }
    },
    PropertyOwnershipComplete:{
      get() {
        let propertyOwnershipSection = this.SectionStatuses.find((item) => item.Title === 'Property Ownership');
        
        if ((typeof propertyOwnershipSection !== "undefined") && propertyOwnershipSection.Complete) return true;
        else return false;
      }
    },
    EnoughFunding: {
      get() {
        if (
          Number(this.TotalUsedSavings) +
            Number(this.TotalPropertySales) +
            Number(this.NewMortgageAmount) <
          this.TotalCosts
        ) {
          return false;
        } else {
          return true;
        }
      },
    },
    TotalFunding: {
      get() {
        return (
          Number(this.TotalUsedSavings) +
          Number(this.TotalPropertySales) +
          Number(this.NewMortgageAmount)
        );
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    numberWithCommas(number) {
      if (number < 1000) return number;
      else return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getData() {
      if (this.DetailedApplicationData) {
        this.buildCostEstimate = this.DetailedApplicationData.BuildCostEstimate;
        this.otherCosts = this.DetailedApplicationData.BuildCosts;
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "DetailedApplication/setDetailedApplicationData",
              response
            );
            this.buildCostEstimate =
              this.DetailedApplicationData.BuildCostEstimate;
            this.otherCosts = this.DetailedApplicationData.BuildCosts;
            this.loading = false;
          });
      }
    },
    addCost() {
      this.otherCosts.push({
        Id: uuidv4(),
        IsDirty: true,
        SequenceNo: this.otherCosts.length + 1,
        Title: "",
        Description: "",
        Amount: null,
      });
    },
    deleteCost(costIndex) {
      this.otherCosts = this.otherCosts.filter(
        (cost, index) => index !== costIndex
      );
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    validateArrayItemState(array, index, name) {
      const { $dirty, $error } = this.$v[array].$each.$iter[index][name];
      return $dirty ? !$error : null;
    },
    save() {
      this.requestInProgress = true;
      // validate form
      if (validateRepeat(this.$v, this)) {
        this.requestInProgress = false;
        return;
      }
      // map data to store
      this.$store.commit("DetailedApplication/setBuildCostEstimate", this.buildCostEstimate);
      this.$store.commit("DetailedApplication/setBuildCosts", this.otherCosts);
      this.$store.commit("DetailedApplication/setLoanAmount", this.TotalCosts);
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 21,
        completed: this.EnoughFunding,
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
    buildCostEstimate: {
      required,
      integer,
    },
    otherCosts: {
      $each: {
        Amount: {
          required,
          integer,
        },
        Title: {
          required,
        },
        Description: {
          required: requiredIf(function (object) {
            return object.Title === "Other";
          }),
        },
      },
    },
  },
};
</script>

<style lang="scss">
.total {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
</style>
