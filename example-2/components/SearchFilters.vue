<template>
  <div>
    <b-button
      variant="link"
      class="filters-collapse-button"
      block
      @click="handleCollapseToggle"
    >
      <div class="filter-collpase-button-content">
        <span class="filter-collpase-button-content">
          <span>{{ filterButtonLabel }}</span>
          <client-only>
            <span v-if="filterCount">
              <span>&nbsp;({{ filterCount }})</span>
              <span class="sr-only">
                filter<span v-if="filterCount > 1">s</span> selected</span
              >
            </span>
          </client-only>
        </span>

        <b-icon :icon="buttonIcon"></b-icon>
      </div>
    </b-button>

    <b-collapse
      id="search-filters"
      :visible="isOpen"
      @hidden="handleFiltersClosed"
    >
      <div class="filters-container">
        <div class="filters-header">
          <h2 class="sr-only-mobile">
            <span>Filters</span>
            <client-only>
              <span v-if="filterCount">
                <span>({{ filterCount }})</span>
                <span class="sr-only">
                  filter<span v-if="filterCount > 1">s</span> selected</span
                >
              </span>
            </client-only>
          </h2>
          <Button variant="link" @click="clearFilters">Clear filters</Button>
        </div>

        <b-form class="pt-4">
          <b-form-group
            class="pb-2"
            label="Filter by discipline"
            label-for="disciplineDropdown"
          >
            <b-form-select
              id="disciplineDropdown"
              v-model="selectedDiscipline"
              :options="
                disciplines.map(({ text, key }) => ({ text, value: key }))
              "
              @change="onSelect"
            ></b-form-select>
          </b-form-group>

          <b-form-group
            v-if="!hideCheckboxes"
            label="Filter by lifecycle stage"
            class="pb-2"
          >
            <b-form-checkbox-group
              v-model="selectedLifecycles"
              :options="lifecycles"
              stacked
              value-field="key"
              @change="onSelect"
            ></b-form-checkbox-group>
          </b-form-group>

          <b-form-group class="pb-2" label="Filter by exact matches">
            <b-form-checkbox
              v-model="filterByExactMatch"
              name="lifecycle"
              @change="onSelect"
            >
              Show only exact matches
            </b-form-checkbox>
          </b-form-group>

          <b-form-group
            v-if="isArchive"
            class="pb-2"
            label="Filter by volume"
            label-for="volumeDropdown"
          >
            <b-form-select
              id="volumeDropdown"
              v-model="selectedVolume"
              :options="volumes"
              @change="onSelect"
            ></b-form-select>
          </b-form-group>

          <Datepicker
            v-if="isArchive"
            id="from-date"
            v-model="fromDate"
            label="From"
            placeholder="Enter a date"
            class="pb-2"
            @selectedDate="onSelect"
          >
            <span slot="example">
              For example, 02/11/2006 <small>(DD/MM/YYYY)</small>
            </span>
          </Datepicker>

          <Datepicker
            v-if="isArchive"
            id="to-date"
            v-model="toDate"
            label="To"
            example="For example, 21/11/2008"
            placeholder="Enter a date"
            class="pb-2"
            @selectedDate="onSelect"
          >
            <span slot="example">
              For example, 21/11/2008 <small>(DD/MM/YYYY)</small>
            </span>
          </Datepicker>
        </b-form>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import lifecycles from '../config/lifecycles'
import disciplines from '../config/disciplines'
import volumes from '../config/volumes'
import {
  OUTPUT_DATE_FORMAT,
  INPUT_DATE_FORMAT,
  ARCHIVE_DEFAULT_FROM_DATE_OUTPUT_FORMAT,
} from '../config/site'
import { SEARCH_PATH } from '../config/paths'
import breakpointMixin from '../mixins/currentBootstrapBreakpoint'

const filterDefaults = {
  selectedDiscipline: null,
  selectedLifecycles: [],
  selectedVolume: null,
  fromDate: undefined,
  toDate: undefined,
  filterByExactMatch: false,
}

