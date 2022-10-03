<template>
  <div>
    <PageHeading ref="focusTarget">{{ page_title }}</PageHeading>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p class="text-break" v-html="page_subheading"></p>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="body_text" />
  </div>
</template>

<script>
import { pick } from 'ramda'
import focusHeadingOnMountMixin from '../mixins/aria-focus-heading'

export default {
  mixins: [focusHeadingOnMountMixin],
  asyncData({ $cms }) {
    return $cms
      .get('dmrb-contact-page')
      .then(res =>
        pick(['page_title', 'page_subheading', 'body_text'], res.data)
      )
  },
  head() {
    return {
      title: 'Contact'
    }
  }
}
</script>
