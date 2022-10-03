<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-3">Income</h1>
      <p class="mb-5">
        Give details of all current monthly income for each applicant.
      </p>

      <IncomeTable
        v-for="(applicant, index) in applicantIncomeArray"
        ref="applicantIncomeTable"
        :key="index"
        :index="index"
        :applicant="applicant"
        @addItem="addItem"
        @deleteItem="deleteItem"
      />

      <h3 class="font-weight-bold mb-3">Total income for all applicants</h3>
      <b-input-group prepend="£" class="input mb-5">
        <b-form-input disabled type="number" :value="TotalIncome" />
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
import IncomeTable from "~/components/detailed-application/IncomeTable";
export default {
  components: {
    IncomeTable,
  },
  data() {
    return {
      loading: true,
      requestInProgress: false,
      applicantIncomeArray: [],
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

    TotalIncome: {
      get() {
        const totals = [];
        this.applicantIncomeArray.forEach((applicant) => {
          const total = applicant.IncomeItems.map((item) =>
            Number(item.MonthlyIncome)
          ).reduce((a, b) => a + b, 0);
          totals.push(total);
        });
        return totals.reduce((a, b) => a + b, 0);
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      if (this.DetailedApplicationData) {
        // create applicant income array
        this.Applications.forEach((applicant) => {
          const IncomeItems = [];
          applicant.IncomeItems.forEach((item) => {
            IncomeItems.push({
              Id: item.Id,
              Name: item.Name,
              MonthlyIncome: item.MonthlyIncome,
              Hint: item.Hint,
              Description: item.Description,
              SequenceNo: item.SequenceNo,
            });
          });
          this.applicantIncomeArray.push({
            Id: applicant.Id,
            Number: applicant.ApplicationNumber,
            Name: `${
              applicant.ApplicantFirstName ? applicant.ApplicantFirstName : ""
            } ${
              applicant.ApplicantLastName ? applicant.ApplicantLastName : ""
            }`,
            IncomeItems,
          });
        });
        this.loading = false;
      } else {
        this.$detailedApplicationGetService
          .$get(``, this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "DetailedApplication/setDetailedApplicationData",
              response
            );
            // create applicant income array
            this.Applications.forEach((applicant) => {
              const IncomeItems = [];
              applicant.IncomeItems.forEach((item) => {
                IncomeItems.push({
                  Id: item.Id,
                  Name: item.Name,
                  MonthlyIncome: item.MonthlyIncome,
                  Hint: item.Hint,
                  Description: item.Description,
                  SequenceNo: item.SequenceNo,
                });
              });
              this.applicantIncomeArray.push({
                Id: applicant.Id,
                Number: applicant.ApplicationNumber,
                Name: `${
                  applicant.ApplicantFirstName
                    ? applicant.ApplicantFirstName
                    : ""
                } ${
                  applicant.ApplicantLastName ? applicant.ApplicantLastName : ""
                }`,
                IncomeItems,
              });
            });
            this.loading = false;
          });
      }
    },
    addItem(applicantId) {
      const applicant = this.applicantIncomeArray.find(
        (item) => item.Id === applicantId
      );
      applicant.IncomeItems.push({
        Id: uuidv4(),
        IsDirty: true,
        Name: "Other",
        MonthlyIncome: null,
        Hint: null,
        Description: "",
        SequenceNo: applicant.IncomeItems.length + 1,
      });
    },
    deleteItem(ids) {
      const applicant = this.applicantIncomeArray.find(
        (applicant) => applicant.Id === ids.applicantId
      );
      applicant.IncomeItems = applicant.IncomeItems.filter(
        (item) => item.Id !== ids.itemId
      );
    },
    save() {
      this.requestInProgress = true;
      // validate form
      let invalidFields = false;
      this.$refs.applicantIncomeTable.forEach(function (index) {
        if (index.$validator.validateAll()) {
          if (index.errors.any()) {
            invalidFields = true;
          }
        }
      });
      if (invalidFields) {
        this.requestInProgress = false;
        return;
      }
      // map income items to store
      this.$store.commit(
        "DetailedApplication/setIncomeItems",
        this.applicantIncomeArray
      );
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 8,
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
.input {
  width: 200px;
}
</style>
