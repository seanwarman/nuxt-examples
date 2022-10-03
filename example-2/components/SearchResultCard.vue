<template>
  <Card>
    <article :class="className">
      <header class="search-card-header">
        <p v-if="isWithdrawn" class="search-card-withdrawn">Withdrawn</p>
        <h3
          :class="[
            'search-card-title',
            variant === 'compact' && 'text-truncate',
          ]"
        >
          <nuxt-link v-if="documentPageUrl" :to="documentPageUrl">{{
            title
          }}</nuxt-link>
          <span v-else>{{ title }}</span>
        </h3>
      </header>

      <div v-if="notes && variant == 'expanded'">
        <p class="search-card-notes">
          {{ notes }}
        </p>
      </div>

      <div
        v-if="hasDisciplineOrLifecycleStage && variant == 'expanded'"
        class="search-card-lifecycle"
      >
        <p v-if="discipline">{{ discipline }}</p>
        <p v-if="lifecycleStage">{{ lifecycleStage }}</p>
      </div>

      <div v-if="hasFormerlyOrSupersededBy" class="search-card-superseded">
        <p v-if="supersededBy.length">
          <span>Superseded by: </span>
          <template v-for="(doc, index) in supersededBy">
            <span :key="doc.documentLink">
              <a :href="doc.documentLink">{{ doc.title }}</a
              ><span v-if="index < supersededBy.length - 1">, </span>
            </span>
          </template>
        </p>

        <p v-if="formerly.length">
          <span>Formerly: </span>
          <template v-for="(doc, index) in formerly">
            <span :key="doc.documentLink">
              <a :href="doc.documentLink">{{ doc.title }}</a
              ><span v-if="index < formerly.length - 1">, </span>
            </span>
          </template>
        </p>
      </div>

      <footer class="search-card-footer">
        <div class="search-card-revision">
          <p v-if="revision">Version: {{ revision }}</p>
          <p v-if="from && variant === 'expanded'">Suite: {{ from }}</p>
          <p v-if="issued">Issued: {{ issued }}</p>
          <p v-if="isWithdrawn && withdrawn">Withdrawn: {{ withdrawn }}</p>
          <p v-if="matchType">
            Match:
            <span :class="matchType === 'EXACT' ? 'font-weight-bold' : ''">{{
              matchTypeLabel
            }}</span>
          </p>
        </div>

        <div v-if="documentLink" class="search-card-cta">
          <a
            :rel="isWithdrawn ? 'nofollow' : ''"
            :href="`${documentLink}?inline=true`"
            :title="`Open PDF for ${title}. Opens or opens new window`"
            target="_blank"
            @click="handleLinkClick(documentLink, title, documentNodeId)"
            ><span>Open PDF</span
            ><span class="sr-only">Opens PDF in new window</span></a
          >
        </div>
      </footer>
    </article>
  </Card>
</template>

<script>
import capitalize from 'lodash.capitalize'
import { logRecentDownload } from '../helpers/recentDownloads'

const isDocumentWithLink = (val) => {
  return !!val.title && !!val.documentLink
}

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    documentLink: {
      type: String,
      default: undefined,
    },
    notes: {
      type: String,
      default: '',
    },
    discipline: {
      type: String,
      default: '',
    },
    lifecycleStage: {
      type: String,
      default: '',
    },
    revision: {
      type: String,
      default: '',
    },
    from: {
      type: String,
      default: '',
    },
    issued: {
      type: String,
      default: '',
    },
    withdrawn: {
      type: String,
      default: '',
    },
    matchType: {
      type: String,
      default: '',
    },
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
    documentPageUrl: {
      type: String,
      default: '',
    },
    supersededBy: {
      type: Array,
      default: () => [],
      validator: (arr) => arr.every(isDocumentWithLink),
    },
    formerly: {
      type: Array,
      default: () => [],
      validator: (arr) => arr.every(isDocumentWithLink),
    },
    documentNodeId: {
      type: String,
      default: '',
    },
    variant: { type: String, default: 'expanded' },
  },
  computed: {
    hasDisciplineOrLifecycleStage() {
      return !!this.discipline || !!this.lifecycleStage
    },
    hasFormerlyOrSupersededBy() {
      return !!this.supersededBy.length || !!this.formerly.length
    },
    matchTypeLabel() {
      return capitalize(this.matchType)
    },
    className() {
      return `search-card type-${this.variant}`
    },
  },
  methods: {
    handleLinkClick(url, title, nodeId) {
      logRecentDownload(url, title, nodeId)
    },
  },
}
</script>

<style lang="scss" scoped>
.search-card {
  font-size: 0.75rem;

  @media screen and (min-width: $breakpoint-md) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.search-card.type-expanded {
  min-height: 135px;
}
.search-card p {
  margin: 0;
}

.search-card-withdrawn {
  font-weight: 800;
  text-transform: uppercase;
  color: $card-withdrawn-label-color;
  text-align: right;
}

.search-card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  padding-right: 24px;
  flex: 1;
}

p.search-card-notes {
  font-size: 0.875rem;
  margin: 0.5rem 0;
  color: $body-color;
}

.search-card-lifecycle {
  margin: 0.5rem 0 1rem;
}

.search-card-superseded {
  margin: 1rem 0 0.5rem;
}

.search-card-revision {
  @media screen and (min-width: $breakpoint-md) {
    padding-left: 48px;
    flex: 1;
    text-align: right;
    margin-bottom: 0;

    p {
      display: inline-block;
      margin: 0;
      margin-left: 24px;
    }
  }
}

.type-expanded .search-card-revision {
  margin: 0.5rem 0 1rem;
}

.search-card-cta {
  font-size: 1rem;
}
.type-expanded .search-card-cta {
  margin: 1rem 0 0;
}

.search-card-header {
  @media screen and (min-width: $breakpoint-md) {
    display: flex;
    flex-direction: row-reverse;
  }
}

.search-card-footer {
  @media screen and (min-width: $breakpoint-md) {
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
  }
}
</style>
