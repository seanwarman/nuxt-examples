<template>
  <footer class="footer">
    <h2 class="sr-only">Site information</h2>
    <b-container>
      <b-row>
        <b-col cols="12" md="8" offset-md="2">
          <section class="footer-logos">
            <h3>Overseeing Organisations</h3>

            <ul class="footer-logos-list">
              <li
                v-for="link in logoLinks"
                :key="link.image"
                class="d-flex align-items-center"
              >
                <a :href="link.href" :title="link.title">
                  <img
                    :src="link.image"
                    :alt="`${link.title} Logo`"
                    loading="lazy"
                  />
                </a>
              </li>
            </ul>
          </section>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" md="4">
          <Divider />
          <section class="footer-section">
            <h3>Design Manual for Roads and Bridges</h3>
            <p class="footer-section__text">
              Information on the design, construction and maintenance of
              highways for construction professionals.
            </p>
            <ul class="footer-links">
              <li v-for="link in siteMapLink" :key="link.href">
                <nuxt-link :to="link.href" :title="link.title">
                  <span>{{ link.label }}</span>
                </nuxt-link>
              </li>
            </ul>
          </section>
        </b-col>

        <b-col cols="12" md="5">
          <Divider />
          <section class="footer-section">
            <h3>
              <a
                :href="standardsForHighwaysHeaderLink.href"
                :title="standardsForHighwaysHeaderLink.title"
              >
                <span>{{ standardsForHighwaysHeaderLink.label }}</span>
              </a>
            </h3>

            <b-row>
              <b-col cols="12" md="5">
                <ul class="footer-links">
                  <li
                    v-for="link in splitStandardsForHighwaysLinks['left']"
                    :key="link.href"
                  >
                    <a :href="link.href" :title="link.title">
                      <span>{{ link.label }}</span>
                    </a>
                  </li>
                </ul>
              </b-col>
              <b-col cols="12" md="7">
                <ul class="footer-links">
                  <li
                    v-for="link in splitStandardsForHighwaysLinks['right']"
                    :key="link.href"
                  >
                    <a :href="link.href" :title="link.title">
                      <span>{{ link.label }}</span>
                    </a>
                  </li>
                </ul>
              </b-col>
            </b-row>
          </section>
        </b-col>

        <b-col cols="12" md="3">
          <Divider />
          <section class="footer-section">
            <h3>
              <a
                :href="departmentForTransportHeaderLink.href"
                :title="departmentForTransportHeaderLink.title"
              >
                <span>{{ departmentForTransportHeaderLink.label }}</span>
              </a>
            </h3>

            <ul class="footer-links">
              <li v-for="link in departmentForTransportLinks" :key="link.href">
                <a :href="link.href" :title="link.title">
                  <span>{{ link.label }}</span>
                </a>
              </li>
            </ul>
          </section>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12">
          <Divider />
          <section class="footer-section">
            <ul class="footer-links inline">
              <li v-for="link in termsLinks" :key="link.title">
                <a :href="link.href" :title="link.title">
                  <span>{{ link.label }}</span>
                </a>
              </li>
            </ul>
          </section>
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>

<script>
import {
  standardsForHighways,
  departmentForTransport,
  siteMap,
  terms,
  logos,
  standardsForHighwaysHeader,
  departmentForTransportHeader,
} from '../config/footerLinks'

export default {
  data() {
    return {
      siteMapLink: siteMap,
      standardsForHighwaysHeaderLink: standardsForHighwaysHeader,
      standardsForHighwaysLinks: standardsForHighways,
      departmentForTransportHeaderLink: departmentForTransportHeader,
      departmentForTransportLinks: departmentForTransport,
      termsLinks: terms,
      logoLinks: logos,
    }
  },
  computed: {
    splitStandardsForHighwaysLinks() {
      const { length } = this.standardsForHighwaysLinks
      const split = Math.floor(length / 2)

      return {
        left: this.standardsForHighwaysLinks.slice(0, split),
        right: this.standardsForHighwaysLinks.slice(split, length),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 5rem;
}

.footer,
.footer h3 {
  font-size: 0.875rem;
}

.footer h3 {
  font-weight: bold;
  margin-bottom: 1rem;
}

.footer h3 a {
  color: inherit;
  &:focus,
  &:focus-visible {
    background: $brand-primary;
    color: #ffffff;
    box-shadow: 0 0 0 4px $brand-primary;
    outline: none;
  }
}

.footer-section {
  padding: 1.5rem 0 2rem;
  &__text {
    font-size: 0.875rem;
  }
}

.footer-links {
  list-style: none;
  padding: 0;
  font-size: 0.75rem;
}

.footer-links.inline li {
  display: inline-block;
  margin: 0 50px 1rem 0;
}

.footer-links li {
  margin: 0 0 1rem 0;
}

.footer-links a {
  color: $body-color-subdued;
  &:focus,
  &:focus-visible {
    background: $brand-primary;
    color: #ffffff;
    box-shadow: 0 0 0 4px $brand-primary;
    outline: none;
  }
}

.footer-logos {
  text-align: center;
  padding-bottom: 2.5rem;

  @media screen and (min-width: $breakpoint-md) {
    padding-bottom: 4.375rem;
  }
}

.footer-logos h3 {
  font-weight: normal;
  color: $body-color-subdued;
  margin-bottom: 1.5rem;

  @media screen and (min-width: $breakpoint-md) {
    margin-bottom: 2.1875rem;
  }
}

.footer-logos-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;

  @supports (display: grid) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }

  @media screen and (min-width: $breakpoint-md) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

.footer-logos-list li {
  flex: 0 0 50%;
  padding: 15px;

  @supports (display: grid) {
    padding: 0;
  }

  @media screen and (min-width: $breakpoint-md) {
    flex: 0 0 25%;
    width: 25%;
    padding: 0;

    @supports (display: grid) {
      width: auto;
    }
  }
}

.footer-logos-list a {
  display: block;
}
.footer-logos-list img {
  display: block;
  width: 100%;
}
</style>
