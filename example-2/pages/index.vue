<template>
  <!-- eslint-disable vue/no-v-html -->
  <main id="main-content" tabindex="-1">
    <section
      class="homepage-hero d-flex align-items-center"
      :style="`background-image: url(${setHeroImage})`"
    >
      <b-container>
        <b-row>
          <b-col cols="12" md="8" offset-md="2">
            <h1 id="main-heading" ref="focusTarget" tabindex="-1">
              {{ page_title }}
            </h1>
            <label for="hero-search">{{ page_subheading }}</label>
            <SearchBox
              id="hero-search"
              :placeholder="searchPlaceholder"
              with-icon
              aria-label="Site search, secondary"
            />
          </b-col>
        </b-row>
      </b-container>
    </section>

    <b-container>
      <b-row>
        <b-col cols="12" md="8" offset-md="2">
          <Alert
            v-for="notice in notices"
            :id="noticeId(notice.name)"
            :key="notice.id"
            show
            :variant="notice.type.toLowerCase()"
            v-html="notice.content"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col class="mt-3" cols="12" md="8" offset-md="2" v-html="body_text" />
      </b-row>

      <b-row>
        <b-col class="px-md-0" cols="12">
          <div class="resource-cards">
            <ResourceCard
              v-for="(card, key) in resourceLinks"
              :key="key"
              :title="card.title"
              :to="card.link"
              :notification="card.dynamic"
              :updated-content="card.updatedContent && card.updatedContent.text"
            >
              <component :is="resourceIcon(card.icon_name)"></component>
            </ResourceCard>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" md="8">
          <div class="discipline-cards">
            <h2 class="mb-4">Find documents by disciplines</h2>
            <DisciplineCard
              v-for="card in discipline_cards"
              :key="card.id"
              :title="card.title"
              :description="card.description"
              :to="card.url"
            >
              <component :is="disciplineIcon(card.icon_name)" />
            </DisciplineCard>
          </div>
        </b-col>
      </b-row>

      <b-row v-if="show_leaderboard && leaderboard">
        <b-col cols="12" md="8" offset-md="2" lg="6" offset-lg="3">
          <section class="homepage-shop-section">
            <img
              v-if="leaderboard.image"
              :src="leaderboard.image.url"
              :alt="leaderboard.image.alternativeText"
              loading="lazy"
            />
            <p v-html="leaderboard.body"></p>
            <Button
              v-if="leaderboard.link"
              variant="secondary"
              :href="leaderboard.link.url"
              :target="leaderboard.link.target_blank ? '_blank' : '_self'"
              >{{ leaderboard.link.link_text }}</Button
            >
          </section>
        </b-col>
      </b-row>
    </b-container>
  </main>
</template>

<script>
import { pick } from 'ramda'
import kebabCase from 'lodash.kebabcase'
import { disciplineIcon } from '../config/disciplines'
import { resourceLinks, resourceIcon } from '../config/resourceLinks'
import focusHeadingOnMountMixin from '../mixins/aria-focus-heading'
import currentBootstrapBreakpoint from '../mixins/currentBootstrapBreakpoint'
import { imageSelector } from '../helpers/images'

export default {
  mixins: [currentBootstrapBreakpoint, focusHeadingOnMountMixin],
  layout: 'homepage',
  asyncData({ $cms }) {
    return $cms
      .get('dmrb-home')
      .then((res) =>
        pick([
          'page_title',
          'page_subheading',
          'hero_image',
          'body_text',
          'show_leaderboard',
          'discipline_cards',
          'leaderboard',
          'notices',
        ], res.data)
      )
  },
  data() {
    return {
      page_title: 'Welcome to the new DMRB',
      page_subheading: 'Find a document',
      body_text: `<h2>Find documents by disciplines</h2>
          <p>
            The Design Manual for Roads and Bridges (DMRB) contains information
            about current standards relating to the design, assessment and
            operation of motorway and all-purpose trunk roads in the United
            Kingdom.
          </p>`,
      show_leaderboard: false,
      discipline_cards: [],
      leaderboard: null,
      notices: [],
      resourceLinks,
    }
  },
  computed: {
    searchPlaceholder() {
      return this.currentBreakpoint === 'xs'
        ? "Search the DMRB"
        : this.currentBreakpoint === 'sm' || this.currentBreakpoint === 'md'
        ? "Search the DMRB, e.g. 'GG 101’"
        : "Search for document names or codes, for example, ‘GG 101’ not ‘GG101’"
    },
    setHeroImage() {
      if (!this.hero_image?.length) {
        return undefined
      }
      const { formats, url: defaultImageUrl } = this.hero_image[0]

      return imageSelector([formats, defaultImageUrl, this.currentBreakpoint, process.env.cmsApiUrl])
    },
  },
  methods: {
    disciplineIcon,
    resourceIcon,
    noticeId(str) {
      return `notice-${kebabCase(str)}`
    },
  },
}
</script>

