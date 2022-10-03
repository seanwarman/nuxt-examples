import { action } from '@storybook/addon-actions'
import Button from '../components/Button'

export default {
  title: 'Buttons',
  component: Button,
}

const handleClick = (e) => {
  action('button-click')(e)
}

export const defaultButton = () => ({
  components: { Button },
  template: `<Button @click="handleClick">Default button</Button>`,
  methods: {
    handleClick,
  },
})

export const disabledButton = () => ({
  components: { Button },
  template: `<Button @click="handleClick" disabled>Disabled button</Button>`,
  methods: {
    handleClick,
  },
})

export const secondaryButton = () => ({
  components: { Button },
  template: `<Button @click="handleClick" variant="secondary">Secondary button</Button>`,
  methods: {
    handleClick,
  },
})

export const buttonAsALink = () => ({
  components: { Button },
  template: `<Button @click="handleClick" href="https://google.com">Link button</Button>`,
  methods: {
    handleClick,
  },
})

export const buttonAsARouterLink = () => ({
  components: { Button },
  template: `<Button @click="handleClick" to="/about">Router button</Button>`,
  methods: {
    handleClick,
  },
})
