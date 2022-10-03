<template>
  <nuxt-link :to="to" class="resource-card" :title="title">
    <Card>
      <article>
        <div class="resource-card-content-wrap mb-0">
          <div
            :class="[
              'resource-card-icon',
              showUpdateNotificationBadge && notification && 'resource-updated',
            ]"
          >
            <slot />
          </div>

          <h3 class="resource-card-title">
            <span>{{
              showUpdateNotificationBadge && notification
                ? updatedContent
                : title
            }}</span>
          </h3>
        </div>
      </article>
    </Card>
  </nuxt-link>
</template>

<script>
import { getLastUpdateViewed } from '../helpers/latestUpdate'

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    notification: {
      type: Boolean,
      default: false,
    },
    updatedContent: {
      type: String,
      default: '',
    },
    to: {
      type: String,
      required: true,
    },
  },
  computed: {
    showUpdateNotificationBadge() {
      const lastUpdateViewed = getLastUpdateViewed()
      const latestUpdateTitle =
        this.$store.getters['publications/latestPublicationTitle']

      // Don't show notification badge for first-time users
      if (!lastUpdateViewed || !latestUpdateTitle) return false

      return lastUpdateViewed !== latestUpdateTitle
    },
  },
}
</script>

<style lang="scss" scoped>
.resource-card {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  outline: none;

  .resource-card-title span {
    line-height: 1.5;
  }

  &:hover .resource-card-title span {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: none;
  }

  &:focus .resource-card-title span {
    background: $brand-primary;
    color: #ffffff;
    box-shadow: 0 0 0 4px #4d62e4;
    outline: none;
  }

  &:focus:hover .resource-card-title span {
    color: #ffffff;
  }

  ::v-deep > div {
    flex: 1;
    margin: 0;
  }

  ::v-deep .card-base {
    padding: 1.75rem 1.5rem;
    margin: 0;
  }
}

.resource-card-title {
  flex: 1;
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
  color: $body-color;
}

.resource-card:link,
.resource-card:visited {
  text-decoration: none;
}

.resource-card:hover,
.resource-card:active {
  text-decoration: none;

  .resource-card-title {
    color: $brand-primary;
  }
}

.resource-card-icon {
  height: auto;
  flex: 0 0 24px;
  margin-right: 16px;
  color: $brand-primary;

  &.resource-updated {
    color: red;
  }

  ::v-deep svg {
    display: block;
    width: auto;
    height: 100%;
    fill: currentColor;
  }
}

.resource-card-content-wrap {
  display: flex;
  align-items: center;
  margin: 0 0 0.5rem 0;
}

.resource-card-description {
  font-size: 0.75rem;
  color: $body-color-subdued;
  margin-bottom: 0.5rem;
}
</style>
