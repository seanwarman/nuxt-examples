<template>
  <div class="update-card-links">
    <span>{{ label }}:</span>

    <span v-if="!documents || !documents.length">{{ noDocsLabel }}</span>
    <span v-else>
      <template v-for="doc in documents">
        <nuxt-link
          v-if="doc.nodeId"
          :key="doc.documentReference"
          class="update-card-link"
          :to="`/search/${doc.nodeId}`"
          >{{ doc.documentReference }} - {{ doc.title }}</nuxt-link
        >
        <span v-else :key="doc.documentReference" class="update-card-link"
          >{{ doc.documentReference }} - {{ doc.title }}</span
        >
      </template>
    </span>
  </div>
</template>

<script>
import { SEARCH_PATH } from '../config/paths'

export default {
  props: {
    documents: {
      type: Array,
      default() {
        return []
      },
    },
    label: {
      type: String,
      required: true,
    },
    noDocsLabel: {
      type: String,
      required: true,
    },
    searchPath: {
      type: String,
      default: SEARCH_PATH,
    },
  },
}
</script>

<style lang="scss" scoped>
.update-card-links {
  font-size: 0.75rem;
  margin: 0.5rem 0;
  display: flex;

  & > span:first-child {
    flex: 0 0 80px;
    margin-right: 24px;

    @media screen and (min-width: $breakpoint-md) {
      flex-basis: 148px;
    }
  }
}

.update-card-link {
  display: block;
}
</style>
