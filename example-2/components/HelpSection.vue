<template>
  <section class="help-section">
    <PageSubHeading :id="hashId">
      {{ title }}
    </PageSubHeading>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="content"></div>
  </section>
</template>
<script>
export default {
  props: {
    title: { type: String, required: true },
    hashId: { type: String, required: true },
    content: { type: String, required: true },
  },
}
</script>