<style lang="scss" scoped>
.homepage-hero {
  height: 264px;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  color: white;
  background-size: cover;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.72);
  margin-bottom: 2.5rem;
  background-color: $body-color-subdued;

  @media screen and (min-width: $breakpoint-md) {
    margin-bottom: 3.5rem;
  }
}

.homepage-hero h1 {
  font-weight: 800;
  font-size: 1.75rem;
  margin-bottom: 1rem;

  @media screen and (min-width: $breakpoint-md) {
    font-size: 2.5rem;
  }
}

.homepage-hero label {
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0.5rem;

  @media screen and (min-width: $breakpoint-md) {
    font-size: 1.5rem;
  }
}

.homepage-hero ::v-deep .form-control {
  font-size: 12px;
  padding-top: 0;
  padding-bottom: 0;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
}
.homepage-hero ::v-deep .input-group-text {
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
}

.homepage-intro-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;

  @media screen and (min-width: $breakpoint-md) {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
}

.homepage-intro-copy {
  font-size: 0.875rem;
  margin: 1rem 0 1.5rem;
  font-weight: normal;

  @media screen and (min-width: $breakpoint-md) {
    font-size: 1rem;
    margin: 0.5rem 0 2rem;
  }
}

.homepage-alert {
  margin-bottom: 0;
}

.discipline-cards {
  margin: 1.5rem 0;

  ::v-deep > * {
    margin: 1rem 0;
  }

  @media screen and (min-width: $breakpoint-md) {
    margin: 2rem -0.5rem 3.5rem;
    display: block;
  }
}

.resource-cards {
  margin: 1.5rem 0;

  ::v-deep > * {
    margin: 1rem 0;
    @supports (display: grid) {
      margin: 0;
    }
  }

  @supports (display: grid) {
    display: grid;
    grid-gap: 1rem;
  }

  @media screen and (min-width: $breakpoint-md) {
    margin: 1rem -0.5rem 3.5rem;
    display: flex;
    flex-wrap: wrap;

    ::v-deep > * {
      flex-shrink: 1;
      flex-basis: calc(25% - 1rem);
      margin: 0.5rem;

      @supports (display: grid) {
        margin: 0;
      }
    }

    @supports (display: grid) {
      margin: 1rem 0 3.5rem;
      align-items: stretch;
      display: grid;
      grid-gap: 1rem;
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.homepage-shop-section {
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 1rem 0 0;

  @media screen and (min-width: $breakpoint-md) {
    flex-direction: row;
    margin: 1rem 0 0;
  }
}

.homepage-shop-section img {
  width: 58px;
  height: auto;
  display: inline-block;
  margin-bottom: 1.5rem;

  @media screen and (min-width: $breakpoint-md) {
    margin-bottom: 0;
  }

  @media screen and (min-width: $breakpoint-xl) {
    width: 67px;
  }
}

.homepage-shop-section p {
  margin: 0.5rem 0 1.5rem;
  padding: 0 32px;

  @media screen and (min-width: $breakpoint-md) {
    margin: 0 24px;
    text-align: left;
    padding: 0;
  }
}

.homepage-shop-section .btn {
  min-width: 142px;

  @media screen and (min-width: $breakpoint-xl) {
    min-width: $btn-min-width;
  }
}
</style>
