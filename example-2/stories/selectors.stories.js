export default {
  title: 'Selectors',
}

export const checkbox = () => ({
  template: `
  <div>
    <b-form-checkbox
      id="checkbox-1"
      name="checkbox-1"
      value="accepted"
    >
      General information
    </b-form-checkbox>

    <b-form-checkbox
      id="checkbox-2"
      name="checkbox-2"
      value="accepted"
    >
      Appraisal
    </b-form-checkbox>
  </div>`,
})

export const radio = () => ({
  template: `
  <b-form-group label="Individual radios">
    <b-form-radio v-model="selected" name="some-radios" value="A">Option A</b-form-radio>
    <b-form-radio v-model="selected" name="some-radios" value="B">Option B</b-form-radio>
  </b-form-group>
  `,
})
