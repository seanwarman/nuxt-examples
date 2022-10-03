<template>
  <aside class="sb-snippet">
    <div class="content">
      <img v-if="image" :src="image.url" alt="TSO Logo" />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="content" />
    </div>
  </aside>
</template>

<script>
export default {
  props: {
    content: { type: String, required: true },
    image: { type: Object, default: null },
  },
}
</script>

<style lang="scss" scoped>
.sb-snippet {
  margin: 4rem 0;
  padding: 0 1.5rem;
  border-radius: 10px;
  border: 1px solid $brand-border-color;
}

.content {
  padding: 1.5rem 0;
  ::v-deep p:last-child {
    margin-bottom: 0;
  }
}

.content img {
  display: block;
  width: 98px;
  height: auto;
  margin-bottom: 1.5rem;
}
</style>
