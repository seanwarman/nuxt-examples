<template>
  <div v-click-outside="handleClickOutside" class="search-container">
    <b-form
      :class="{ 'is-focused': isFocused, 'with-icon': withIcon }"
      role="search"
      :aria-label="ariaLabel"
      @submit="handleSubmit"
    >
      <label v-if="accessibleLabel && id" class="sr-only" :for="id">{{
        accessibleLabel
      }}</label>

      <SearchInput
        :id="id"
        ref="searchInput"
        v-model="searchTerm"
        :placeholder="placeholder"
        :with-icon="withIcon"
        autocomplete="off"
        @focus="handleFocus"
        @blur="isFocused = false"
      />
    </b-form>

    <div v-if="recentLinks.length" aria-live="polite">
      <div
        class="recent-dropdown"
        :style="{ display: showRecent ? 'block' : 'none' }"
        :aria-hidden="!showRecent"
      >
        <header>
          <h4>Recent documents</h4>
          <Button variant="link" @click="handleClearRecent"
            >Clear recent</Button
          >
        </header>
        <ul role="menu">
          <li v-for="(quickLink, index) in recentLinks" :key="quickLink.link">
            <a
              :href="quickLink.link"
              @focus="showRecentIsFocused = true"
              @blur="handleLinkBlur(index)"
              >{{ quickLink.title }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { SEARCH_PATH } from '../config/paths'
import {
  getRecentDownloads,
  clearRecentItems,
} from '../helpers/recentDownloads'

export default {
  props: {
    withIcon: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: 'Search...',
    },
    onSubmit: {
      type: Function,
      default: undefined,
    },
    id: { type: String, default: undefined },
    accessibleLabel: { type: String, default: undefined },
    ariaLabel: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      searchTerm: this.$route.query.q || '',
      isFocused: false,
      showRecent: false,
      showRecentIsFocused: false,
      recentLinks: [],
    }
  },
  watch: {
    '$route.query.q'() {
      this.$data.searchTerm = this.$route.query.q
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyboard)
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleKeyboard)
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.$emit('submit')

      if (this.onSubmit) {
        this.onSubmit(e)
      } else {
        this.$router.push({
          path: SEARCH_PATH,
          query: { q: this.searchTerm, pageNumber: 1 },
        })
      }
    },
    handleIconClick() {
      this.$refs.input && this.$refs.input.$el && this.$refs.input.$el.focus()
    },
    handleFocus() {
      this.isFocused = true
      this.showRecent = true
      this.recentLinks = getRecentDownloads()
    },
    handleLinkBlur(index) {
      if (index === this.recentLinks.length - 1) {
        this.closeRecent()
      }
    },
    closeRecent() {
      this.showRecent = false
      this.showRecentIsFocused = false
    },
    handleKeyboard(event) {
      const keycode = event.code.toLowerCase()
      const { shiftKey } = event

      if (this.isFocused || this.showRecentIsFocused) {
        if (shiftKey && keycode === 'tab') {
          this.closeRecent()
        }

        if (
          (keycode === 'escape' || keycode === 'esc') &&
          this.showRecent === true
        ) {
          this.closeRecent()
        }
      }
    },
    handleClickOutside() {
      if (this.showRecent) {
        this.closeRecent()
      }
    },
    handleClearRecent() {
      clearRecentItems()
      this.recentLinks = []
      this.closeRecent()
    },
  },
}
</script>

<style lang="scss" scoped>
.with-icon.is-focused {
  border-radius: $input-border-radius;

  ::v-deep .input-group-text {
    border-color: #ffffff;
  }

  ::v-deep .search-button {
    box-shadow: none;
    opacity: 1;
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;
  }
}

.search-container {
  position: relative;
}
.recent-dropdown {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  background: white;
  margin: 0;
  top: calc(100% + 4px);
  text-shadow: none;
  color: $body-color;
  border-radius: 8px;
  border: 1px solid $brand-border-color;

  header {
    display: flex;
    align-items: center;
  }

  h4 {
    font-size: 14px;
    font-weight: bold;
    padding: 0.9375rem 15px;
    margin: 0;
    flex: 1;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .btn {
    font-size: 0.75rem;
    min-width: 0;
  }
}

form.is-focused {
  box-shadow: 0 0 0 3px $brand-primary, 0 0 0 5px #ffffff;
}

.recent-dropdown a {
  display: block;
  padding: 0.6875rem 15px;
  font-size: 12px;
  font-weight: 500;
  color: inherit;

  &:hover,
  &:active,
  &:focus {
    background-color: $header-search-bg;
    text-decoration: underline;
  }
}
</style>
