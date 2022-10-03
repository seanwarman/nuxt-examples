import get from 'lodash.get'
import dayjs from 'dayjs'
import { disciplinesLut } from '~/config/disciplines'
import { lifecyclesLut } from '~/config/lifecycles'
import { DISPLAY_DATE_FORMAT, OUTPUT_DATE_FORMAT } from '~/config/site'

const searchRegex = /([a-zA-z]{2}\d+){1}/g // two alpha characters follwed by a digit

const resultColumns = [
  'SUITE',
  'TITLE',
  'DISCIPLINE',
  'LIFECYCLE_STAGE',
  'REVISION',
  'DATE_OF_ISSUE',
  'DATE_OF_WITHDRAWAL',
  'HAS_PUBLIC_DOCUMENT',
  'DOCUMENT_REFERENCE',
  'VOLUME',
]
const formatSearch = (input) => {
  const search = input.search(searchRegex)
  if (search === -1) return input

  const splicedVal =
    input.slice(search, search + 2) +
    ' ' +
    input.slice(search + 2, input.length)

  return splicedVal
}

const getSearchTermPart = (rawTerm) => {
  if (!rawTerm) return null
  const formattedSearchTerm = formatSearch(rawTerm)

  if (rawTerm === formattedSearchTerm) {
    return `(TITLE ~ '"${rawTerm}"' | DOCUMENT_REFERENCE ~ '"${rawTerm}"')`
  } else {
    return `(TITLE ~ '"${rawTerm}"' | DOCUMENT_REFERENCE ~ '"${rawTerm}"' | DOCUMENT_REFERENCE ~ '"${formattedSearchTerm}"')`
  }
}

const prepareSearchResults = (rawSearchResults, isArchive) => {
  const preparedSearchResults = {
    ...rawSearchResults,
    page: rawSearchResults.page.map((item) => ({
      ...item,
      formattedData: {
        DATE_OF_ISSUE: dayjs(item.resultData.DATE_OF_ISSUE).format(
          DISPLAY_DATE_FORMAT
        ),
        DATE_OF_WITHDRAWAL: item.resultData.DATE_OF_WITHDRAWAL
          ? dayjs(item.resultData.DATE_OF_WITHDRAWAL).format(
              DISPLAY_DATE_FORMAT
            )
          : undefined,
        IS_WITHDRAWN: item.resultData.DATE_OF_WITHDRAWAL
          ? dayjs(item.resultData.DATE_OF_WITHDRAWAL).isBefore(dayjs())
          : false,
        LIFECYCLE_STAGE: get(
          lifecyclesLut,
          item.resultData.LIFECYCLE_STAGE,
          item.resultData.LIFECYCLE_STAGE
        ),
        DISCIPLINE: get(
          disciplinesLut,
          item.resultData.DISCIPLINE,
          item.resultData.DISCIPLINE
        ),
        TITLE: [item.resultData.DOCUMENT_REFERENCE, item.resultData.TITLE]
          .filter(Boolean)
          .join(' - '),
        ATTACHMENT_URL: item.resultData.HAS_PUBLIC_DOCUMENT
          ? `${process.env.apiEndpoint}/attachments/${item.nodeId}`
          : undefined,
        DOCUMENT_PAGE_URL: item.resultData.HAS_PUBLIC_DOCUMENT
          ? `/${isArchive ? 'archive/search' : 'search'}/${item.nodeId}`
          : undefined,
      },
    })),
  }
  return preparedSearchResults
}

const buildQuery = ({
  searchTerm,
  discipline,
  lifecycles,
  volume,
  section,
  suites,
}) => {
  const suitePart = `(${suites
    .map((suite) => `SUITE = '${suite}'`)
    .join(' | ')})`
  const disciplinePart = discipline ? `DISCIPLINE = '${discipline}'` : null
  const lifecyclesPart = lifecycles
    ? `(${lifecycles
        .split(',')
        .map((part) => `LIFECYCLE_STAGE = '${part}'`)
        .join(' | ')})`
    : null
  const searchTermPart = getSearchTermPart(searchTerm)
  const volumePart = volume ? `VOLUME = ${volume}` : null
  const sectionPart = section ? `SECTION = ${section}` : null

  const q = [
    suitePart,
    lifecyclesPart,
    disciplinePart,
    searchTermPart,
    volumePart,
    sectionPart,
  ]
    .filter(Boolean)
    .join(' & ')

  return q
}

const prepareDateForApi = (dateString, incomingFormat = OUTPUT_DATE_FORMAT) => {
  if (!dateString) return null
  const parsedDate = dayjs(dateString, incomingFormat)
  return parsedDate.isValid() ? `${parsedDate.unix()}000` : '' // Fallback to empty string (today)
}

export { buildQuery, prepareSearchResults, prepareDateForApi, resultColumns }
