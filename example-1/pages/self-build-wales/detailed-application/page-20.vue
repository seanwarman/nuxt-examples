<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-5">Build cost schedule</h1>

      <h5 class="font-weight-bold mb-1">Upload</h5>
      <p class="mb-3">
        Upload your completed Build Cost Schedule spreadsheet here.
      </p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <b-form-file
        id="buildCostSchedule"
        v-model="file"
        :disabled="ReadOnlyDA"
        class="mb-5 w-50"
        placeholder="Choose file..."
        drop-placeholder="Drop file here..."
        @change="errorMessage = null"
      />
      <img
        v-if="fileUploading"
        class="loading-wheel"
        src="/loadingwheel3.gif"
      />

      <p class="mb-2">
        A blank copy of the spreadsheet may have been sent to you already. If
        not you can download a copy using this link.
      </p>
      <p class="mb-5">
        <a
          href="https://developmentbankwales.sharepoint.com/:x:/s/DTDocuments/Ea2NIXL9cmZKnnOblFXVlogBNOhavoY63hP46ODFDhAPqQ?e=azV1xu"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download the Build Cost Schedule template
        </a>
        (xls 1.6Mb)
      </p>

      <div class="d-flex flex-column">
        <b-button
          variant="primary"
          class="align-self-start mb-3"
          :disabled="ReadOnlyDA"
          @click="save"
        >
          Save
        </b-button>
        <b-button
          variant="outline-primary"
          class="align-self-start"
          @click="backWithoutSaving"
        >
          Back without saving
        </b-button>
      </div>
    </b-form>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      fileUploading: false,
      file: null,
      errorMessage: null,
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
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
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
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    scrollIntoView(id) {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    },
    save() {
      if (this.file) {
        this.fileUploading = true;
        const formData = new FormData();
        formData.append("file", this.file);
        this.$middlewareService
          .post("/server-middleware/fileUpload", formData, {
            headers: {
              Email: this.AccountData.Email,
              Authorization: this.ApiOptions.headers.Authorization,
              SingleFile: true,
              ServiceName: "SelfBuildWales",
              ApplicationReference:
                this.DetailedApplicationData.ApplicationReference,
              DocumentType: "BuildCostSchedule",
            },
          })
          .then((res) => {
            if (res.data === "file-type-error") {
              this.fileUploading = false;
              this.errorMessage = "Incorrect file type";
              this.scrollIntoView("buildCostSchedule");
            } else if (res.data === "file-size-error") {
              this.fileUploading = false;
              this.errorMessage = "Max file size is 5MB";
              this.scrollIntoView("buildCostSchedule");
            } else if (res.data === "success") {
              this.sendData();
            }
          });
      } else {
        this.sendData();
      }
    },
    sendData() {
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 20,
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
          this.fileUploading = false;
          this.$router.push(`/self-build-wales/detailed-application/page-2`);
        });
    },
    backWithoutSaving() {
      this.$router.push(`/self-build-wales/detailed-application/page-2`);
    },
  },
};
</script>

<style lang="scss"></style>
