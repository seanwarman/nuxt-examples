<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Creditors</h1>
      <p class="mb-1">
        Give details of all current monthly payments to creditors, such as
        credit cards, store cards, car loans, personal loans and overdrafts.
      </p>
      <p class="mb-1">
        For each type of creditor, give the total current expenditure for
        everyone who will be in the new household.
      </p>
      <p class="mb-5">Add as many creditors as are needed.</p>

      <div class="designs-table-wrapper mb-3">
        <b-table :fields="tableFields" :items="tableItems" fixed class="mb-3">
          <template #cell(Name)="data">
            <div class="creditors">
              <p class="mb-0">
                {{ data.value }}
                {{ data.value === "Other" ? "(please specify)" : "" }}
              </p>
              <p
                v-show="errors.has(`description-${data.item.Id}`)"
                class="error"
                style="color: crimson"
              >
                {{ errors.first(`description-${data.item.Id}`) }}
              </p>
              <b-form-input
                v-if="data.value === 'Other'"
                :id="`description-${data.item.Id}`"
                v-model="data.item.Description"
                v-validate="'required'"
                :disabled="ReadOnlyDA"
                :name="`description-${data.item.Id}`"
                type="text"
              />
              <div>
                <b-button
                  variant="link"
                  @click="!ReadOnlyDA && deleteCreditor(data.item.Id)"
                >
                  Delete
                </b-button>
              </div>
            </div>
          </template>
          <template #cell(AmountOutStanding)="data">
            <b-form-invalid-feedback
              v-show="errors.has(`AmountOutStanding-${data.item.Id}`)"
              :id="`AmountOutStanding-${data.item.Id}-feedback`"
              class="error"
              style="color: crimson"
              >Please enter a valid number of adults</b-form-invalid-feedback
            >
            <p
              v-show="errors.has(`AmountOutStanding-${data.item.Id}`)"
              class="error"
              style="color: crimson"
            >
              {{ errors.first(`AmountOutStanding-${data.item.Id}`) }}
            </p>
            <b-input-group prepend="£" class="input">
              <b-form-input
                :id="`AmountOutStanding-${data.item.Id}`"
                v-model="data.item.AmountOutStanding"
                v-validate="'required|numeric'"
                :disabled="ReadOnlyDA"
                :name="`AmountOutStanding-${data.item.Id}`"
                type="number"
              />
            </b-input-group>
          </template>
          <template #cell(MonthlyPaymentOrSpend)="data">
            <p
              v-show="errors.has(`MonthlyPaymentOrSpend-${data.item.Id}`)"
              class="error"
              style="color: crimson"
            >
              {{ errors.first(`MonthlyPaymentOrSpend-${data.item.Id}`) }}
            </p>
            <b-input-group prepend="£" class="input">
              <b-form-input
                :id="`MonthlyPaymentOrSpend-${data.item.Id}`"
                v-model="data.item.MonthlyPaymentOrSpend"
                v-validate="'required|numeric'"
                :disabled="ReadOnlyDA"
                :name="`MonthlyPaymentOrSpend-${data.item.Id}`"
                type="number"
              />
            </b-input-group>
          </template>
        </b-table>
      </div>
      <b-form-invalid-feedback
        id="addCreditor-feedback"
        :state="checkCreditorAdded()"
        class="error mb-1"
      >
        please add at least one creditor
      </b-form-invalid-feedback>
      <b-dropdown
        id="add-creditor"
        text="Add a creditor"
        variant="outline-primary"
        name="add-creditor"
        class="align-self-start mb-5"
        :disabled="ReadOnlyDA"
      >
        <b-dropdown-item
          v-for="(option, index) in creditorOptions"
          :key="index"
          @click="addCreditor(option)"
        >
          {{ option }}
        </b-dropdown-item>
      </b-dropdown>

      <p class="font-weight-bold">Total monthly creditor expenditure</p>
      <b-input-group prepend="£" class="input mb-5">
        <b-form-input
          disabled
          type="number"
          :value="TotalMonthlyCreditorExpenditure"
        />
      </b-input-group>

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
import VeeValidate from "vee-validate";

Vue.use(VeeValidate, {
  inject: true,
  fieldsBagName: "veeFields",
});

export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      tableFields: [
        { key: "Name", label: "Creditor" },
        { key: "AmountOutStanding", label: "Amount outstanding" },
        { key: "MonthlyPaymentOrSpend", label: "Monthly Expenditure" },
      ],
      tableItems: [],
      creditorOptions: [
        "Credit card",
        "Store card",
        "Overdraft",
        "Personal loan",
        "Car loan / hire purchase",
        "Other",
      ],
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
      set: _.debounce(function (payload) {
        this.$store.commit(
          "DetailedApplication/setDetailedApplicationData",
          payload
        );
      }, 100),
    },
    CreditorItems: {
      get() {
        return this.$store.getters["DetailedApplication/CreditorItems"];
      },
      set: _.debounce(function (payload) {
        this.$store.commit("DetailedApplication/setCreditorItems", payload);
      }, 100),
    },
    TotalMonthlyCreditorExpenditure: {
      get() {
        return this.tableItems
          .map((item) => Number(item.MonthlyPaymentOrSpend))
          .reduce((a, b) => a + b, 0);
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.DetailedApplicationData) {
        this.tableItems = _.cloneDeep(this.CreditorItems);
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.DetailedApplicationData = response;
            this.tableItems = _.cloneDeep(this.CreditorItems);
            this.loading = false;
          });
      }
    },
    addCreditor(option) {
      this.tableItems.push({
        Id: uuidv4(),
        Name: option,
        AmountOutStanding: null,
        MonthlyPaymentOrSpend: null,
        Description: "",
      });
    },
    deleteCreditor(itemId) {
      this.tableItems = this.tableItems.filter((item) => item.Id !== itemId);
    },
    checkCreditorAdded() {
      return this.tableItems.length > 0;
    },
    save() {
      this.requestInProgress = true;
      // validate form
      this.$validator.validateAll();
      if (this.errors.any() || !this.checkCreditorAdded()) {
        this.requestInProgress = false;
        return;
      }
      // map creditor items to store
      this.$store.commit(
        "DetailedApplication/setCreditorItems",
        this.tableItems
      );
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 6,
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
    validateState(field) {
      console.log(field);
    },
    validateField(value, field) {
      console.log(field);
      console.log(value);
    },
  },
};
</script>

<style lang="scss">
.applicants {
  list-style-type: none;
  padding: 0;
}
.creditors {
  width: 200px;
}
.input {
  width: 200px;
}
.designs-table-wrapper {
  overflow-x: scroll;
  max-width: calc(100vw - 30px);

  table {
    width: auto;

    @media screen and (min-width: map-get($grid-breakpoints, "md")) {
      width: 100%;
    }
  }
}
</style>
