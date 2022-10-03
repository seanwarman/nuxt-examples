import SearchResultCard from '../components/SearchResultCard.vue'
import DisciplineCard from '../components/DisciplineCard.vue'
import ResourceCard from '../components/ResourceCard.vue'

export default {
  title: 'Cards',
}

export const generalResultCard = () => ({
  components: { SearchResultCard },
  data() {
    return {
      title: 'Technical Approval of Highway Structures',
      documentLink: '#',
      discipline: 'Drainage',
      lifecycleStage: 'Appraisal',
      revision: '2.8',
      from: 'DMRB',
      issued: 'May 2008',
      formerly: [
        {
          title: 'ABC-123',
          documentLink: '#',
        },
        {
          title: 'DEF-456',
          documentLink: '#',
        },
        {
          title: 'ZYW-987',
          documentLink: '#',
        },
      ],
    }
  },
  template: `
    <SearchResultCard 
      :title="title"
      :document-link="documentLink"
      :discipline="discipline"
      :lifecycleStage="lifecycleStage"
      :revision="revision"
      :from="from"
      :issued="issued"
      :formerly="formerly"
    />
  `,
})

export const latestUpdateCard = () => ({
  components: { SearchResultCard },
  template: `<SearchResultCard title="Design of Road Lighting for the Strategic Motorway and All Purpose Trunk Road Network" document-link="#" notes="The public notes would go here. These will inform the reader of what has been changed in the document." />`,
})

export const archiveResultCard = () => ({
  components: { SearchResultCard },
  data() {
    return {
      withdrawn: 'Dec 2019',
      title:
        'Appraisal of New and Replacement Lighting on the Strategic Motorway and All Purpose Trunk Road Network',
      documentLink: '#',
      discipline: 'Road Layout',
      lifecycleStage: 'Maintenance & Operation',
      revision: '7',
      from: 'DMRB',
      issued: 'June 2017',
      supersededBy: [
        {
          title: 'JKL-852',
          documentLink: '#',
        },
        {
          title: 'PQR-654',
          documentLink: '#',
        },
      ],
    }
  },
  template: `
    <SearchResultCard 
      :title="title"
      :document-link="documentLink"
      :discipline="discipline"
      :lifecycleStage="lifecycleStage"
      :revision="revision"
      :from="from"
      :issued="issued"
      :supersededBy="supersededBy"
      :withdrawn="withdrawn"
    />
  `,
})

export const disciplineCard = () => ({
  components: { DisciplineCard },
  template: `
    <DisciplineCard 
      title="Sustainability & Environment" 
      description="A lovely descriptive sentance explaining the the subject matter and sub-categories within this discipline."
      to="/sustainability"
      >
        <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="envira"
        class="svg-inline--fa fa-envira fa-w-14"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
      >
        <path
          fill="currentColor"
          d="M0 32c477.6 0 366.6 317.3 367.1 366.3L448 480h-26l-70.4-71.2c-39 4.2-124.4 34.5-214.4-37C47 300.3 52 214.7 0 32zm79.7 46c-49.7-23.5-5.2 9.2-5.2 9.2 45.2 31.2 66 73.7 90.2 119.9 31.5 60.2 79 139.7 144.2 167.7 65 28 34.2 12.5 6-8.5-28.2-21.2-68.2-87-91-130.2-31.7-60-61-118.6-144.2-158.1z"
        ></path>
      </svg>
    </DisciplineCard>
  `,
})

export const resourceCard = () => ({
  components: { ResourceCard },
  template: `
    <ResourceCard to="/" title="Document updates" :notification="true" updated-content="A new publication is available">
      <svg
        width="48"
        height="51"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g 
          transform="translate(0 1)"
          fill="none"
          fill-rule="evenodd"
        >
          <path d="M0 0h48v48.125H0z"/>
          <g stroke-linejoin="square">
            <rect 
              stroke="#FFF"
              stroke-width="3.285"
              fill="#EEE"
              x="1.643"
              y="10.666"
              width="32.715"
              height="35.817"
              rx="3.285"
            />
            <rect 
              stroke="#222"
              stroke-width="1.643"
              x=".821"
              y="9.845"
              width="34.358"
              height="37.459"
              rx="3.285"
            />
          </g>
          <path
            d="M36 20.303V9.023H24.75c0 6.23 5.037 11.28 11.25 11.28z"
            fill="#FFF"
          />
          <ellipse
            fill="currentColor"
            cx="36"
            cy="9.023"
            rx="9"
            ry="9.023"
          />
          <path
            d="M25.148 28.02a.352.352 0 0 0 .352-.352v-5.885a.352.352 0 0 0-.352-.352h-1.387a.352.352 0 0 0-.352.352v.017l.118 2.431A7.219 7.219 0 0 0 18 21.661c-.002 0-.003.005-.006.005-3.548 0-6.502 2.553-7.135 5.928a.352.352 0 0 0 .346.417h1.437a.352.352 0 0 0 .342-.273 5.161 5.161 0 0 1 5.01-3.954c1.782 0 3.351.901 4.277 2.282l-2.973-.143h-.017a.352.352 0 0 0-.346.289l-.005.063v1.393c0 .195.158.353.352.353h5.865zM12.24 36.47a.352.352 0 0 0 .352-.353V36.1l-.122-2.426a7.219 7.219 0 0 0 5.521 2.565c.002 0 .003-.004.005-.004 3.548 0 6.502-2.553 7.135-5.928a.352.352 0 0 0-.346-.417h-1.436a.352.352 0 0 0-.342.272 5.16 5.16 0 0 1-5.01 3.955l-.001.003h-.004a5.128 5.128 0 0 1-4.273-2.285l2.982.143h.017a.352.352 0 0 0 .352-.352v-1.393a.352.352 0 0 0-.352-.353h-5.865a.352.352 0 0 0-.352.353v5.884c0 .195.158.353.352.353h1.387z"
            fill="#222"
            fill-rule="nonzero"
          />
        </g>
      </svg>
    </ResourceCard>
  `,
})
