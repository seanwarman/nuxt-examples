/* eslint-disable vue/no-v-html */
<template>
  <Page>
    <div>
      <PageHeading ref="focusTarget">{{ page_title }}</PageHeading>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="text-break" v-html="page_subheading"></p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <b-row>
        <b-col cols="12" md="8">
          <!-- eslint-disable vue/no-v-html -->
          <Alert
            v-for="notice in notices"
            :id="noticeId(notice.name)"
            :key="notice.id"
            show
            :variant="notice.type.toLowerCase()"
            v-html="notice.content"
          />
        </b-col>
      </b-row>
    </div>

    <aside slot="alt-right-col">
      <SidebarSnippet
        v-for="snippet in sidebar_panel_snippets"
        :key="snippet.id"
        class="d-none d-md-block mt-0"
        :content="snippet.content"
        :image="snippet.image"
      />
    </aside>

    <div slot="alt-left-col">
      <b-form
        class="filter-form d-block d-lg-flex w-100"
        aria-label="Filter the DMRB updates, secondary"
      >
        <b-form-group
          class="pb-2 pr-lg-2 flex-fill"
          label="Filter by publication"
          label-for="publicationDropdown"
        >
          <b-form-select
            id="publicationDropdown"
            v-model="selectedPublication"
            :options="publications"
            @change="handleFilterSubmit"
          ></b-form-select>
        </b-form-group>
        <b-form-group
          class="pb-2 pl-lg-2 flex-fill"
          label="Filter by publication action"
          label-for="publicationAction"
        >
          <b-dropdown
            id="publicationAction"
            :text="`${filters ? filters.length : '0'} selected`"
            class="checkbox-select w-100"
          >
            <div class="checkbox-select__check-wrap">
              <b-form-checkbox-group
                v-model="filters"
                :options="filterOptions"
                stacked
                @change="handleFilterSubmit"
              ></b-form-checkbox-group>
            </div>
          </b-dropdown>
        </b-form-group>
      </b-form>
      <SearchStatus>{{ resultsTitle && resultsTitle + ':' }}</SearchStatus>
      <div aria-live="polite">
        <div v-if="error">
          <Alert show variant="danger">{{ error }}</Alert>
        </div>
        <div v-if="isLoading" class="w-100 text-center">
          <div class="spinner-border m-5" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>

        <div v-if="!resultsList.length && !isLoading && !error">
          <Alert class="my-4" show
            >No updates found. If you have filters applied try changing them and
            reapplying.</Alert
          >
        </div>

        <LatestUpdateCard
          v-for="summary in resultsList"
          :key="
            `${summary.titleData.documentReference}-${summary.titleData.title}-${summary.publicationAction}`
          "
          :revision="summary.titleData.revision"
          :document-reference="summary.titleData.documentReference"
          :title="summary.titleData.title"
          :document-url="
            summary.titleData.nodeId
              ? `/search/${summary.titleData.nodeId}`
              : ''
          "
          :notes="summary.notes"
          :publication-action="summary.publicationAction"
          :partially-supersedes-docs="summary.partiallySupersedes"
          :supersedes-docs="summary.supersedes"
          :superseded-by-docs="summary.supersededBy"
          :partially-superseded-by-docs="summary.partiallySupersededBy"
        />
        <TSOShopAdvert class="d-block d-md-none" />
      </div>
    </div>
  </Page>
</template>

<script>
import { pick } from 'ramda'
import kebabCase from 'lodash.kebabcase'

import { PUBLICATION_ACTIONS } from '../config/updates'
import { logLatestUpdateViewed } from '../helpers/latestUpdate'
import focusHeadingOnMountMixin from '../mixins/aria-focus-heading'

const LATEST_UPDATE_TITLE = 'Latest updates to the DMRB'
const PAST_UPDATE_TITLE = 'Updates to the DMRB'

function processSummaries(data) {
  const allSummaries = [
    ...data.DMRB.publishingSummaries,
    ...data.DMRB.partiallyWithdrawingSummaries,
    ...data.DMRB.withdrawingSummaries,
    ...data.DMRB.amendingSummaries
  ]
  return allSummaries
}

async function getPublicationData($axios, publicationId = 'latest') {
  const publicationResult = await $axios.get(
    `/publication-summaries/${publicationId}?suites=DMRB`
  )
  return publicationResult
}

