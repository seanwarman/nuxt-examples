<template>
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <PageHeading ref="focusTarget">{{ page_title }}</PageHeading>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="text-break" v-html="page_subheading"></p>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <Alert
      v-for="notice in notices"
      :id="noticeId(notice.name)"
      :key="notice.id"
      show
      :variant="notice.type.toLowerCase()"
      v-html="notice.content"
    />
    <b-form
      role="search"
      aria-label="Search the DMRB archive, secondary"
      @submit.prevent="handleSubmit"
    >
      <b-row>
        <b-col cols="12">
          <b-form-group
            :label="search_field.label"
            label-for="searchTerm"
            class="search-example-group"
          >
            <p id="archiveSearchExample" class="search-example">
              {{ search_field.help_text }}
            </p>
            <SearchInput
              id="searchTerm"
              v-model="searchTerm"
              :placeholder="search_field.placeholder"
              aria-describedby="archiveSearchExample"
            />
          </b-form-group>
        </b-col>

        <b-col cols="12" md="6">
          <Datepicker
            id="from-date"
            v-model="fromDate"
            :label="start_field.label"
            :placeholder="start_field.placeholder"
          >
            <span slot="example">
              {{ start_field.help_text }}
            </span>
          </Datepicker>
        </b-col>

        <b-col cols="12" md="6">
          <Datepicker
            id="to-date"
            v-model="toDate"
            :label="end_field.label"
            :placeholder="end_field.placeholder"
          >
            <span slot="example">
              {{ end_field.help_text }}
            </span>
          </Datepicker>
        </b-col>

        <b-col cols="12" class="mt-2">
          <Button type="submit">Search</Button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import kebabCase from 'lodash.kebabcase'
import { pick } from 'ramda'

import {
  OUTPUT_DATE_FORMAT,
  INPUT_DATE_FORMAT,
  ARCHIVE_DEFAULT_FROM_DATE_INPUT_FORMAT
} from '../../config/site'
import { ARCHIVE_SEARCH_PATH } from '../../config/paths'
import focusHeadingOnMountMixin from '../../mixins/aria-focus-heading'

export default {
  mixins: [focusHeadingOnMountMixin],
  asyncData({ $cms }) {
    return $cms
      .get('dmrb-archive')
      .then(res =>
        pick([
          'page_title',
          'page_subheading',
          'notices',
          'search_field',
          'end_field',
          'start_field'
        ], res.data)
      )
  },
  data() {
    return {
      searchTerm: '',
      fromDate: ARCHIVE_DEFAULT_FROM_DATE_INPUT_FORMAT,
      toDate: '',
      query: {}
    }
  },
  head() {
    return {
      title: 'Archive'
    }
  },
  watch: {
    searchTerm() {
      this.buildQuery()
    },
    fromDate() {
      this.buildQuery()
    },
    toDate() {
      this.buildQuery()
    }
  },
  methods: {
    noticeId(str) {
      return `notice-${kebabCase(str)}`
    },
    handleSubmit() {
      this.buildQuery()
      this.$router.push({ path: ARCHIVE_SEARCH_PATH, query: this.query })
    },
    buildQuery() {
      const from = this.$dayjs(this.fromDate, INPUT_DATE_FORMAT)
      const to = this.$dayjs(this.toDate, INPUT_DATE_FORMAT)

      const queryOptions = {
        q: this.searchTerm,
        from: from.isValid() ? from.format(OUTPUT_DATE_FORMAT) : undefined,
        to: to.isValid() ? to.format(OUTPUT_DATE_FORMAT) : undefined
      }

      this.query = queryOptions
    }
  },
}
</script>

<style lang="scss" scoped>
.search-example-group ::v-deep legend {
  padding-bottom: 0;
}

.search-example {
  font-size: 0.875rem;
  margin: 0.5rem 0;
}
</style>
