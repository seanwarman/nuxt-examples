<template>
  <b-form-group :label="label" :label-for="id" class="field-with-example">
    <p :id="`${id}-example`" class="field-example">
      <slot name="example">{{ example }}</slot>
    </p>

    <b-form-input
      :id="id"
      :value="value"
      :placeholder="placeholder"
      autocomplete="off"
      :aria-describedby="`${id}-example`"
      @input="handleInput"
      @focus="isShown = true"
      @blur="isShown = false"
      @click="handleInputClick"
      @keydown="handleKeydown"
    />

    <div
      v-if="isShown"
      style="position: absolute; z-index: 1"
      aria-hidden="true"
    >
      <vuejs-datepicker
        :id="id"
        :value="valueAsDate"
        :placeholder="placeholder"
        input-class="form-control"
        inline
        @input="handleDatepickerInput"
        @selected="handleSelectedEvent"
      />
    </div>
  </b-form-group>
</template>

<script>
import { INPUT_DATE_FORMAT } from '../config/site'

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    example: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      isShown: false,
    }
  },
  computed: {
    valueAsDate() {
      if (!this.value) return null
      const parsedDate = this.$dayjs(this.value, INPUT_DATE_FORMAT)
      return parsedDate.isValid() ? parsedDate.toDate() : null
    },
  },
  methods: {
    handleSelectedEvent(e) {
      this.$emit('selectedDate', e)
    },

    handleInput(e) {
      this.$emit('input', e)
    },

    handleInputClick() {
      if (!this.isShown) {
        this.isShown = true
      }
    },

    handleKeydown(e) {
      if (e.key && e.key.toLowerCase() === 'escape') {
        this.isShown = false
      }
    },

    formatDateDisplay(date) {
      const parsedDate = this.$dayjs(date).format(INPUT_DATE_FORMAT)
      return parsedDate
    },

    handleDatepickerInput(date) {
      const parsedDate = this.$dayjs(date).format(INPUT_DATE_FORMAT)
      this.isShown = false
      this.$emit('input', parsedDate)
    },
  },
}
</script>

<style lang="scss" scoped>
.field-with-example ::v-deep legend {
  padding-bottom: 0;
}

.field-with-example ::v-deep p {
  font-size: 0.875rem;
  font-weight: normal;
  margin-bottom: 0.5rem;
}

::v-deep .vdp-datepicker__calendar {
  border-radius: $input-border-radius;
  padding: 5px;

  .cell {
    border-radius: $input-border-radius;

    &.selected {
      background-color: $brand-primary;
      color: white;

      &:hover {
        background-color: $brand-primary-hover;
      }
    }

    &:not(.blank):not(.disabled).day:hover,
    &:not(.blank):not(.disabled).month:hover,
    &:not(.blank):not(.disabled).year:hover {
      border-color: $brand-primary;
    }
  }
}
</style>