function getPublicationDataItems(data, filters) {
  const unfilteredResults = processSummaries(data)
  const resultsList =
    !filters || !filters.length
      ? unfilteredResults
      : unfilteredResults.filter(item =>
          filters.includes(item.publicationAction)
        )

  return {
    resultsTitle: data.DMRB.publicationTitle,
    publicationData: unfilteredResults,
    resultsList
  }
}

export default {
  mixins: [focusHeadingOnMountMixin],
  layout: 'two-column',
  asyncData({ $cms }) {
    return $cms
      .get('dmrb-updates')
      .then(res =>
        pick([
          'page_title',
          'page_subheading',
          'notices',
          'sidebar_panel_snippets'
        ], res.data)
      )
  },
  data() {
    return {
      page_title: 'Loading updates...',
      isLoading: true,
      publicationData: [],
      error: null,
      resultsTitle: '',
      filters: [],
      filterOptions: Object.values(PUBLICATION_ACTIONS),
      resultsList: [],
      publications: [],
      selectedPublication: null,
      sidebar_panel_snippets: []
    }
  },
  head() {
    return {
      title: this.pageTitle
    }
  },
  watch: {
    $route(to, from) {
      this.updateData(to.query.publicationId)
    }
  },
  async mounted() {
    const { publicationId } = this.$route.query

    try {
      const publicationsResult = await this.$axios.get('/publications')

      const publicationOptions = publicationsResult.data.map(option => ({
        value: option.id,
        text: option.title
      }))

      this.publications = publicationOptions
      this.selectedPublication = publicationId || publicationOptions[0].value
      this.pageTitle =
        !publicationId ||
        (publicationOptions && publicationId === publicationOptions[0].value)
          ? LATEST_UPDATE_TITLE
          : PAST_UPDATE_TITLE

      this.updateData(publicationId)
    } catch (error) {
      this.error = `Error loading publication data: ${error.message}`
      this.isLoading = false
    }

    if (this.publications[0] && this.publications[0].text) {
      logLatestUpdateViewed(this.publications[0].text)
    }
  },

  methods: {
    noticeId(str) {
      return `notice-${kebabCase(str)}`
    },
    handleFilterSubmit() {
      this.$router.push({
        to: '/updates',
        query: {
          publicationId: this.selectedPublication,
          filters: this.filters || []
        }
      })
    },

    clearFilters() {
      this.filters = []
      this.handleFilterSubmit()
    },

    updateData(publicationId) {
      this.isLoading = true
      this.resultsList = []
      const { filters, publicationId: queryPublicationId } = this.$route.query

      if (typeof filters === 'string') {
        // v-model - on refresh - one item becomes a string
        // push this one item into an array else run as usual
        this.filters = [filters]
      } else {
        this.filters = filters || []
      }

      this.selectedPublication =
        queryPublicationId || this.publications[0].value

      getPublicationData(this.$axios, publicationId)
        .then(result => {
          const {
            resultsTitle,
            publicationData,
            resultsList
          } = getPublicationDataItems(result.data, this.filters)

          this.isLoading = false
          this.resultsTitle = resultsTitle
          this.publicationData = publicationData
          this.resultsList = resultsList
          this.pageTitle =
            !publicationId ||
            (this.publications && publicationId === this.publications[0].value)
              ? LATEST_UPDATE_TITLE
              : PAST_UPDATE_TITLE
        })
        .catch(error => {
          this.isLoading = false
          this.error = `Error loading publication data: ${error.message}`
        })
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 2rem;
  flex: 1;
}

.filter-form {
  margin-bottom: 2.5rem;
}

.filters-header {
  display: flex;
  margin-top: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;

  @media screen and (min-width: $breakpoint-md) {
    margin-top: 0;
  }
}

.filters-header .btn {
  min-width: 0;
  padding: 0;
  font-size: 0.875rem;
}

.checkbox-select {
  ::v-deep .dropdown-menu {
    right: 0;
    padding: 1rem;
    box-shadow: 0 2px 4px 0 rgba(96, 96, 96, 0.24);
    .custom-checkbox {
      display: block;
      &:not(:last-child) {
        margin-bottom: 1rem;
      }
    }
  }

  ::v-deep button {
    border: 1px solid $input-border-color;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 47px /* same height as custom select */;
    padding: 0.75rem;
    &:focus,
    &:active {
      box-shadow: 0 0 0 3px $brand-primary, 0 0 0 5px #ffffff;
      border-radius: 8px;
      border: 1px solid #ffffff;
      background: none;
    }
  }

  &__filters-wrap {
    padding: 10px 12px;
    ul {
      padding: 0;
    }

    li {
      list-style: none;
    }
  }
}
</style>
