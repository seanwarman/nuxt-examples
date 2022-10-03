const prefix = '/api/'

const isArrayLikeObject = val => val?.length && !(val instanceof String)

// This is normaliser to remove all "data" and "attribute"
// props from the json response.
// See https://jsonapi.org/ for details on the response shape.
  export const jsonAPINormaliser = value =>
    Object.entries(value).reduce((acc, [key, val]) => {
      if (key === 'data' && val?.attributes) {
        return jsonAPINormaliser(val?.attributes)
      }

      if (val?.data?.attributes) {
        return {
          ...acc,
          [key]: jsonAPINormaliser(val?.data?.attributes),
        }
      }

      if (isArrayLikeObject(val?.data)) {
        return {
          ...acc,
          [key]: val?.data.map(o => jsonAPINormaliser(o?.attributes || o)),
        }
      }

      if (val?.data === null) {
        return {
          ...acc,
          [key]: null,
        }
      }

      if (val instanceof Object) {
        return {
          ...acc,
          [key]: jsonAPINormaliser(val),
        }
      }

      return {
        ...acc,
        [key]: val,
      }
  }, {})

export default function(ctx, inject) {
  const cms = ctx.$axios.create()
  cms.setBaseURL(process.env.cmsApiUrl + prefix)
  cms.interceptors.response.use(({ data }) => jsonAPINormaliser({ data }))
  ctx.$cms = cms
  inject('cms', cms)
}
