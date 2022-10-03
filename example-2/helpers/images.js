import { propOr, test, identity, ifElse, pipe, replace, __ } from 'ramda'

const ifNoHttpAddUrl = cmsApiUrl => 
  ifElse(
    test(/^htt/),
    identity,
    replace(/^/, cmsApiUrl)
  )

const matchStrapiFormatWithCurrentBreakpoint = ([formats, defaultImageUrl]) => pipe(
  replace('xs', 'small'),
  replace('sm', 'medium'),
  replace(/md|lg/, 'large'),
  propOr('large', __, formats),
  propOr(defaultImageUrl, 'url'),
)

export const imageSelector = ([formats, defaultImageUrl, currentBreakpoint, cmsApiUrl]) => pipe(
  matchStrapiFormatWithCurrentBreakpoint([formats, defaultImageUrl]),
  ifNoHttpAddUrl(cmsApiUrl),
)(currentBreakpoint)
