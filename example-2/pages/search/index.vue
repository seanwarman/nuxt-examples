<template>
  <Page>
    <div>
      <PageHeading id="focusTarget" ref="focusTarget">{{ page_title }}</PageHeading>
      <PageSearchBox
        :search-path="searchPath"
        class="pt-3"
        :search-aria-label="
          isArchive
            ? 'Search the DMRB archive, secondary'
            : 'Search the DMRB, primary'
        "
        :search-example="search_example"
        :search-label="search_label"
      />
    </div>

    <aside slot="left-col">
      <SkipLink target-hash="#results">Skip to results</SkipLink>

      <SearchViewOptions
        class="mb-4"
        :value="viewStyle"
        aria-describedby="Toggle between expanded and compact list styles"
        @input="handleViewChange"
      />
      <SearchFilters
        :search-path="searchPath"
        :is-archive="isArchive"
        @hidden="scrollResultsIntoView"
      />
      <SidebarSnippet
        v-for="snippet in sidebar_panel_snippets"
        :key="snippet.id"
        class="d-none d-md-block"
        :content="snippet.content"
      />
    </aside>

    <div id="results" slot="right-col" ref="results" tabindex="-1">
      <div v-if="isLoading" class="loader">
        <div class="spinner-border m-5" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else>
        <SearchResults
          :results="searchResults"
          :page-index="pageNumber"
          :page-size="pageSize"
          :is-archive="isArchive"
          :variant="viewStyle"
          @page-change="handlePageChange"
        />
        <BackToTop :scroll-depth="500" target-hash="#focusTarget" />
        <TSOShopAdvert class="d-block d-md-none" />
      </div>
    </div>
  </Page>
</template>

<script>
import { pick } from 'ramda'

import { ARCHIVE_DEFAULT_FROM_DATE_OUTPUT_FORMAT } from '~/config/site'
import { ARCHIVE_SEARCH_PATH, SEARCH_PATH } from '~/config/paths'

import { setListViewStyle, getListViewStyle } from '~/helpers/userSettings'

import breakpointMixin from '~/mixins/currentBootstrapBreakpoint'
import focusHeadingOnMountMixin from '~/mixins/aria-focus-heading'

import {
  buildQuery,
  prepareSearchResults,
  prepareDateForApi,
  resultColumns
} from '~/lib/caci_api_helpers.js'

export default {
  mixins: [breakpointMixin, focusHeadingOnMountMixin],

  layout: 'two-column',

  props: {
    isArchive: {
      type: Boolean,
      default: false
    }
  },
  async asyncData({ $cms }) {
    const cmsData = await $cms
      .get('dmrb-search-results')
      .then(res =>
        pick([
          'page_title',
          'sidebar_panel_snippets',
          'search_label',
          'search_example'
        ], res.data)
      )
    return {
      ...cmsData
    }
  },

  data() {
    return {
      isLoading: true,
      searchResults: { page: [] },
      pageSize: 30,
      viewStyle: getListViewStyle() || 'expanded'
    }
  },

  computed: {
    pageTitle() {
      return this.isArchive ? 'DMRB Archive' : 'Find a document'
    },
    searchPath() {
      return this.isArchive ? ARCHIVE_SEARCH_PATH : SEARCH_PATH
    },
    pageNumber() {
      return Number(this.$route.query.pageNumber) || 1
    }
  },

  watch: {
    '$route.query'() {
      this.doSearch()
    }
  },
  mounted() {
    this.doSearch()
  },

  methods: {
    doSearch() {
      const routeQuery = this.$route.query
      this.isLoading = true
      this.$axios
        .get('search', {
          params: {
            query: buildQuery({
              suites: this.isArchive ? ['IAN', 'DMRB'] : ['DMRB'],
              searchTerm: routeQuery.q,
              discipline: routeQuery.discipline,
              lifecycles: routeQuery.lifecycle,
              volume: routeQuery.volume,
              section: routeQuery.section
            }),
            columns: resultColumns.join(','),
            matchType: routeQuery.matchType === 'EXACT' ? 'EXACT' : 'ALL',
            sortColumn: 'DOCUMENT_REFERENCE',
            sortDirection: 'ASC',
            validTo: this.isArchive
              ? prepareDateForApi(routeQuery.to) || undefined
              : undefined, // Empty string means today
            validFrom: this.isArchive
              ? prepareDateForApi(routeQuery.from) ||
                prepareDateForApi(ARCHIVE_DEFAULT_FROM_DATE_OUTPUT_FORMAT)
              : undefined,
            pageIndex: this.pageNumber - 1, // 0 based index
            pageSize: this.pageSize
          }
        })
        .then(
          response => {
            this.searchResults = prepareSearchResults(
              response.data,
              this.isArchive
            )
          },
          response => {
            // error callback
          }
        )
        .catch((this.searchResults = { page: [] }))
        .finally(() => {
          this.isLoading = false
          this.scrollResultsIntoView()
        })
    },

    handlePageChange(pageNumber) {
      this.$router.push({
        path: this.searchPath,
        query: {
          ...this.$route.query,
          pageNumber
        }
      })
    },

    handleViewChange(value) {
      this.viewStyle = value
      setListViewStyle(value)
    },

    scrollResultsIntoView() {
      if (['xs', 'sm'].includes(this.currentBreakpoint)) {
        this.$refs.results.scrollIntoView({ behavior: 'smooth' })
      }
    }
  },
  head() {
    return {
      title: this.isArchive ? 'Archive Search Results' : 'Search Results'
    }
  }
}
</script>

<style lang="scss" scoped>
.loader {
  text-align: center;
}
</style>
