<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-5">Upload design document</h1>

      <h5 class="font-weight-bold mb-1">Upload</h5>
      <p class="mb-3">
        Upload a copy of your client’s proposed house design document here.
      </p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <b-form-file
        id="houseDesignDocument"
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
export default {
  data() {
    return {
      loading: true,
      fileUploading: false,
      requestInProgress: false,
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
          .post(`/server-middleware/fileUpload`, formData, {
            headers: {
              Email: this.AccountData.Email,
              Authorization: this.ApiOptions.headers.Authorization,
              SingleFile: true,
              ServiceName: "SelfBuildWales",
              ApplicationReference:
                this.DetailedApplicationData.ApplicationReference,
              DocumentType: "HouseDesignDocument",
            },
          })
          .then((res) => {
            if (res.data === "file-type-error") {
              this.fileUploading = false;
              this.errorMessage = "Incorrect file type";
              this.scrollIntoView("houseDesignDocument");
            } else if (res.data === "file-size-error") {
              this.fileUploading = false;
              this.errorMessage = "Max file size is 5MB";
              this.scrollIntoView("houseDesignDocument");
            } else if (res.data === "success") {
              this.sendData();
            }
          });
      } else {
        this.sendData();
      }
    },
    sendData() {
      this.requestInProgress = true;
      // mark section complete
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 19,
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

<style lang="scss"></style>
