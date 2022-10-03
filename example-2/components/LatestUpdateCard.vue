<template>
  <Card :type="{ divided: true }">
    <article class="update-card">
      <div>
        <header class="update-card-header">
          <h3 class="update-card-title">
            <nuxt-link v-if="documentUrl" :to="documentUrl">
              <span>{{ cardTitle }}</span>
            </nuxt-link>
            <span v-else>{{ cardTitle }}</span>
          </h3>

          <p class="update-card-action">{{ actionLabel }}</p>
        </header>
        <p class="update-card-notes">
          {{ notes }}
        </p>
      </div>

      <footer>
        <LatestUpdateCardLinks
          v-if="publicationAction === PUBLISHING_KEY"
          :documents="partiallySupersedesDocs"
          label="Partially supersedes"
          no-docs-label="There are no partially superseded documents"
        />

        <LatestUpdateCardLinks
          v-if="publicationAction === PUBLISHING_KEY"
          :documents="supersedesDocs"
          label="Supersedes"
          no-docs-label="There are no superseded documents"
          :search-path="ARCHIVE_SEARCH_PATH"
        />

        <LatestUpdateCardLinks
          v-if="publicationAction === PARTIALLY_WITHDRAWING_KEY"
          :documents="partiallySupersededByDocs"
          label="Partially superseded by"
          no-docs-label="There are no partially superseded by documents"
        />

        <LatestUpdateCardLinks
          v-if="publicationAction === WITHDRAWING_KEY"
          :documents="supersededByDocs"
          label="Superseded by"
          no-docs-label="There are no superseded by documents"
        />
      </footer>
    </article>
  </Card>
</template>

<script>
import {
  PUBLISHING_KEY,
  WITHDRAWING_KEY,
  PARTIALLY_WITHDRAWING_KEY,
  AMENDMENT_KEY,
  PUBLICATION_ACTIONS,
} from '../config/updates'
import { ARCHIVE_SEARCH_PATH, SEARCH_PATH } from '../config/paths'

export default {
  props: {
    documentReference: {
      type: String,
      default: '',
    },
    documentUrl: {
      type: String,
      default: '',
    },
    revision: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    publicationAction: {
      type: String,
      required: true,
    },
    partiallySupersedesDocs: {
      type: Array,
      default() {
        return []
      },
    },
    supersedesDocs: {
      type: Array,
      default() {
        return []
      },
    },
    supersededByDocs: {
      type: Array,
      default() {
        return []
      },
    },
    partiallySupersededByDocs: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      PUBLISHING_KEY,
      WITHDRAWING_KEY,
      PARTIALLY_WITHDRAWING_KEY,
      AMENDMENT_KEY,
      ARCHIVE_SEARCH_PATH,
    }
  },
  computed: {
    cardTitle() {
      return `${this.documentReference}${
        this.revision ? ` ${this.revision}` : ''
      } - ${this.title}`
    },
    actionLabel() {
      return (
        (PUBLICATION_ACTIONS[this.publicationAction] &&
          PUBLICATION_ACTIONS[this.publicationAction].text) ||
        ''
      )
    },
    cardLink() {
      return {
        path:
          this.publicationAction === WITHDRAWING_KEY
            ? ARCHIVE_SEARCH_PATH
            : SEARCH_PATH,
        query: { q: this.documentReference },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.update-card {
  @media screen and (min-width: $breakpoint-md) {
    min-height: 135px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.update-card-header {
  display: flex;
  flex-direction: column-reverse;

  @media screen and (min-width: $breakpoint-md) {
    flex-direction: row;
    justify-content: space-between;
  }
}

.update-card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: $body-color;
  flex: 1 1 100%;
}

.update-card-action {
  font-weight: 800;
  text-transform: uppercase;
  color: $card-withdrawn-label-color;
  text-align: right;
  font-size: 0.75rem;
  flex: 0 1 auto;
  margin-left: 24px;

  @media screen and (min-width: $breakpoint-md) {
    margin-bottom: 0;
  }
}

.update-card-notes {
  font-size: 0.875rem;
}
</style>
