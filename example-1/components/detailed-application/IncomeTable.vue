<template>
  <b-form class="mb-5">
    <h3 class="font-weight-bold mb-1">Applicant {{ index + 1 }}</h3>
    <p class="mb-4">
      {{ applicant.Name }}
    </p>

    <b-table
      :fields="tableFields"
      :items="applicant.IncomeItems"
      fixed
      class="mb-3"
    >
      <template #cell(Name)="data">
        <div class="income">
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
              type="text"
              :name="`description-${data.item.Id}`"
              :disabled="ReadOnlyDA"
            />
            <div>
              <b-button
                variant="link"
                @click="
                  !ReadOnlyDA &&
                  $emit('deleteItem', {
                    applicantId: applicant.Id,
                    itemId: data.item.Id,
                  })
                "
              >
                Delete
              </b-button>
            </div>
          </template>
        </div>
      </template>
      <template #cell(MonthlyIncome)="data">
        <p
          v-show="errors.has(`MonthlyIncome-${data.item.Id}`)"
          class="error"
          style="color: crimson"
        >
          {{ errors.first(`MonthlyIncome-${data.item.Id}`) }}
        </p>
        <b-input-group prepend="£" class="input">
          <b-form-input
            :id="`MonthlyIncome-${data.item.Id}`"
            v-model="data.item.MonthlyIncome"
            v-validate="'required|numeric'"
            :disabled="ReadOnlyDA"
            type="number"
            :name="`MonthlyIncome-${data.item.Id}`"
          />
        </b-input-group>
      </template>
    </b-table>
    <b-button
      variant="outline-primary"
      class="align-self-start mb-3"
      :disabled="ReadOnlyDA"
      @click="$emit('addItem', applicant.Id)"
    >
      Add another income
    </b-button>
  </b-form>
</template>

<script>
import Vue from "vue";
import VeeValidate from "vee-validate";

Vue.use(VeeValidate, {
  inject: true,
  fieldsBagName: "veeFields",
});

export default {
  name: "IncomeTable",
  props: {
    applicant: Object,
    index: Number,
  },
  data() {
    return {
      tableFields: [
        { key: "Name", label: "" },
        { key: "MonthlyIncome", label: "Monthly income" },
        { key: "Hint", label: "" },
      ],
    };
  },
  computed: {
    ReadOnlyDA: {
      get() {
        return this.$store.getters["Global/ReadOnlyDA"];
      },
    },
  },
};
</script>

<style lang="scss">
.income {
  width: 200px;
}
</style>
