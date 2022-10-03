<template>
  <b-container>
    <b-form v-if="mounted" class="p-3">
      <h1 class="font-weight-bold mb-4">{{ $t("Plot application") }}</h1>

      <h6 class="font-weight-bold">{{ $t("Applicant name") }}</h6>
      <p class="mb-4">{{ ApplicantFirstName }} {{ ApplicantLastName }}</p>

      <h6 class="font-weight-bold">{{ $t("Site overview") }}</h6>
      <p class="mb-4">
        {{ $t("site_address") }}: {{ Site }}
        <br />
        {{ $t("Plot ID") }}: {{ PlotId }}
      </p>

      <h6 class="font-weight-bold">{{ $t("Plot description") }}</h6>
      <p
        class="mb-2 plot-description-text"
        :class="plotDescriptionExpanded && 'expanded'"
      >
        {{ PlotDescription }}
      </p>
      <div class="d-flex mb-4">
        <a
          role="button"
          class="align-self-start"
          @click="plotDescriptionExpanded = !plotDescriptionExpanded"
        >
          {{
            !plotDescriptionExpanded
              ? "↓ " + $t("Show more")
              : "↑ " + $t("Show less")
          }}
        </a>
      </div>

      <h6 class="font-weight-bold">{{ $t("Building design options") }}</h6>
      <p class="mb-5">
        {{ $t("building_design_options_text") }}
      </p>
      <div class="designs-table-wrapper">
        <b-table class="mb-5" hover :items="tableItems" :fields="tableFields" />
      </div>

      <h6 class="font-weight-bold">{{ $t("land_purchase_deposit") }}:</h6>
      <h6 class="font-weight-bold mb-5">
        25% {{ $t("of") }} £{{ numberWithCommas(TotalPlotLandCost) }} = £{{
          numberWithCommas(TotalPlotLandCost / 4)
        }}
      </h6>

      <h6 class="font-weight-bold">{{ $t("choose_building_design_label") }}</h6>
      <p class="mb-3">
        {{ $t("choose_building_design_additional_text") }}
      </p>
      <p>
        <a
          href="https://developmentbankwales.sharepoint.com/:b:/s/DTDocuments/ESWClgAewzBKkqI8g-tYpAcBFjaI_RZhjNNEVYcfDW7vSQ?e=mFfhxf"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t("design_guide_link") }}
        </a>
      </p>
      <b-form-group id="plot-designtype-group-1">
        <b-form-invalid-feedback
          id="plot-designtype-feedback"
          :state="validateState('selectedDesignType')"
          class="error"
          style="color: crimson"
          >{{ $t("choose_building_design_error") }}
        </b-form-invalid-feedback>
        <b-form-radio-group
          id="plot-designtype"
          ref="selectedDesignType"
          v-model="$v.form.selectedDesignType.$model"
          class="mb-5"
          :options="designTypeRadioButtons"
          :state="validateState('selectedDesignType')"
          text-field="text"
          aria-describedby="plot-designtype-feedback"
          stacked
          :disabled="ReadOnlyPA"
          @change="validateState('selectedDesignType')"
        />
      </b-form-group>

      <h3 class="font-weight-bold mb-3">{{ $t("Applicant details") }}</h3>
      <b-form-group id="plot-numberOfAdults-group">
        <h6 class="font-weight-bold">{{ $t("how_many_adults") }}</h6>
        <p class="mb-2">({{ $t("how_many_adults_additional_text") }})</p>
        <b-form-invalid-feedback
          id="plot-numberOfAdults-feedback"
          :state="validateState('HowManyAdults')"
          class="error"
          style="color: crimson"
          >{{ $t("how_many_adults_error") }}</b-form-invalid-feedback
        >
        <b-form-input
          id="plot-numberOfAdults"
          ref="HowManyAdults"
          v-model="$v.form.HowManyAdults.$model"
          :disabled="ReadOnlyPA"
          class="w-25 mb-3"
          :state="validateState('HowManyAdults')"
        />
      </b-form-group>
      <b-form-group id="plot-numberOfChildren-group">
        <h6 class="font-weight-bold">{{ $t("how_many_children") }}</h6>
        <p class="mb-2">({{ $t("how_many_children_additional_text") }})</p>
        <b-form-invalid-feedback
          id="plot-numberOfChildren-feedback"
          :state="validateState('HowManyChildren')"
          class="error"
          style="color: crimson"
          >{{ $t("how_many_children_error") }}</b-form-invalid-feedback
        >
        <b-form-input
          id="plot-numberOfChildren"
          ref="HowManyChildren"
          v-model="$v.form.HowManyChildren.$model"
          :disabled="ReadOnlyPA"
          class="w-25 mb-3"
          :state="validateState('HowManyChildren')"
        />
      </b-form-group>
      <b-form-group id="plot-ownHouse-group">
        <h6 class="font-weight-bold">{{ $t("do_you_own_house") }}</h6>
        <b-form-invalid-feedback
          id="plot-ownHouse-feedback"
          :state="validateState('OwnHouse')"
          class="error"
          style="color: crimson"
          >{{ $t("do_you_own_house_error") }}</b-form-invalid-feedback
        >
        <b-form-radio-group
          id="plot-ownHouse"
          ref="OwnHouse"
          v-model="$v.form.OwnHouse.$model"
          :disabled="ReadOnlyPA"
          class="mb-5"
          :options="ownHouseOptions"
          text-field="text"
          :state="validateState('OwnHouse')"
          stacked
          @change="validateState('OwnHouse')"
        />
      </b-form-group>

      <h3 class="font-weight-bold mb-3">{{ $t("Plot priorities") }}</h3>
      <div class="d-flex mb-3">
        <a
          class="align-self-start"
          role="button"
          @click="showPlotPriorities = !showPlotPriorities"
        >
          {{
            showPlotPriorities ? "↑ " + $t("Hide (Welsh)") : "↓ " + $t("Show")
          }}
          {{ $t("plot priorities") }}
        </a>
      </div>
      <div v-if="showPlotPriorities" class="mb-5" v-html="PlotPriorities" />

      <h6 class="mt-4 font-weight-bold">{{ $t("Supporting information") }}</h6>
      <b-form-group id="plot-supportingInfo-group">
        <p class="mb-2">
          {{ $t("supporting_information_additional_text") }}
        </p>
        <b-form-invalid-feedback
          id="plot-supportingInfo-feedback"
          :state="validateState('SupportingInformation')"
          class="error"
          >{{ $t("supporting_information_error") }}</b-form-invalid-feedback
        >
        <b-form-textarea
          id="plot-supportingInfo"
          ref="SupportingInformation"
          v-model="$v.form.SupportingInformation.$model"
          :disabled="ReadOnlyPA"
          class="mb-5"
          rows="3"
          max-rows="6"
          maxlength="10000"
          :state="validateState('SupportingInformation')"
        />
      </b-form-group>
      <h6 class="font-weight-bold">
        {{ $t("Additional design requirements") }}
      </h6>
      <p class="mb-2">
        {{ $t("additional_design_requirements_additional_text") }}
      </p>
      <b-form-textarea
        ref="AdditionalDesignRequirements"
        v-model="$v.form.AdditionalDesignRequirements.$model"
        :disabled="ReadOnlyPA"
        class="mb-5"
        rows="3"
        max-rows="6"
        maxlength="10000"
        :state="validateState('AdditionalDesignRequirements')"
      />

      <h6 class="font-weight-bold">{{ $t("Plot priorities and criteria") }}</h6>
      <p class="mb-2">
        {{ $t("plot_priorities_criteria_text") }}
      </p>
      <b-form-group id="plot-readTCs-group">
        <p class="mb-2">
          {{ $t("plot_priorities_criteria_additional_text") }}
        </p>
        <b-form-invalid-feedback
          id="plot-readTCs-feedback"
          :state="validateState('ReadAndUnderstandPlotCriteria')"
          class="error"
          style="color: crimson"
          >{{ $t("plot_priorities_criteria_error") }}</b-form-invalid-feedback
        >
        <b-form-checkbox
          id="plot-readTCs"
          ref="ReadAndUnderstandPlotCriteria"
          v-model="$v.form.ReadAndUnderstandPlotCriteria.$model"
          :disabled="ReadOnlyPA"
          class="mb-5"
          :state="validateState('ReadAndUnderstandPlotCriteria')"
        >
          {{ $t("plot_priorities_criteria_label") }}
        </b-form-checkbox>
      </b-form-group>
      <h6 class="font-weight-bold">{{ $t("Estimated costs") }}</h6>
      <b-form-group id="plot-acceptCostEstmate-group">
        <p class="mb-2">
          {{ $t("estimated_costs_text") }}
        </p>
        <b-form-invalid-feedback
          id="plot-acceptCostEstmate-feedback"
          :state="validateState('AcceptEstimatedCosts')"
          class="error"
          style="color: crimson"
          >{{ $t("estimated_costs_error") }}</b-form-invalid-feedback
        >
        <b-form-checkbox
          id="plot-acceptCostEstmate"
          ref="AcceptEstimatedCosts"
          v-model="$v.form.AcceptEstimatedCosts.$model"
          :disabled="ReadOnlyPA"
          class="mb-5"
          :state="validateState('AcceptEstimatedCosts')"
        >
          {{ $t("estimated_costs_label") }}
        </b-form-checkbox>
      </b-form-group>

      <b-button
        v-if="!requestInProgress"
        variant="outline-primary"
        class="mr-2"
        @click="navigateBack"
      >
        Back
      </b-button>
      <b-button variant="primary" :disabled="ReadOnlyPA" @click="launchModel">
        {{ $t("submit_application") }}
      </b-button>

      <b-modal v-model="showModal" centered title="Confirm submission">
        <p>Are you sure you want to submit your application form?</p>
        <template #modal-footer="{ cancel }">
          <b-button
            variant="outline-primary"
            :disabled="requestInProgress"
            @click="cancel()"
          >
            {{ $t("cancel") }}
          </b-button>
          <b-button
            variant="primary"
            :disabled="requestInProgress"
            @click="submitApplication"
          >
            {{ $t("submit_application") }}
          </b-button>
        </template>
      </b-modal>
    </b-form>
  </b-container>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import {
  required,
  numeric,
  minValue,
  maxValue,
  maxLength,
} from "vuelidate/lib/validators";
import _ from "lodash";
import { validateForm, isTrue } from "../../../lib/validation";
Vue.use(Vuelidate);

