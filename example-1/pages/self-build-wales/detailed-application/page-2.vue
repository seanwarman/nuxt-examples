<template>
  <b-container class="p-4">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-5">
        Self Build Wales loan application form
      </h1>

      <div class="info-table col-md-6 mb-5">
        <div class="info-row">
          <p>
            Application reference: <b>{{ ApplicationReference }}</b>
          </p>
        </div>
        <div class="info-row">
          <p>
            Submission deadline: <b>{{ SubmissionDeadline }}</b>
          </p>
        </div>
        <div class="info-row">
          <p>
            Site name: <b>{{ SiteName }}</b>
          </p>
        </div>
        <div class="info-row">
          <p>
            Plot: <b>{{ PlotId }}</b>
          </p>
        </div>
        <div
          v-for="(applicant, index) in Applications"
          :key="index"
          class="info-row"
        >
          <p>
            Applicant name:
            <strong
              >{{ applicant.ApplicantFirstName }}
              {{ applicant.ApplicantLastName }}</strong
            >
          </p>
        </div>
      </div>

      <h3 class="font-weight-bold mb-3">Application contents</h3>

      <p class="mb-5">
        Each section of this application will be marked as complete when you
        save it.
        <br />
        All sections must be marked complete before you can submit the
        application.
      </p>

      <div class="contents-table col-md-6 mb-5">
        <ContentsRow
          v-for="(item, index) in SectionStatuses"
          :key="index"
          :data="item"
        />
      </div>

      <template v-if="SubmittedDA && ReadOnlyDA">
        <b-button
          variant="outline-primary"
          @click="navigateBack"
        >
          Back
        </b-button>
      </template>

      <b-button
        :variant="!AllSectionsComplete || ReadOnlyDA ? '' : 'primary'"
        :disabled="!AllSectionsComplete || ReadOnlyDA"
        @click="showModal = true"
      >
        Submit application
      </b-button>
      <b-modal v-model="showModal" centered title="Confirm submission">
        <p>Are you sure you want to submit the application form?</p>
        <template #modal-footer="{ cancel }">
          <b-button
            variant="outline-primary"
            :disabled="requestInProgress"
            @click="cancel()"
          >
            Cancel
          </b-button>
          <b-button
            variant="primary"
            :disabled="requestInProgress"
            @click="submitApplication"
          >
            Submit application
          </b-button>
        </template>
      </b-modal>
    </template>
  </b-container>
</template>

<script>
import ContentsRow from "~/components/detailed-application/ContentsRow";
export default {
  components: {
    ContentsRow,
  },
  data() {
    return {
      loading: true,
      requestInProgress: false,
      showModal: false,
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
    SubmittedDA: {
      get() {
        if (this.DetailedApplicationData.StatusCode === "Submitted") return true;
        else return false;
      },
    },
    ApplicationReference: {
      get() {
        return this.$store.getters["DetailedApplication/ApplicationReference"];
      },
    },
    SubmissionDeadline: {
      get() {
        return this.$store.getters["DetailedApplication/SubmissionDeadline"];
      },
    },
    SiteName: {
      get() {
        return this.$store.getters["DetailedApplication/SiteName"];
      },
    },
    PlotId: {
      get() {
        return this.$store.getters["DetailedApplication/PlotId"];
      },
    },
    Applications: {
      get() {
        return this.$store.getters["DetailedApplication/Applications"];
      },
    },
    SectionStatuses: {
      get() {
        return this.$store.getters["DetailedApplication/SectionStatuses"];
      },
    },
    AllSectionsComplete: {
      get() {
        if (!this.SectionStatuses.find((item) => !item.Complete)) return true;
        else return false;
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$detailedApplicationGetService
        .$get("", this.ApiOptions)
        .then((response) => {
          this.$store.commit(
            "DetailedApplication/setDetailedApplicationData",
            response
          );
          this.loading = false;
        });
    },
    submitApplication() {
      this.requestInProgress = true;
      // set submitted flag
      this.$store.commit("DetailedApplication/setSubmitted");
      // send data to backend
      this.$detailedApplicationPostService
        .$post("", this.DetailedApplicationData, this.ApiOptions)
        .then((response) => {
          this.$store.commit(
            "DetailedApplication/setDetailedApplicationData",
            response
          );         
          this.requestInProgress = false;
          this.showModal = false;
          this.$router.push('/user-account-area/my-applications');
        })
        .catch(() => (this.requestInProgress = false));
    },
    navigateBack() {
      this.$router.push("/user-account-area/my-applications");
    },
  },
};
</script>

<style lang="scss">
.info-table {
  border: 1px solid #ddd;
  padding: 0;
  border-radius: 5px;
}
.info-row {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
  p {
    margin: 0;
  }
}
.contents-table {
  border: 1px solid #ddd;
  padding: 0;
  border-radius: 5px;
}
</style>
