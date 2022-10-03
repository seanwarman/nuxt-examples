<template>
  <header class="header">
    <b-container>
      <b-row>
        <b-col>
          <SkipLink target-hash="#main-content">Skip to main content</SkipLink>
          <b-navbar toggleable="lg">
            <b-navbar-brand href="https://www.standardsforhighways.co.uk">
              <Logo />
            </b-navbar-brand>

            <b-navbar-toggle
              toggleable="lg"
              :target="collapseId"
              label="Menu, toggle navigation"
            >
              <span class="navbar-menu-text"
                ><span>Menu</span
                ><span class="navbar-notification-container">
                  <span
                    v-if="!open && showUpdateNotificationBadge"
                    class="notification"
                  >
                    <span class="sr-only">New update</span>
                  </span>
                </span></span
              >
            </b-navbar-toggle>

            <b-collapse
              :id="collapseId"
              v-model="open"
              is-nav
              class="header-menu"
            >
              <div class="nav-search-container">
                <SearchBox
                  id="header-search"
                  accessible-label="Search the DMRB, e.g. 'GG 101"
                  with-icon
                  :placeholder="searchPlaceholder"
                  class="header-searchbox"
                  aria-label="Site search, primary"
                  @submit="handleSubmit"
                />
              </div>

              <!-- Right aligned nav items -->
              <b-navbar-nav class="ml-auto">
                <b-nav-item :link-attrs="{ title: 'DMRB' }" to="/" exact
                  ><span class="outer">
                    <span>DMRB</span>
                  </span></b-nav-item
                >
                <b-nav-item :link-attrs="{ title: 'Updates' }" to="/updates"
                  ><span class="outer">
                    <span>Updates</span>
                    <span
                      v-if="showUpdateNotificationBadge"
                      class="notification"
                    >
                      <span class="sr-only">New update</span>
                    </span>
                  </span></b-nav-item
                >
                <b-nav-item :link-attrs="{ title: 'Index' }" :to="index">
                  <span class="outer">
                    <span>Index</span>
                  </span></b-nav-item
                >
                <b-nav-item :link-attrs="{ title: 'Archive' }" to="/archive"
                  ><span class="outer">
                    <span>Archive</span>
                  </span></b-nav-item
                >
                <b-nav-item :link-attrs="{ title: 'Help' }" to="/help"
                  ><span class="outer">
                    <span>Help</span>
                  </span></b-nav-item
                >
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </b-col>
      </b-row>
    </b-container>
  </header>
</template>

<script>
import { getLastUpdateViewed } from '../helpers/latestUpdate'
import { INDEX_PATH } from '../config/paths'
import currentBootstrapBreakpoint from '../mixins/currentBootstrapBreakpoint'