export default {
  mixins: [breakpointMixin],
  props: {
    searchPath: {
      type: String,
      default: SEARCH_PATH,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ...this.getInitialFilters(),

      disciplines: [
        {
          text: 'All disciplines',
          key: null,
        },
        ...disciplines,
      ],
      lifecycles,
      volumes: [
        {
          text: 'All volumes',
          value: null,
        },
        ...volumes,
      ],
      isOpenOnMobile: false,
      searchWasMade: false,
      hideCheckboxes: false,
    }
  },
  computed: {
    isOpen() {
      return (
        ['md', 'lg', 'xl'].includes(this.currentBreakpoint) ||
        this.isOpenOnMobile
      )
    },
    filterButtonLabel() {
      return this.isOpen ? 'Collapse Filters' : `Show Filters`
    },
    filterCount() {
      let count = 0

      const conditions = [
        this.selectedDiscipline,
        ...this.selectedLifecycles,
        this.filterByExactMatch,
        this.selectedVolume !== null,
        this.fromDate,
        this.toDate,
      ]

      conditions.forEach((condition) => {
        if (condition) {
          count++
        }
      })

      return count
    },
    buttonIcon() {
      return !this.isOpen ? 'chevron-down' : 'chevron-up'
    },
  },
  watch: {
    '$route.query'() {
      const { selectedDiscipline, selectedLifecycles } =
        this.getInitialFilters()
      this.$data.selectedDiscipline = selectedDiscipline
      this.$data.selectedLifecycles = selectedLifecycles
      this.isOpenOnMobile = false
      this.searchWasMade = true
    },
  },
  methods: {
    getInitialFilters() {
      return {
        selectedDiscipline: this.$route.query.discipline
          ? this.$route.query.discipline
          : filterDefaults.selectedDiscipline,
        selectedLifecycles: this.$route.query.lifecycle
          ? this.$route.query.lifecycle.split(',')
          : filterDefaults.selectedLifecycles,
        selectedVolume:
          this.$route.query.volume || filterDefaults.selectedVolume,
        fromDate: this.isArchive
          ? this.parseQueryDate(
              this.$route.query.from || ARCHIVE_DEFAULT_FROM_DATE_OUTPUT_FORMAT
            )
          : filterDefaults.fromDate,
        toDate: this.isArchive
          ? this.parseQueryDate(this.$route.query.to)
          : filterDefaults.toDate,
        filterByExactMatch:
          this.$route.query.matchType === 'EXACT' ||
          filterDefaults.filterByExactMatch,
      }
    },

    onSelect() {
      this.$router.push({
        path: this.searchPath,
        query: {
          ...this.$route.query,
          discipline: this.selectedDiscipline,
          lifecycle: this.selectedLifecycles.join(','),
          volume: this.selectedVolume,
          to: this.parseInputDate(this.toDate),
          from: this.parseInputDate(this.fromDate),
          pageNumber: 1,
          matchType: this.filterByExactMatch ? 'EXACT' : undefined,
        },
      })
    },

    parseQueryDate(dateString) {
      if (!dateString) return null
      const parsedDate = this.$dayjs(dateString, OUTPUT_DATE_FORMAT)
      return parsedDate.format(INPUT_DATE_FORMAT)
    },

    parseInputDate(dateString) {
      const parsedDate = this.$dayjs(dateString, INPUT_DATE_FORMAT)

      return parsedDate.isValid() ? parsedDate.format(OUTPUT_DATE_FORMAT) : ''
    },

    handleCollapseToggle() {
      this.isOpenOnMobile = !this.isOpenOnMobile
    },

    handleFiltersClosed() {
      if (this.searchWasMade) {
        this.$emit('hidden')
        this.searchWasMade = false
      }
    },

    clearFilters() {
      this.selectedDiscipline = filterDefaults.selectedDiscipline
      this.selectedLifecycles = filterDefaults.selectedLifecycles
      this.selectedVolume = filterDefaults.selectedVolume
      this.fromDate = filterDefaults.fromDate
      this.toDate = filterDefaults.toDate
      this.filterByExactMatch = filterDefaults.filterByExactMatch

      this.onSelect()
    },
  },
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 2rem;
  flex: 1;
}

.filters-collapse-button {
  padding-left: 0;
  padding-right: 0;
  text-align: inherit;

  @media screen and (min-width: $breakpoint-md) {
    display: none;
  }
}

.filter-collpase-button-content {
  display: flex;
  align-items: center;
}

.filter-collpase-button-content {
  flex: 1;
}

.filters-header {
  display: flex;
  margin-top: 1rem;

  @media screen and (min-width: $breakpoint-md) {
    margin-top: 0;
  }
}

.filters-header .btn {
  min-width: 0;
  padding: 0;
  font-size: 0.875rem;
}
</style>
