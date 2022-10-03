import Datepicker from '../components/Datepicker.vue'

export default {
  title: 'Datepicker',
}

export const datepicker = () => ({
  components: { Datepicker },
  data() {
    return {
      toDate: null,
    }
  },
  template: `
    <Datepicker v-model="toDate" label="To" placeholder="Enter a date" id="To">
      <span slot="example">
        For example, 21/11/2008 <small>(DD/MM/YYYY)</small>
      </span>
    </Datepicker>
  `,
})
