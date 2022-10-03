<template>
  <div>
    <Breadcrumbs
      :title-override="document.DOCUMENT_REFERENCE || document.TITLE"
    />
    <b-container>
      <b-row>
        <b-col>
          <Page class="mb-0">
            <div>
              <header class="document-heading">
                <span class="suite">
                  <span> {{ document.SUITE }} </span>
                  <span v-if="isArchive || document.isWithdrawn">
                    <span v-if="isArchive">ARCHIVE</span>
                    <strong v-if="document.isWithdrawn">| WITHDRAWN</strong>
                  </span>
                </span>

                <PageHeading ref="focusTarget">{{ documentTitle }}</PageHeading>
                <Alert v-if="document.isWithdrawn" show variant="danger"
                  >This version of the document has been withdrawn. Please
                    <a href="#" @click.stop.prevent="handleScrollToClick('relatedDocuments')">click here</a>
                  to view any newer versions and/or other related documents.</Alert
                >
                <Divider variant="thick" />
              </header>

              <section class="details">
                <dl class="details-list">
                  <div
                    v-if="
                      document.disciplineFormatted ||
                      document.lifecycleStageFormatted
                    "
                    class="details-left"
                  >
                    <div class="details-group">
                      <dt class="sr-only">Discipline</dt>
                      <dd>{{ document.disciplineFormatted }}</dd>
                    </div>
                    <div class="details-group">
                      <dt class="sr-only">Lifecycle Stage</dt>
                      <dd>{{ document.lifecycleStageFormatted }}</dd>
                    </div>
                  </div>
                  <div class="details-right">
                    <div class="details-group">
                      <dt>Issued:</dt>
                      <dd>
                        <time>
                          {{ document.issueDateFormatted }}
                        </time>
                      </dd>
                    </div>
                    <div v-if="document.REVISION" class="details-group">
                      <dt>Version:</dt>
                      <dd>{{ document.REVISION }}</dd>
                    </div>
                    <div v-if="document.isWithdrawn" class="details-group">
                      <dt>Withdrawn:</dt>
                      <dd>
                        <time>
                          {{ document.withdrawnDateFormatted }}
                        </time>
                      </dd>
                    </div>
                  </div>
                </dl>
              </section>

              <section v-if="document.attachmentUrl" class="download">
                <div class="download-content">
                  <p>View and download the document:</p>
                  <Button
                    :rel="document.isWithdrawn ? 'nofollow' : ''"
                    :href="`${document.attachmentUrl}?inline=true`"
                    :title="`Open PDF for ${documentTitle}`"
                    target="_blank"
                    @click="
                      handleDownloadClick(
                        document.attachmentUrl,
                        documentTitle,
                        document.NODE_ID
                      )
                    "
                    >Open PDF</Button
                  >
                  <Button
                    :rel="document.isWithdrawn ? 'nofollow' : ''"
                    :href="document.attachmentUrl"
                    :title="`Open PDF for ${documentTitle}`"
                    target="_blank"
                    @click="
                      handleDownloadClick(
                        document.attachmentUrl,
                        documentTitle,
                        document.NODE_ID
                      )
                    "
                    >Download PDF</Button
                  >
                </div>
              </section>
            </div>
          </Page>
          <hr class="border-dark mb-5" />
          <template v-if="document.DOCUMENT_REFERENCE">
            <RelatedDocuments
              ref="relatedDocuments"
              :parent-document-node-id="document.NODE_ID"
              :parent-document-reference="document.DOCUMENT_REFERENCE"
            />
            <hr class="border-dark mb-5 mt-4" />
          </template>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="pageDataCheck" md="8">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="pageData.document_contact_field"></span>
          <!-- eslint-disable-next-line vue/no-v-html -->
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { pick } from 'ramda'
import get from 'lodash.get'
import dayjs from 'dayjs'

