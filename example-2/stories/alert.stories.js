import Alert from '../components/Alert.vue'

export default {
  title: 'Alert',
  component: Alert,
}

export const defaultAlert = () => ({
  components: { Alert },
  template: `<Alert show><strong>Heads up!</strong> The structure of the DMRB has been
  changed. <a href="#">Click here to read what’s changed. </a></Alert>`,
})

export const errorAlert = () => ({
  components: { Alert },
  template: `<Alert show variant="danger"><strong>Error!</strong> There was a problem fetching something from the API or something like that.</Alert>`,
})
