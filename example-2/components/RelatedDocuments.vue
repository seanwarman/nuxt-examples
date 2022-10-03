<template>
  <div>
    <b-row>
      <b-col :md="8">
        <h4 class="font-weight-normal">Related documents</h4>
        <p class="mb-0">
          Please see our <nuxt-link to="/help">help area</nuxt-link> for
          information on how ‘related documents’ are identified.
        </p>
        <div v-if="results.length > 0" class="mt-3">
          <p class="font-weight-bold mb-0">
            Showing {{ results.length }} related documents
          </p>
          <p class="order-info">
            List ordered by issue date - most recent first
          </p>
        </div>
      </b-col>
    </b-row>

    <b-skeleton-table
      v-if="$fetchState.pending == true && $fetchState.error == null"
      :columns="4"
      animation="wave"
    />

    <b-alert v-if="$fetchState.error" variant="danger">
      There was a problem fetching related document info
    </b-alert>

    <b-list-group
      v-if="checkResults"
      class="list-group-flush w-100"
    >
      <b-list-group-item
        class="d-none font-weight-bold d-lg-flex flex-row w-100 justify-content-end small"
      >
        <div class="flex-grow-1 text-truncate">Document</div>
        <div class="flex-shrink-0 w-8rem">Version</div>
        <div class="flex-shrink-0 w-8rem">Issue</div>
        <div class="flex-shrink-0 w-8rem">Withdrawn</div>
      </b-list-group-item>
      <b-list-group-item
        v-for="result in results"
        :key="result.nodeId"
        class="d-flex flex-column flex-lg-row w-100"
        :class="result.formattedData.DOCUMENT_PAGE_URL && 'text-link'"
        :to="result.formattedData.DOCUMENT_PAGE_URL"
      >
          <small
            v-if="result.formattedData.IS_WITHDRAWN"
            class="mr-3 font-weight-bold"
          >WITHDRAWN</small>
          <div class="flex-grow-1 text-truncate mr-lg-3">
            {{ result.formattedData.TITLE }}
          </div>

        <div
          class="d-flex flex-column flex-lg-row flex-shrink-0 justify-content-end"
        >
          <div class="flex-shrink-0 w-8rem text-nowrap">
            <small class="d-lg-none font-weight-bold">Version: </small
            >{{ result.resultData.REVISION || '—' }}
          </div>
          <div class="flex-shrink-0 w-8rem text-nowrap">
            <small class="d-lg-none font-weight-bold">Issue: </small
            >{{ result.formattedData.DATE_OF_ISSUE }}
          </div>
          <div class="flex-shrink-0 w-8rem text-nowrap">
            <small
              v-if="result.formattedData.IS_WITHDRAWN"
              class="d-lg-none font-weight-bold"
              >Withdrawn:
            </small>
            {{ result.formattedData.DATE_OF_WITHDRAWAL }}
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
    <p v-else class="mt-4"><strong>There are no related documents</strong></p>
  </div>
</template>

<script>
import {
  buildQuery,
  prepareSearchResults,
  resultColumns,
} from '~/lib/caci_api_helpers.js'

export default {
  props: {
    parentDocumentReference: { type: String, required: true },
    parentDocumentNodeId: { type: String, required: true },
  },
  data() {
    return {
      results: [],
    }
  },
  fetch() {
    return this.$axios
      .get(`search`, {
        params: {
          query: buildQuery({
            suites: ['IAN', 'DMRB'],
            searchTerm: this.parentDocumentReference,
          }),
          columns: resultColumns.join(','),
          matchType: 'ALL',
          sortColumn: 'DATE_OF_ISSUE',
          sortDirection: 'DESC',
          validFrom: 980985600000, // Feb 1st 1997
          pageIndex: 0,
          pageSize: 30,
        },
      })
      .then((r) => {
        this.results = prepareSearchResults(r.data).page.filter(
          (doc) => doc.nodeId !== this.parentDocumentNodeId
        )
      })
  },
  computed: {
    checkResults() {
      return this.$fetchState.pending === false
        && this.$fetchState.error === null
        && this.results.length > 0
    }
  },
  methods: { prepareSearchResults },
}
</script>

<style lang="scss" scoped>
.text-link > .text-truncate {
  color: $link-color;
}

.text-link:hover {
  .text-truncate {
    text-decoration: underline;
  }
}

.w-8rem {
  width: 8rem;
}

.order-info {
  font-size: 0.875rem;
  color: $body-color-subdued;
}
</style>
