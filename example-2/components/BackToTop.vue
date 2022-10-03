<template>
  <div
    :class="['back-to-top-button', scrollYDistance > scrollDepth && 'active']"
  >
    <a
      class="btn btn-secondary d-flex align-items-center"
      :tabindex="scrollYDistance > scrollDepth ? 0 : -1"
      @click.prevent="toTop"
      @keydown.enter="toTop"
    >
      <img :src="upIcon" alt="" />
      <span class="pl-1">Back to top</span>
      <span class="sr-only">
        Press enter to return to the top of the screen
      </span>
    </a>
  </div>
</template>

<script>
import upIcon from '~/assets/icons/arrow-up-circle-icon.svg'

export default {
  props: {
    scrollDepth: { type: Number, required: true },
    targetHash: { type: String, default: '#main-content' },
  },
  data() {
    return {
      scrollTimer: 0,
      scrollYDistance: 0,
      upIcon,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      if (this.scrollTimer) return
      this.scrollTimer = setTimeout(() => {
        this.scrollYDistance = window.scrollY
        clearTimeout(this.scrollTimer)
        this.scrollTimer = 0
      }, 100)
    },
    toTop() {
      // upcycled SkipLink component logic
      const target = document.querySelector(`${this.targetHash}`)

      if (target) {
        window.scrollTo(0, target.getBoundingClientRect().y)
        target.focus()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.back-to-top-button {
  position: fixed;
  bottom: 0px;
  right: 24px;
  left: auto;
  top: auto;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s ease-in-out;
  z-index: 1;
  .btn {
    border: 1px solid $body-color;
  }
  &.active {
    visibility: visible;
    opacity: 1;
    bottom: 24px;
  }
}
</style>
