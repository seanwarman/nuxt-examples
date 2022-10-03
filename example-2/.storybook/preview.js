import Vue from 'vue'
import { addDecorator, configure } from '@storybook/vue'
import { withA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import VuejsDatePicker from 'vuejs-datepicker'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import '../assets/scss/theme.scss'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.component('nuxt-link', {
  props: ['to'],
  methods: {
    log() {
      action('link target')(this.to)
    },
  },
  template: '<a href="#" @click.prevent="log()"><slot>NuxtLink</slot></a>',
})

Vue.component('vuejs-datepicker', VuejsDatePicker)

function DayJSPlugin() {}
dayjs.extend(customParseFormat)
DayJSPlugin.install = function(Vue) {
  Vue.prototype.$dayjs = dayjs
}
Vue.use(DayJSPlugin)

addDecorator(withA11y)
