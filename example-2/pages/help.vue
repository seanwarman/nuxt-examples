<template>
  <!-- eslint-disable vue/no-v-html -->
  <Page>
    <div class="help-intro">
      <PageHeading ref="focusTarget">{{ page_title }}</PageHeading>
      <p class="text-break" v-html="page_subheading"></p>
    </div>

    <Alert
      v-for="notice in notices"
      :id="noticeId(notice.name)"
      :key="notice.id"
      show
      :variant="notice.type.toLowerCase()"
      v-html="notice.content"
    />

    <aside slot="left-col">
      <PageSubHeading>On this page</PageSubHeading>
      <ul class="list-unstyled">
        <li v-for="section in sections" :key="section.id" class="mb-3">
          <nuxt-link :to="{ hash: kebabCase(section.title) }">
            {{ section.title }}
          </nuxt-link>
        </li>
      </ul>
    </aside>

    <div slot="right-col">
      <HelpSection
        v-for="section in sections"
        :key="section.id"
        :title="section.title"
        :hash-id="kebabCase(section.title)"
        :content="section.body"
      />
    </div>
  </Page>
</template>

<script>
import { pick } from 'ramda'
import kebabCase from 'lodash.kebabcase'
import focusHeadingOnMountMixin from '../mixins/aria-focus-heading'

export default {
  mixins: [focusHeadingOnMountMixin],
  layout: 'two-column',
  asyncData({ $cms }) {
    return $cms
      .get('dmrb-help')
      .then((res) =>
        pick(['page_title', 'page_subheading', 'notices', 'sections'], res.data)
      )
  },
  head() {
    return {
      title: 'Help & Support',
    }
  },
  methods: {
    kebabCase,
    noticeId(str) {
      return `notice-${kebabCase(str)}`
    },
  },
}
</script>

<style lang="scss" scoped>
.help-intro {
  margin-bottom: 1.625rem;

  @media screen and (min-width: $breakpoint-md) {
    margin-bottom: 6.25rem;
  }
}

.help-section {
  margin-bottom: 2rem;
  font-size: 0.875rem;

  @media screen and (min-width: $breakpoint-md) {
    margin-bottom: 2.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