const validateIsTrue = isTrue;

export default {
  data() {
    return {
      mounted: false,
      plotDescriptionExpanded: false,
      requestInProgress: false,
      tableFields: [
        { key: "House_design", label: "" },
        {
          key: "Estimated_build_cost",
          label: this.$i18n.t("estimated_build_cost"),
        },
        { key: "Land_purchase", label: this.$i18n.t("land_purchase") },
        {
          key: "Estimated_total_cost",
          label: this.$i18n.t("estimated_total_cost"),
        },
      ],
      tableItems: [],
      designTypeRadioButtons: [],
      selectedDesignType: null,
      ownHouseOptions: [
        { text: this.$i18n.t("answer_yes"), value: true },
        { text: this.$i18n.t("answer_no"), value: false },
      ],
      showPlotPriorities: false,
      showModal: false,
      form: {
        selectedDesignType: this.selectedDesignType,
        HowManyAdults: this.HowManyAdults,
        HowManyChildren: this.HowManyChildren,
        OwnHouse: this.OwnHouse,
        PlotPriorities: this.PlotPriorities,
        SupportingInformation: this.SupportingInformation,
        AdditionalDesignRequirements: this.AdditionalDesignRequirements,
        ReadAndUnderstandPlotCriteria: this.ReadAndUnderstandPlotCriteria,
        AcceptEstimatedCosts: this.AcceptEstimatedCosts,
      },
    };
  },
  computed: {
    ReadOnlyPA: {
      get() {
        return this.$store.getters["Global/ReadOnlyPA"];
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
    PlotApplicationData: {
      get() {
        return this.$store.getters["PlotApplication/PlotApplicationData"];
      },
    },
    ApplicantFirstName: {
      get() {
        return this.$store.getters["PlotApplication/ApplicantFirstName"];
      },
    },
    ApplicantLastName: {
      get() {
        return this.$store.getters["PlotApplication/ApplicantLastName"];
      },
    },
    Site: {
      get() {
        return this.$store.getters["PlotApplication/Site"];
      },
    },
    PlotId: {
      get() {
        return this.$store.getters["PlotApplication/PlotId"];
      },
    },
    PlotDescription: {
      get() {
        return this.$store.getters["PlotApplication/PlotDescription"];
      },
    },
    TotalPlotLandCost: {
      get() {
        return this.$store.getters["PlotApplication/TotalPlotLandCost"];
      },
    },
    BuildingDesignTypes: {
      get() {
        return this.$store.getters["PlotApplication/BuildingDesignTypes"];
      },
    },
    HowManyAdults: {
      get() {
        return this.$store.getters["PlotApplication/HowManyAdults"];
      },
      set: _.debounce(function (payload) {
        this.$store.commit("PlotApplication/setHowManyAdults", payload);
      }, 100),
    },
    HowManyChildren: {
      get() {
        return this.$store.getters["PlotApplication/HowManyChildren"];
      },
      set: _.debounce(function (payload) {
        this.$store.commit("PlotApplication/setHowManyChildren", payload);
      }, 100),
    },
    OwnHouse: {
      get() {
        return this.$store.getters["PlotApplication/OwnHouse"];
      },
      set: _.debounce(function (payload) {
        this.$store.commit("PlotApplication/setOwnHouse", payload);
      }, 100),
    },
    PlotPriorities: {
      get() {
        return this.$store.getters["PlotApplication/PlotPriorities"];
      },
    },
    SupportingInformation: {
      get() {
        return this.$store.getters["PlotApplication/SupportingInformation"];
      },
      set: _.debounce(function (payload) {
        this.$store.commit("PlotApplication/setSupportingInformation", payload);
      }, 100),
    },
    AdditionalDesignRequirements: {
      get() {
        return this.$store.getters[
          "PlotApplication/AdditionalDesignRequirements"
        ];
      },
      set: _.debounce(function (payload) {
        this.$store.commit(
          "PlotApplication/setAdditionalDesignRequirements",
          payload
        );
      }, 100),
    },
    ReadAndUnderstandPlotCriteria: {
      get() {
        return this.$store.getters[
          "PlotApplication/ReadAndUnderstandPlotCriteria"
        ];
      },
      set: _.debounce(function (payload) {
        this.$store.commit(
          "PlotApplication/setReadAndUnderstandPlotCriteria",
          payload
        );
      }, 100),
    },
    AcceptEstimatedCosts: {
      get() {
        return this.$store.getters["PlotApplication/AcceptEstimatedCosts"];
      },
      set: _.debounce(function (payload) {
        this.$store.commit("PlotApplication/setAcceptEstimatedCosts", payload);
      }, 100),
    },
  },
  watch: {
    "form.HowManyAdults"(newVal) {
      // to work with changes in "myArray"
      this.HowManyAdults = newVal;
    },
    "form.selectedDesignType"(newVal) {
      // to work with changes in "myArray"
      this.selectedDesignType = newVal;
    },
    "form.HowManyChildren"(newVal) {
      // to work with changes in "myArray"
      this.HowManyChildren = newVal;
    },
    "form.OwnHouse"(newVal) {
      // to work with changes in "myArray"
      this.OwnHouse = newVal;
    },
    "form.SupportingInformation"(newVal) {
      // to work with changes in "myArray"
      this.SupportingInformation = newVal;
    },
    "form.AdditionalDesignRequirements"(newVal) {
      // to work with changes in "myArray"
      this.AdditionalDesignRequirements = newVal;
    },
    "form.ReadAndUnderstandPlotCriteria"(newVal) {
      // to work with changes in "myArray"
      this.ReadAndUnderstandPlotCriteria = newVal;
    },
    "form.AcceptEstimatedCosts"(newVal) {
      // to work with changes in "myArray"
      this.AcceptEstimatedCosts = newVal;
    },
  },
  mounted() {
    this.preparePlotData();
    this.mounted = true;
  },
  created() {
    // eslint-disable-next-line no-unused-expressions
    this.form.selectedDesignType = this.selectedDesignType;
    this.form.HowManyAdults = this.HowManyAdults;
    this.form.HowManyChildren = this.HowManyChildren;
    this.form.OwnHouse = this.OwnHouse;
    this.form.SupportingInformation = this.SupportingInformation;
    this.form.AdditionalDesignRequirements = this.AdditionalDesignRequirements;
    this.form.ReadAndUnderstandPlotCriteria =
      this.ReadAndUnderstandPlotCriteria;
    this.form.AcceptEstimatedCosts = this.AcceptEstimatedCosts;
  },
  methods: {
    numberWithCommas(number) {
      if (number < 1000) return number;
      else return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    launchModel() {
      this.$v.form.$touch();
      if (validateForm(this.$v.form, this)) {
        return;
      }
      this.showModal = true;
    },
    submitApplication() {
      this.requestInProgress = true;
      // update selected design type
      if (this.form.selectedDesignType) {
        this.$store.commit(
          "PlotApplication/setSelectedDesignType",
          this.form.selectedDesignType
        );
        this.$store.commit("Global/setApiParams", {
          email: this.AccountData.Email,
          plotId: "Plot12345",
          buildingTypeName: this.BuildingDesignTypes.find(
            (type) => type.PlotDesign.Id === this.form.selectedDesignType
          ).PlotDesign.Name,
        });
      }
      // send data
      this.$plotApplicationPostService
        .$post("", this.PlotApplicationData, this.ApiOptions)
        .then((res) => {
          this.$router.push(`/user-account-area/my-applications`);
          this.requestInProgress = false;
        })
        .catch(() => (this.requestInProgress = false));
    },
    preparePlotData() {
      const sortedData = _.uniqBy(this.BuildingDesignTypes, "PlotDesign.Id");

      sortedData.forEach((option) => {
        // create table data
        this.tableItems.push({
          House_design: option.PlotDesign.Name,
          Estimated_build_cost: `£${this.numberWithCommas(
            option.PlotDesign.MinCost
          )} - £${this.numberWithCommas(option.PlotDesign.MaxCost)}`,
          Land_purchase: `£${this.numberWithCommas(this.TotalPlotLandCost)}`,
          Estimated_total_cost: `£${this.numberWithCommas(
            option.PlotDesign.MinCost + this.TotalPlotLandCost
          )} - £${this.numberWithCommas(
            option.PlotDesign.MaxCost + this.TotalPlotLandCost
          )}`,
        });
        // create radio button data
        this.designTypeRadioButtons.push({
          text: option.PlotDesign.Name,
          value: option.PlotDesign.Id,
        });
        // set selected option
        if (option.IsSelected)
          this.form.selectedDesignType = option.PlotDesign.Id;
      });
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    navigateBack() {
      this.$router.push("/user-account-area/my-applications");
    },
  },
  validations: {
    form: {
      selectedDesignType: {
        required,
      },
      OwnHouse: {
        required,
      },
      SupportingInformation: {
        required,
        maxLength: maxLength(4000),
      },
      AdditionalDesignRequirements: {
        maxLength: maxLength(4000),
      },
      ReadAndUnderstandPlotCriteria: {
        validateIsTrue,
      },
      AcceptEstimatedCosts: {
        validateIsTrue,
      },
      HowManyAdults: {
        required,
        numeric,
        minValue: minValue(1),
        maxValue: maxValue(20),
      },
      HowManyChildren: {
        required,
        numeric,
        minValue: minValue(0),
        maxValue: maxValue(20),
      },
    },
  },
};
</script>

<style lang="scss">
$lineheight: 1.5em;
$numberoflines: 4;
.plot-description-text {
  max-height: $numberoflines * $lineheight;
  overflow: hidden;
  line-height: $lineheight;
  &.expanded {
    max-height: none;
  }
}
.designs-table-wrapper {
  overflow-x: scroll;
  max-width: calc(100vw - 30px);
}
</style>
