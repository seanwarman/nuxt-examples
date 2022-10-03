<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Expenditure</h1>
      <p class="mb-1">
        Give details of the current monthly spending for the people who will be
        living in the new home.
      </p>
      <p class="mb-5">
        Enter the total spending (from all relevant people) in each category.
      </p>

      <b-table :fields="tableFields" :items="tableItems" fixed class="mb-3">
        <template #cell(Name)="data">
          <div class="name">
            <p class="mb-0">
              {{ data.value }}
              {{ data.value === "Other" ? "(please specify)" : "" }}
            </p>
            <template v-if="data.value === 'Other'">
              <p
                v-show="errors.has(`description-${data.item.Id}`)"
                class="error"
                style="color: crimson"
              >
                {{ errors.first(`description-${data.item.Id}`) }}
              </p>
              <b-form-input
                :id="`description-${data.item.Id}`"
                v-model="data.item.Description"
                v-validate="'required'"
                :disabled="ReadOnlyDA"
                type="text"
                :name="`description-${data.item.Id}`"
              />
              <div>
                <b-button
                  variant="link"
                  @click="!ReadOnlyDA && deleteExpenditure(data.item.Id)"
                >
                  Delete
                </b-button>
              </div>
            </template>
          </div>
        </template>
        <template #cell(MonthlyTotal)="data">
          <p
            v-show="errors.has(`MonthlyTotal-${data.item.Id}`)"
            class="error"
            style="color: crimson"
          >
            {{ errors.first(`MonthlyTotal-${data.item.Id}`) }}
          </p>
          <b-input-group prepend="£" class="input">
            <b-form-input
              :id="`MonthlyTotal-${data.item.Id}`"
              v-model="data.item.MonthlyTotal"
              v-validate="'required|numeric'"
              :disabled="ReadOnlyDA"
              type="number"
              :name="`MonthlyTotal-${data.item.Id}`"
            />
          </b-input-group>
        </template>
      </b-table>

      <b-button
        variant="outline-primary"
        class="align-self-start mb-3"
        :disabled="ReadOnlyDA"
        @click="addExpenditure"
      >
        Add another expenditure
      </b-button>

      <p class="font-weight-bold">Total essential expenditure</p>
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
        { key: "Name", label: "Household expenditure" },
        { key: "MonthlyTotal", label: "Monthly total" },
        { key: "Hint", label: "" },
      ],
      tableItems: [],
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
    ExpenditureItems: {
      get() {
        return this.$store.getters["DetailedApplication/ExpenditureItems"];
      },
      set: _.debounce(function (payload) {
        this.$store.commit("DetailedApplication/setExpenditureItems", payload);
      }, 100),
    },
    TotalMonthlyCreditorExpenditure: {
      get() {
        return this.tableItems
          .map((item) => Number(item.MonthlyTotal))
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
        this.tableItems = _.cloneDeep(this.ExpenditureItems);
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.DetailedApplicationData = response;
            this.tableItems = _.cloneDeep(this.ExpenditureItems);
            this.loading = false;
          });
      }
    },
    addExpenditure(option) {
      this.tableItems.push({
        Id: uuidv4(),
        Name: "Other",
        MonthlyTotal: 0,
        Hint: "",
        Description: "",
        SequenceNo: this.tableItems.length + 1,
        IsDirty: true,
        Delete: false,
      });
    },
    deleteExpenditure(itemId) {
      this.tableItems = this.tableItems.filter((item) => item.Id !== itemId);
    },
    save() {
      this.requestInProgress = true;
      // validate form
      this.$validator.validateAll();
      if (this.errors.any()) {
        this.requestInProgress = false;
        return;
      }
      // map expenditure items to store
      this.$store.commit(
        "DetailedApplication/setExpenditureItems",
        this.tableItems
      );
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 7,
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
};
</script>

<style lang="scss">
.applicants {
  list-style-type: none;
  padding: 0;
}
.name {
  width: 200px;
}
.input {
  width: 200px;
}
</style>
