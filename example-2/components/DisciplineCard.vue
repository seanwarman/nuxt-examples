<template>
  <Card :type="{ disciplines: true }" class="mt-0 mb-4 discipline-card w-100">
    <article class="d-flex align-items-top w-100">
      <div class="discipline-card-icon">
        <slot />
      </div>

      <div>
        <header class="discipline-card-header mb-0">
          <nuxt-link class="discipline-card-link" :to="to" :title="title">
            <h3 class="discipline-card-title">
              <span>{{ title }}</span>
            </h3>
          </nuxt-link>
        </header>

        <p class="discipline-card-description">
          {{ description }}
        </p>
      </div>
    </article>
  </Card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.discipline-card {
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  border: none;

  .discipline-card-title span {
    line-height: 1.5;
  }

  .discipline-card-link {
    &:hover span {
      text-decoration: underline;
    }

    &:focus-visible {
      outline: none;
    }

    &:focus span {
      background: $brand-primary;
      color: #ffffff;
      box-shadow: 0 0 0 4px #4d62e4;
      outline: none;
    }

    &:focus:hover span {
      color: #ffffff;
    }
  }

  ::v-deep > div {
    flex: 1;
    margin: 0;
  }
}

.discipline-card-title {
  display: inline-block;
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
  margin-bottom: 0.5rem;
}

.discipline-card a:hover span {
  text-decoration: underline;
  outline: none;
}

.discipline-card-icon {
  height: 24px;
  max-width: 24px;
  flex: 0 0 24px;
  margin-right: 16px;
  color: $body-color;

  ::v-deep svg {
    display: block;
    width: 100%;
    height: 100%;
    fill: currentColor;
  }
}

.discipline-card-header {
  margin: 0 0 0.5rem 0;
}

.discipline-card-description {
  font-size: 0.75rem;
  color: $body-color-subdued;
  margin-bottom: 0.5rem;
}
</style>
