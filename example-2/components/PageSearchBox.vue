<template>
  <b-form
    class="search-form"
    role="search"
    :aria-label="searchAriaLabel"
    @submit="onSubmit"
  >
    <b-form-group
      :label="searchLabel"
      label-for="PageSearchBox"
      class="search-form-input"
    >
      <p id="pageSearchExample" class="search-form-example">
        {{ searchExample }}
      </p>
      <b-form-input
        id="PageSearchBox"
        v-model="searchTerm"
        type="search"
        placeholder="Search for a document"
        aria-describedby="pageSearchExample"
      ></b-form-input>
    </b-form-group>

    <b-form-group>
      <Button type="submit" variant="primary"> Search </Button>
    </b-form-group>
  </b-form>
</template>

<script>
import { SEARCH_PATH } from '../config/paths'

export default {
  props: {
    searchPath: {
      type: String,
      default: SEARCH_PATH,
    },
    searchExample: {
      type: String,
      default: 'For example, ‘GG 101’ not ‘GG101’',
    },
    searchLabel: {
      type: String,
      default: 'Search for document names or codes',
    },
    searchAriaLabel: {
      type: String,
      default: 'Search the DMRB, primary',
    },
  },

  data() {
    return {
      searchTerm: this.$route.query.q || '',
    }
  },

  watch: {
    '$route.query.q'() {
      this.$data.searchTerm = this.$route.query.q
    },
  },

  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.$router.push({
        path: this.searchPath,
        query: {
          ...this.$route.query,
          q: this.searchTerm,
          pageNumber: 1,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-form {
  @media screen and (min-width: $breakpoint-md) {
    display: flex;
    align-items: flex-end;
  }
}

.search-form-input {
  flex: 1;

  @media screen and (min-width: $breakpoint-md) {
    margin-right: 24px;
  }

  &::v-deep legend {
    padding-bottom: 0;
  }
}

.search-form-example {
  font-size: 0.875rem;
  margin: 0.5rem 0;
}
</style>