import { lifecyclesLut } from '~/config/lifecycles'
import { disciplinesLut } from '~/config/disciplines'
import { DISPLAY_DATE_FORMAT } from '~/config/site'
import DOCUMENT_COLUMNS from '~/config/documentColumns'

import { logRecentDownload } from '~/helpers/recentDownloads'
import focusHeadingOnMountMixin from '~/mixins/aria-focus-heading'

function processDocumentData(apiData) {
  return {
    document: {
      ...apiData,
      lifecycleStageFormatted: get(
        lifecyclesLut,
        apiData.LIFECYCLE_STAGE,
        apiData.LIFECYCLE_STAGE
      ),
      disciplineFormatted: get(
        disciplinesLut,
        apiData.DISCIPLINE,
        apiData.DISCIPLINE
      ),
      issueDateFormatted: apiData.DATE_OF_ISSUE
        ? dayjs(apiData.DATE_OF_ISSUE).format(DISPLAY_DATE_FORMAT)
        : undefined,
      withdrawnDateFormatted: apiData.DATE_OF_WITHDRAWAL
        ? dayjs(apiData.DATE_OF_WITHDRAWAL).format(DISPLAY_DATE_FORMAT)
        : undefined,
      attachmentUrl: apiData.HAS_PUBLIC_DOCUMENT
        ? `${process.env.apiEndpoint}/attachments/${apiData.NODE_ID}`
        : undefined,
      isWithdrawn: apiData.DATE_OF_WITHDRAWAL
        ? dayjs(apiData.DATE_OF_WITHDRAWAL).isBefore(dayjs())
        : false,
    },
  }
}

export default {
  mixins: [focusHeadingOnMountMixin],
  layout: 'no-boilerplate',
  props: {
    isArchive: {
      type: Boolean,
      default: false,
    },
  },
  async asyncData({ params, $axios, error, payload, $cms }) {
    if (payload) {
      return processDocumentData(payload)
    }

    const [document, pageData] = await Promise.all([
      $axios.get(`documents/${params.nodeId}`, {
        params: { columns: DOCUMENT_COLUMNS },
      })
      .then((response) => processDocumentData(response.data))
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Error when trying to fetch from API', {
          url: err.config.url,
          httpCode: err.response.status,
        })

        error({
          statusCode: 404,
          message: 'Document not found',
        })
      }),
      $cms.get('dmrb-document-pages')
        .then((res) =>
          pick([
            'document_contact_field',
            'notices',
          ], res.data)
        ),
    ])

    return {
       ...document,
       pageData
    }
  },
  head() {
    const head = {}
    head.title = [this.document.DOCUMENT_REFERENCE, this.document.TITLE]
      .filter(Boolean)
      .join(' - ')

    if (this.document.isWithdrawn) {
      head.meta = [{ hid: 'robots', name: 'robots', content: 'noindex' }]
    }
    return head
  },
  computed: {
    documentTitle() {
      return [this.document.DOCUMENT_REFERENCE, this.document.TITLE]
        .filter(Boolean)
        .join(' - ')
    },
    pageDataCheck() {
      return this.pageData.document_contact_field.length > 0
    }
  },
  methods: {
    handleDownloadClick(url, title, nodeId) {
      logRecentDownload(url, title, nodeId)
    },
    handleScrollToClick(refName) {
      const element = this.$refs[refName]
      const top = element.$el.offsetTop

      window.scrollTo(0, top)
    }
  },
}
</script>

<style lang="scss" scoped>
.suite {
  font-size: 1.125rem;
}

.document-heading {
  margin-bottom: 2.5rem;
}

.details-list {
  @media screen and (min-width: $breakpoint-md) {
    display: flex;
  }
}

.details-left {
  flex: 0 1 290px;
  margin-right: 20px;
}

.details-group {
  display: flex;
  margin: 0 0 1rem 0;

  dt {
    font-weight: normal;
    margin-right: 0.25em;
  }

  dd {
    margin: 0;
  }
}
</style>
