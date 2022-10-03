<template>
  <div class="search-results">
    <SearchStatus>
      {{ statusMessage }}

      <template #order-info>
        <p>Displayed in alphanumerical order</p>
      </template>
    </SearchStatus>

    <div v-if="results.total > 0">
      <SearchResultCard
        v-for="item in results.page"
        :key="item.nodeId"
        :title="item.formattedData.TITLE"
        :document-link="item.formattedData.ATTACHMENT_URL"
        :discipline="item.formattedData.DISCIPLINE"
        :lifecycle-stage="item.formattedData.LIFECYCLE_STAGE"
        :revision="item.resultData.REVISION"
        :from="item.resultData.SUITE"
        :issued="item.formattedData.DATE_OF_ISSUE"
        :superseded-by="[]"
        :withdrawn="item.formattedData.DATE_OF_WITHDRAWAL"
        :is-withdrawn="item.formattedData.IS_WITHDRAWN"
        :match-type="item.matchType"
        :document-page-url="item.formattedData.DOCUMENT_PAGE_URL"
        :document-node-id="item.nodeId"
        :variant="variant"
      />

      <b-pagination
        v-if="results.total > pageSize"
        :value="pageIndex"
        :per-page="pageSize"
        :total-rows="results.total"
        :size="paginationSize"
        @change="handlePaginationChange"
      ></b-pagination>
    </div>

    <b-alert v-else variant="danger" show>
      <strong>No results,</strong>
      <span
        >Try entering a different search term or changing filter options</span
      >
    </b-alert>
  </div>
</template>

<script>
import currentBootstrapBreakpoint from '../mixins/currentBootstrapBreakpoint'

export default {
  mixins: [currentBootstrapBreakpoint],
  props: {
    results: { type: Object, default: () => ({ total: 0, page: [] }) },
    pageIndex: { type: Number, default: 1 },
    pageSize: { type: Number, default: 30 },
    variant: { type: String, default: 'expanded' }
  },
  computed: {
    paginationSize() {
      return ['lg', 'xl'].includes(this.currentBreakpoint) ? 'lg' : 'md'
    },
    statusMessage() {
      if (!this.results.page.length) return `0 search results`

      const startNumber = this.pageIndex * this.pageSize - this.pageSize + 1
      const endNumber = startNumber + this.results.page.length - 1

      if (startNumber === endNumber) {
        return `Showing search result ${startNumber} of ${this.results.total} results`
      }

      return `Showing search results ${startNumber} – ${endNumber} of ${this.results.total} results`
    }
  },
  methods: {
    handlePaginationChange(pageNumber) {
      this.$emit('page-change', pageNumber)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-results {
  margin-top: 1.5rem;

  @media screen and (min-width: $breakpoint-md) {
    margin-top: 0;
  }
}
</style>
