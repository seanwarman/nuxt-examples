<template>
  <b-container class="p-3">
    <PageLoading v-if="loading" />
    <b-form v-else>
      <h1 class="font-weight-bold mb-5">Plots details</h1>

      <p class="mb-5">
        If the building design has changed since you completed the Decision in
        Principle form, you can select the new design here.
      </p>

      <table class="table mb-5">
        <tbody>
          <tr v-for="(item, index) in TableItems" :key="index">
            <th>{{ item.title }}</th>
            <td class="w-50">
              <template
                v-if="
                  item.title === 'Bedrooms' &&
                  designType.Name === 'Non-standard Design'
                "
              >
                <b-form-invalid-feedback
                  :id="`design-bedrooms-${index}-feedback`"
                  class="error"
                  style="color: crimson"
                  :state="validateState('noOfBedrooms')"
                  >Please enter a valid number of
                  bedrooms</b-form-invalid-feedback
                >
                <b-form-input
                  :id="`noOfBedrooms`"
                  :ref="`noOfBedrooms-${index}`"
                  v-model="$v.noOfBedrooms.$model"
                  :disabled="ReadOnlyDA"
                  class="w-25"
                  type="number"
                />
              </template>
              <template v-else>
                {{ item.value }}
              </template>
              <template v-if="item.title === 'Build design reference'">
                <b-dropdown
                  variant="outline-primary"
                  :disabled="ReadOnlyDA"
                  text="Change"
                  class="ml-3"
                >
                  <b-dropdown-item
                    v-for="(type, i) in buildingDesignTypes"
                    :key="i"
                    @click="updatedDesignType(type.PlotDesign.Id)"
                  >
                    {{ type.PlotDesign.Name }}
                  </b-dropdown-item>
                  <b-dropdown-divider />
                  <b-dropdown-item
                    @click="updatedDesignType('non-standard-design')"
                  >
                    Non-standard design
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <h6 class="font-weight-bold">Plot description</h6>
      <p
        class="mb-2 plot-description-text"
        :class="plotDescriptionExpanded && 'expanded'"
      >
        {{ plotDescription }}
      </p>
      <div class="d-flex mb-5">
        <a
          class="align-self-start link"
          @click="plotDescriptionExpanded = !plotDescriptionExpanded"
        >
          {{ plotDescriptionExpanded ? "Show less" : "Show more" }}
        </a>
      </div>

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
import {
  maxValue,
  minValue,
  numeric,
  required,
} from "vuelidate/lib/validators";
import { v4 as uuidv4 } from "uuid";
import { validateRepeat } from "~/lib/validation";
import { numberWithCommas } from "~/lib/globalFunctions";
Vue.use(Vuelidate);

export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      siteName: null,
      plotId: null,
      buildingDesignTypes: null,
      designType: null,
      noOfBedrooms: null,
      totalPlotLandCost: null,
      plotDescription: null,
      plotDescriptionExpanded: false,
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
    TableItems: {
      get() {
        return [
          { title: "Site name", value: this.siteName },
          { title: "Plot id", value: this.plotId },
          { title: "Build design reference", value: this.designType.Name },
          { title: "Bedrooms", value: this.noOfBedrooms },
          { title: "", value: null },
          {
            title: "Land purchase total cost",
            value: `£${numberWithCommas(this.totalPlotLandCost)}`,
          },
        ];
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
      this.siteName = d.SiteName;
      this.plotId = d.Plot.PlotId;
      this.buildingDesignTypes = d.BuildingDesignTypes;
      this.designType = d.DesignType;
      this.noOfBedrooms = d.DesignType.NoOfBedrooms;
      this.totalPlotLandCost = d.Plot.TotalPlotLandCost;
      this.plotDescription = d.Plot.PlotDescription;
    },
    updatedDesignType(itemId) {
      if (itemId === "non-standard-design") {
        const newDesignType = {
          Id: uuidv4(),
          IsDirty: true,
          MaxCost: 0,
          MinCost: 0,
          Name: "Non-standard Design",
          NoOfBedrooms: null,
        };
        this.designType = newDesignType;
        this.noOfBedrooms = newDesignType.NoOfBedrooms;
      } else {
        const newDesignType = this.buildingDesignTypes.find(
          (item) => item.PlotDesign.Id === itemId
        ).PlotDesign;
        this.designType = newDesignType;
        this.noOfBedrooms = newDesignType.NoOfBedrooms;
      }
    },
    save() {
      this.requestInProgress = true;
      // validate form
      if (validateRepeat(this.$v, this)) {
        this.requestInProgress = false;
        return;
      }
      // map data to store
      this.$store.commit("DetailedApplication/setPlotDetails", this);
      // update section status
      this.$store.commit("DetailedApplication/updateSectionStatus", {
        pageNumber: 3,
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
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
  },
  validations: {
    noOfBedrooms: {
      required,
      numeric,
      minValue: minValue(0),
      maxValue: maxValue(100),
    },
  },
};
</script>

<style lang="scss">
.hidden_header {
  display: none;
}
.plot-description-text {
  max-height: 90px;
  overflow: hidden;
  &.expanded {
    max-height: none;
  }
}
.link {
  &:hover {
    cursor: pointer;
  }
}
</style>
