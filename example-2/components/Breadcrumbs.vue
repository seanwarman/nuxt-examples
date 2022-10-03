<template>
  <b-container>
    <b-row>
      <b-col>
        <div class="breadcrumbs">
          <b-breadcrumb>
            <b-breadcrumb-item
              v-for="item in breadcrumbItems"
              :key="item.text"
              :href="item.href"
              :to="item.to"
              :active="item.active"
            >
              {{ item.text }}
            </b-breadcrumb-item>
          </b-breadcrumb>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import breakpointMixin from '../mixins/currentBootstrapBreakpoint'
import breadcrumbsLookupTable from '../config/breadcrumbs'

const getBaseCrumbs = () => [
  {
    text: 'Standards for Highways',
    href: 'https://standardsforhighways.co.uk',
  },
  {
    text: 'DMRB',
    to: '/',
  },
]

const buildCrumbs = (pathParts, titleOverride) => {
  if (!pathParts || !pathParts.length) return []
  return pathParts.reduce((accum, path, i, arr) => {
    const routeTo = i > 0 ? `${accum[i - 1].to}/${path}` : `/${path}`
    const text =
      (breadcrumbsLookupTable[routeTo] &&
        breadcrumbsLookupTable[routeTo].text) ||
      path.toUpperCase()
    const active =
      (breadcrumbsLookupTable[routeTo] &&
        breadcrumbsLookupTable[routeTo].active) ||
      false
    const isLastItem = i === arr.length - 1

    return [
      ...accum,
      {
        text: isLastItem ? titleOverride || text : text,
        to: routeTo,
        active,
      },
    ]
  }, [])
}

export default {
  mixins: [breakpointMixin],
  props: {
    titleOverride: {
      type: String,
      default: null,
    },
  },
  computed: {
    breadcrumbItems() {
      const isMobile = ['xs', 'sm'].includes(this.currentBreakpoint)
      const pathParts = this.$route.path.split('/').filter((path) => !!path)
      const isError = !this.$route.matched.length
      const pageCrumbs = buildCrumbs(pathParts, this.titleOverride)

      const crumbs = isError
        ? [
            ...getBaseCrumbs(),
            {
              text: 'Error',
            },
          ]
        : [...getBaseCrumbs(), ...pageCrumbs]
      crumbs[crumbs.length - 1].active = true
      const mobileCrumbs = crumbs.slice(crumbs.length - 2, crumbs.length - 1)

      return isMobile ? mobileCrumbs : crumbs
    },
  },
}
</script>

<style lang="scss" scoped>
.breadcrumbs {
  font-size: 0.75rem;
  padding: 1rem 0;
}

.breadcrumbs a {
  color: inherit;
  text-decoration: underline;
  &:focus,
  &:focus-visible {
    background: $brand-primary;
    color: #ffffff;
    box-shadow: 0 0 0 4px $brand-primary;
    outline: none;
  }
}

.breadcrumbs .breadcrumb {
  margin-bottom: 0;
  background-color: transparent;
  padding: 0;
}
</style>