export default {
  mixins: [currentBootstrapBreakpoint],
  data() {
    return {
      index: INDEX_PATH,
      collapseId: 'nav-collapse',
      open: false,
    }
  },
  computed: {
    searchPlaceholder() {
      return this.currentBreakpoint === 'md' || this.currentBreakpoint === 'xl'
        ? "Search the DMRB, e.g. 'GG 101’"
        : "Search the DMRB"
    },
    showUpdateNotificationBadge() {
      const lastUpdateViewed = getLastUpdateViewed()
      const latestUpdateTitle =
        this.$store.getters['publications/latestPublicationTitle']

      // Don't show notification badge for first-time users
      if (!lastUpdateViewed || !latestUpdateTitle) return false

      return lastUpdateViewed !== latestUpdateTitle
    },
  },
  mounted() {
    this.$store.dispatch('publications/getLatestPublication')
  },
  methods: {
    handleSubmit() {
      if (this.open) {
        this.$root.$emit('bv::toggle::collapse', this.collapseId)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$header-search-border-radius: 8px;

.header {
  border-bottom: 1px solid #eee;
}

.header-menu {
  padding: 1.5rem 0;

  @media screen and (min-width: $breakpoint-lg) {
    padding: 0;
    align-items: stretch;
    align-self: stretch;
  }
}

.navbar-brand {
  margin-right: 15px;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media screen and (min-width: $breakpoint-lg) {
    margin-right: 90px;
  }
}

.navbar-light .navbar-nav .nav-link:hover,
.navbar-light .navbar-nav .nav-link:focus {
  color: $body-color;
  font-weight: 700;
}

.navbar-light .navbar-nav .nav-link {
  color: $body-color;
  position: relative;
  font-weight: bold;

  &:hover {
    font-weight: normal;
    color: $body-color-subdued;
  }

  @media screen and (min-width: $breakpoint-lg) {
    padding: 1rem 24px;
    display: flex;
    align-items: center;

    & > span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
    }
    /*
      Adds the link title as the bolded version but visibly hidden to prevent
      navigation from jumping around when the font-weight changes
    */
    &::before {
      content: attr(title);
      display: block;
      font-weight: bold;
      height: 0;
      overflow: hidden;
      visibility: hidden;
    }
  }
}

.navbar-light .navbar-nav .nav-link.nuxt-link-active {
  font-weight: normal;
  color: $body-color-subdued;
  position: relative;

  &:hover {
    font-weight: bold;
    color: $body-color;
    &:after {
      border-color: $body-color;
    }
  }

  @media screen and (min-width: $breakpoint-lg) {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-bottom: 2px solid $body-color-subdued;
    }
  }
}

.navbar-nav {
  margin-top: 1.5rem;
  font-size: 0.875rem;

  @media screen and (min-width: $breakpoint-lg) {
    margin-top: 0;
  }
}

.nav-item {
  @media screen and (min-width: $breakpoint-lg) {
    display: flex;
    align-items: stretch;
  }
}

.navbar-light .navbar-toggler {
  border: 0;
}

.nav-search-container {
  flex: 0 1 100%;

  @media screen and (min-width: $breakpoint-lg) {
    padding: 0.5rem 0;
    flex-basis: 195px;
    margin-right: 24px;
    display: flex;
    align-items: center;
    justify-content: stretch;
  }

  @media screen and (min-width: $breakpoint-lg) {
    flex-basis: 365px;
  }
}

.header-searchbox {
  width: 100%;
}

.header-searchbox.with-icon {
  border-radius: $header-search-border-radius;
}

.header-searchbox ::v-deep .form-control {
  border-top-right-radius: $header-search-border-radius;
  border-bottom-right-radius: $header-search-border-radius;
  background-color: $header-search-bg;
  border-color: $header-search-bg;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  height: 2.375rem;
}

.header-searchbox {
  &:hover {
    ::v-deep .form-control {
      border-color: lighten($body-color-subdued, 40%);
    }

    ::v-deep .with-icon {
      .b-icon {
        fill: $body-color;
        opacity: 1;
      }
    }
  }
}

.header-searchbox:hover ::v-deep .input-group-text {
  border-color: lighten($body-color-subdued, 40%);
}

.header-searchbox ::v-deep .with-icon {
  .b-icon {
    fill: #262626;
    opacity: 0.69;
  }
}

.header-searchbox ::v-deep .with-icon.is-focused {
  .input-group-text {
    background-color: white;
    border-color: lighten($body-color-subdued, 40%);
  }

  .b-icon {
    fill: $body-color;
    opacity: 1;
  }
}

.header-searchbox ::v-deep .form-control:focus {
  border-color: lighten($body-color-subdued, 40%);
  background-color: white;
}

.header-searchbox ::v-deep .input-group-text {
  border-top-left-radius: $header-search-border-radius;
  border-bottom-left-radius: $header-search-border-radius;
  background-color: $header-search-bg;
  border-color: $header-search-bg;
  padding-top: 0;
  padding-bottom: 0;
}

.outer {
  position: relative;
}

.notification {
  display: inline-flex;
  width: 8px;
  height: 8px;
  background: #f15252;
  border-radius: 50%;
  position: absolute;
  left: calc(100% + 2px);
  top: -0.2em;
  color: white;
  font-size: 8px;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.navbar-notification-container {
  position: relative;
}

.navbar-notification-container .notification {
  left: 0%;
  top: -2px;
}

.navbar-menu-text {
  font-size: 0.875rem;
  color: $body-color;
  font-weight: bold;
}
</style>
