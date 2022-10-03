<template>
  <div>
    <Alert v-if="showCompleteDIPAlert" variant="warning" class="mb-3">
      To continue you need to complete the ‘Decision in principle’ application
      form.
    </Alert>
    <Alert v-if="showCompleteDAAlert" variant="warning" class="mb-5">
      To continue you need to complete the ‘Detailed Application’ form.
    </Alert>
    <Alert v-if="showIFAAcceptedAlert" variant="success" class="mb-5">
      You're chosen IFA has accepted your application! You can choose to
      authorise their access below.
    </Alert>
    <Alert v-if="showIFAAuthorisedAlert" variant="success" class="mb-5">
      Your chosen IFA has been authorised!
      {{ selectedCase.appointedIFA[0].FullName }} will complete your Detailed
      Application on your behalf.
    </Alert>
    <template v-for="(c, k) in cases">
      <Alert
        v-if="
          selectedCase &&
          c.ifaStatus === 'AuthorisedByCustomer' &&
          c.type === 'IFA' &&
          c.id === selectedCase.id
        "
        :key="k"
        variant="success"
        class="mb-5"
      >
        You have been authorised by {{ c.clientDetails.fullName }} to complete
        their Detailed Application.
      </Alert>
      <Alert
        v-if="
          selectedCase &&
          c.ifaStatus === 'AppointedByCustomer' &&
          c.type === 'IFA' &&
          c.id === selectedCase.id
        "
        :key="k"
        variant="success"
        class="mb-5"
      >
        You have been appointed by {{ c.clientDetails.fullName }} to complete
        their Detailed Application.
      </Alert>
    </template>
    <template v-if="!selectedCase">
      <template v-if="casesLoading">
        <div class="cases-loading-wrapper">
          <img class="loading-wheel" src="/loadingwheel3.gif" />
        </div>
      </template>
      <template v-else>
        <template v-if="!$route.query.data">
          <h3 class="font-weight-bold mb-3">Open cases</h3>
          <div v-if="OpenCases.length" class="case-table-wrapper">
            <b-table
              class="case-table mb-5"
              hover
              :items="OpenCases"
              :fields="caseFields"
              :tbody-tr-class="rowClass"
            >
              <template #cell(viewDetails)="data">
                <p
                  v-if="!ifasLoading"
                  class="link mb-0"
                  tabindex="1"
                  @click="viewCase(data.item.id)"
                  @keyup.enter="viewCase(data.item.id)"
                >
                  View details
                </p>
                <b-spinner v-else label="Spinning"></b-spinner>
              </template>
            </b-table>
          </div>
          <p v-else>No cases to display</p>
        </template>

        <template v-else>
          <h3 class="font-weight-bold mb-3">Open client cases</h3>
          <div class="case-table-wrapper">
            <b-table
              v-if="OpenClientCases.length"
              :key="ifaDeclineKey"
              class="case-table mb-5"
              hover
              :items="OpenClientCases"
              :fields="clientCaseFields"
              :tbody-tr-class="rowClass"
            >
              <template #cell(viewDetails)="data">
                <p
                  class="link mb-0"
                  tabindex="1"
                  @click="viewCase(data.item.id)"
                  @keyup.enter="viewCase(data.item.id)"
                >
                  View details
                </p>
              </template>
            </b-table>
            <p v-else>No records to display</p>
          </div>
        </template>

        <template v-if="ClosedCasesGroupedBySite.length">
          <h3 class="font-weight-bold mb-3">Closed cases</h3>
          <div
            v-for="(item, index) in ClosedCasesGroupedBySite"
            :key="index"
            class="case-table"
          >
            <p class="font-weight-bold">Site: {{ item.site }}</p>
            <div class="case-table-wrapper">
              <b-table
                class="mb-5"
                hover
                :items="item.cases"
                :fields="caseFields"
              >
                <template #cell(viewDetails)="data">
                  <p
                    class="link mb-0"
                    tabindex="1"
                    @click="viewCase(data.item.id)"
                    @keyup.enter="viewCase(data.item.id)"
                  >
                    View details
                  </p>
                </template>
              </b-table>
            </div>
          </div>
        </template>
      </template>
    </template>

    <template v-else>
      <h3 class="font-weight-bold mb-5">{{ selectedCase.name }}</h3>
      <div v-if="selectedCase.linkedEntities.length" class="case-table">
        <b-table
          v-if="
            ['AuthorisedByCustomer', 'NotApplicable'].includes(
              selectedCase.ifaStatus
            )
          "
          class="mb-5"
          hover
          :items="selectedCase.linkedEntities"
          :fields="linkedEntityFields"
          :tbody-tr-class="rowClass"
        >
          <template #cell(viewForm)="data">
            <p
              class="link mb-0"
              tabindex="1"
              @click="
                viewForm(
                  selectedCase.ref,
                  data.item.formName,
                  data.item.readOnly
                )
              "
              @keyup.enter="
                viewForm(
                  selectedCase.ref,
                  data.item.formName,
                  data.item.readOnly
                )
              "
            >
              View form
            </p>
          </template>
        </b-table>
        <div v-else class="mb-5">
          <div
            v-if="
              selectedCase.type === 'IFA' &&
              selectedCase.ifaStatus === 'AcceptedByIfa'
            "
          >
            <Alert variant="success"
              >You have requested access. The customer will need to approve you
              to view their Detailed Application. We'll let you know when they
              have done this.</Alert
            >
          </div>
          <div
            v-else-if="
              selectedCase.type !== 'IFA' &&
              selectedCase.ifaStatus === 'AcceptedByIfa'
            "
          >
            <p>
              Your chosen Mortgage Advisor has requested access to your case.
              Give IFA access?
            </p>
            <b-table-simple responsive>
              <b-thead>
                <b-tr>
                  <b-th>IFA Full Name</b-th>
                  <b-th>Company Name</b-th>
                  <b-th>FCA Number</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr>
                  <b-td>{{ selectedCase.appointedIFA[0].FullName }}</b-td>
                  <b-td>{{ selectedCase.appointedIFA[0].CompanyName }}</b-td>
                  <b-td>{{ selectedCase.appointedIFA[0].IfaNumber }}</b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
            <b-button
              variant="primary"
              :disabled="requestInProgress"
              @click="
                updateIFAStatus(
                  selectedCase.ref,
                  selectedCase.appointedIFA[0].email,
                  'AuthorisedByCustomer'
                )
              "
            >
              YES CONTINUE
              <b-spinner
                v-if="authorisedByCustomerLoading"
                small
                class="ml-2 mb-1"
              />
            </b-button>
            <b-button
              variant="outline-danger"
              :disabled="requestInProgress"
              @click="showCustomerDeclineModal = true"
            >
              NO DECLINE
            </b-button>
            <b-modal
              v-model="showCustomerDeclineModal"
              :selected-advisor="selectedAdvisor"
              centered
              hide-header-close
              no-close-on-backdrop
              title="Are you sure you want to decline and remove this mortgage advisor from your case?"
            >
              <template #modal-footer="{ cancel }">
                <div>
                  <b-spinner v-if="loading" label="Spinning"></b-spinner>
                  <div v-else>
                    <b-button
                      variant="outline-primary"
                      :disabled="requestInProgress"
                      @click="cancel()"
                    >
                      NO CANCEL
                    </b-button>
                    <b-button
                      variant="outline-danger"
                      :disabled="requestInProgress"
                      @click="
                        updateIFAStatus(
                          selectedCase.ref,
                          selectedCase.appointedIFA[0].email,
                          'Declined'
                        )
                      "
                    >
                      YES CONTINUE
                      <b-spinner
                        v-if="ifaDeclineLoading"
                        small
                        class="ml-2 mb-1"
                      />
                    </b-button>
                  </div>
                </div>
              </template>
            </b-modal>
          </div>
          <div
            v-else-if="
              selectedCase.type !== 'IFA' &&
              selectedCase.ifaStatus === 'AppointedByCustomer'
            "
          >
            <Alert variant="success"
              >You have appointed your IFA. They will need to accept the case
              and will request access soon. We'll let you know when they have
              done this.</Alert
            >
          </div>
          <div v-else>
            <p>
              You have been appointed by
              <b>{{ selectedCase.clientDetails.fullName }}</b
              >. Do you want to request access to this Detailed Application?
            </p>
            <b-button
              variant="primary"
              :disabled="requestInProgress"
              @click="
                updateIFAStatus(
                  selectedCase.ref,
                  AccountData.Email,
                  'AcceptedByIfa'
                )
              "
            >
              YES REQUEST
              <b-spinner v-if="acceptedByIfaLoading" small class="ml-2 mb-1" />
            </b-button>
            <b-button
              variant="outline-danger"
              :disabled="requestInProgress"
              @click="showIFADeclineModal = true"
              >NO DECLINE</b-button
            >
          </div>

          <b-modal
            v-model="showIFADeclineModal"
            :selected-advisor="selectedAdvisor"
            centered
            hide-header-close
            no-close-on-backdrop
            title="Confirm you would like to decline case"
          >
            <p>
              {{
                loading
                  ? "Updating application..."
                  : selectedCase.ifaStatus === "AcceptedByIfa" &&
                    selectedCase.type === "IFA"
                  ? "Are you sure you want to decline and delete this case?"
                  : selectedCase.ifaStatus === "AcceptedByIfa" &&
                    selectedCase.type !== "IFA"
                  ? "Are you sure want to decline and remove this IFA from your case?"
                  : ""
              }}
            </p>
            <template #modal-footer="{ cancel }">
              <div>
                <b-spinner v-if="loading" label="Spinning"></b-spinner>
                <div v-else>
                  <b-button
                    variant="outline-primary"
                    :disabled="requestInProgress"
                    @click="cancel()"
                  >
                    NO CANCEL
                  </b-button>
                  <b-button
                    variant="outline-danger"
                    :disabled="requestInProgress"
                    @click="
                      updateIFAStatus(
                        selectedCase.ref,
                        AccountData.Email,
                        'Declined'
                      )
                    "
                  >
                    YES CONTINUE
                    <b-spinner
                      v-if="ifaDeclineLoading"
                      small
                      class="ml-2 mb-1"
                    />
                  </b-button>
                </div>
              </div>
            </template>
          </b-modal>
        </div>
        <template
          v-if="showIFASelector && selectedCase.type === 'Main Applicant'"
        >
          <div>
            <b-alert show variant="info" class="mb-5"
              >We highly recommend you seek professional financial support
              during this process. Please use the form below to search and
              select an Independent Financial Advisor to help you with your
              application.</b-alert
            >
            <h3>Search for IFA</h3>
            <b-form-group
              class="mb-3"
              description="Please enter the name of the IFA company"
            >
              <b-form-invalid-feedback
                id="fcaNumber-feedback"
                :state="validateState('ifaName')"
                class="error mb-1"
              >
                Please provide a valid IFA company name
              </b-form-invalid-feedback>
              <b-form-input
                id="fcaNumber"
                v-model="$v.ifaName.$model"
                :state="validateState('ifaName')"
                class="form-input text-uppercase"
                type="text"
              />
            </b-form-group>
            <div class="mb-5 d-flex align-items-center">
              <b-button
                v-if="!lookupInProgress"
                variant="primary"
                :disabled="!$v.ifaName.$model"
                class="mr-3"
                @click="fetchIFA"
              >
                Search for companies
              </b-button>
            </div>
            <div
              v-if="lookupInProgress"
              class="
                mb-5
                d-flex
                align-items-center
                justify-content-center
                w-100
              "
            >
              <img class="spinner lookup-spinner" src="/loadingwheel3.gif" />
            </div>
            <template v-if="lookupFound == true && !lookupInProgress">
              <b-table
                class="mb-5"
                hover
                :items="responseArray"
                :fields="mortgageAdvisorFields"
                :tbody-tr-class="rowClass"
              >
                <template #cell(selectMA)="data">
                  <p
                    class="link mb-0"
                    tabindex="1"
                    @click="
                      selectMA(
                        data.item.ifaNo,
                        data.item.mortgageAdvisorName,
                        data.item.mortgageAdvisorEmail,
                        selectedCase.ref
                      )
                    "
                    @keyup.enter="
                      selectMA(
                        data.item.ifaNo,
                        data.item.mortgageAdvisorName,
                        data.item.mortgageAdvisorEmail,
                        selectedCase.ref
                      )
                    "
                  >
                    Select
                  </p>
                </template>
              </b-table>

              <b-modal
                v-model="showAppointIFAModal"
                :selected-advisor="selectedAdvisor"
                centered
                hide-header-close
                no-close-on-backdrop
                title="Confirm appointed Mortgage Advisor"
              >
                <p>
                  Are you sure you want to appoint
                  <b>{{ selectedAdvisor && selectedAdvisor.name }}</b> as your
                  Mortgage Advisor
                </p>
                <template #modal-footer="{ cancel }">
                  <b-button
                    variant="outline-primary"
                    :disabled="requestInProgress"
                    @click="cancel()"
                  >
                    NO CANCEL
                  </b-button>
                  <b-button
                    variant="primary"
                    :disabled="requestInProgress"
                    @click="postIFA('AppointedByCustomer')"
                  >
                    YES CONTINUE
                    <b-spinner v-if="postIFALoading" small class="ml-2 mb-1" />
                  </b-button>
                </template>
              </b-modal>
            </template>
            <Alert
              v-if="lookupFound == false && !lookupInProgress"
              variant="danger"
              >The company, <i>{{ ifaNameCopy }}</i> of the Mortgage Advisor you
              have searched for is not in our records. Please contact SBW to
              have their company information added to our systems.</Alert
            >
            <Alert variant="warning" class="mb-5">
              <p class="mb-0">
                IF YOU WANT TO COMPLETE YOUR DETAILED APPLICATION FORM WITHOUT
                THE SUPPORT OF A MORTGAGE ADVISOR, PLEASE CONTACT THE SBW TEAM
                ON xxxxxx xxxxxx
              </p>
            </Alert>
          </div>
        </template>
      </div>
      <div v-else class="mb-5">No forms yet...</div>

      <b-button
        variant="outline-primary"
        :disabled="acceptedByIfaLoading || authorisedByCustomerLoading"
        @click="goBackToCaseList"
      >
        Return to case list
      </b-button>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { requiredIf, required, minLength } from "vuelidate/lib/validators";
import { formatDate } from "~/lib/globalFunctions";
Vue.use(Vuelidate);

export default {
  layout: "user-account-area",
  data() {
    return {
      requestInProgress: false,
      ifaName: "",
      ifaDetails: {},
      ifaNameCopy: "",
      ifaJourney: false,
      loading: false,
      ifasLoading: false,
      postIFALoading: false,
      authorisedByCustomerLoading: false,
      acceptedByIfaLoading: false,
      ifaDeclineLoading: false,
      showAppointIFAModal: false,
      showCustomerDeclineModal: false,
      showIFADeclineModal: false,
      ifaDeclineKey: 0,
      selectedAdvisor: null,
      casesLoading: true,
      cases: [],
      selectedCase: this.$store.state.Global.SelectedCase || null,
      showCompleteDIPAlert: false,
      showCompleteDAAlert: false,
      showIFAAcceptedAlert: false,
      showIFAAuthorisedAlert: false,
      showIFASelector: false,
      lookupInProgress: false,
      lookupFound: null,
      responseArray: [],
      assignedIFAFields: [
        { key: "FullName", label: "IFA Full Name" },
        { key: "CompanyName", label: "Company Name" },
        { key: "IfaNumber", label: "FCA Number" },
      ],
      clientCaseFields: [
        { key: "clientDetails.fullName", label: "Client name" },
        { key: "ref", label: "Case reference" },
        { key: "viewDetails", label: "" },
      ],
      caseFields: [
        { key: "type", label: "Case type" },
        { key: "name", label: "Case name" },
        { key: "dateCreated", label: "Date created" },
        { key: "viewDetails", label: "" },
      ],
      linkedEntityFields: [
        { key: "formName", label: "Form name" },
        { key: "status", label: "Status" },
        { key: "viewForm", label: "" },
      ],
      openCaseStatuses: [
        "InProgress",
        "OnHold",
        "WaitingForDetails",
        "Researching",
      ],
      closedCaseStatuses: ["ProblemSolved", "Cancelled", "Merged"],
      mortgageAdvisorFields: [
        { key: "mortgageAdvisorName", label: "Name", tdClass: "small" },
        { key: "mortgageCompanyName", label: "Company", tdClass: "small" },
        { key: "mortgageCompanyAddress", label: "Address", tdClass: "small" },
        { key: "telephoneNumber", label: "Telephone", tdClass: "small" },
        { key: "selectMA", label: "" },
      ],
    };
  },
  computed: {
    ApiOptions: {
      get() {
        return this.$store.getters["Global/ApiOptions"];
      },
    },
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
      },
    },
    OpenCases: {
      get() {
        return this.cases.filter(
          (c) => this.openCaseStatuses.includes(c.status) && c.type !== "IFA"
        );
      },
    },
    OpenClientCases: {
      get() {
        return this.cases.filter(
          (c) =>
            this.openCaseStatuses.includes(c.status) &&
            c.type === "IFA" &&
            c.ifaStatus !== "Declined"
        );
      },
    },
    ClosedCasesGroupedBySite: {
      get() {
        const closedCases = this.cases.filter((c) =>
          this.closedCaseStatuses.includes(c.status)
        );
        const closedCasesGroupedBySite = [];
        closedCases.forEach((cc) => {
          // if group already exists add item to group, else create group then add item
          const groupMatch = closedCasesGroupedBySite.find(
            (group) => group.site === cc.site
          );
          if (groupMatch) groupMatch.cases.push(cc);
          else
            closedCasesGroupedBySite.push({
              site: cc.site,
              cases: [cc],
            });
        });
        return closedCasesGroupedBySite;
      },
    },
  },
  created() {
    this.$nuxt.$on("takeUserToDefaultHomeScreen", () => {
      this.selectedCase = null;
      this.$store.commit("Global/resetSelectedCase");
    });
  },
  mounted() {
    this.getApplications();
  },
  methods: {
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.highlighted) return "highlighted";
    },
    getApplications() {
      this.$userAccountApplicationsGetService
        .$get("", { params: { email: this.AccountData.Email } })
        .then((response) => {
          response && response != null && response.LinkedCases.forEach((lc) => {
            let highlightedCase = false;
            const mainApplicant = {};
            const m = lc.LinkedCase.MainApplicant;
            // reformat type
            let type = "Main Applicant";
            if (lc.Type === "CoApplicant") type = "Co Applicant";
            // check the user type is Ifa
            if (lc.Type === "Ifa") {
              this.$store.commit("Global/setIFAAccount", { IFA: true });
              this.ifaJourney = true;
              this.showCompleteDAAlert = false;
              type = "IFA";
            }

            // handle mainApplicant details if the user is an IFA
            // The mainApplicant data in the case only comes through if the users
            // email is associated with an IFA company
            if (m && lc.Type === "Ifa") {
              mainApplicant.emailAddress = lc.LinkedCase.MainApplicant.Email;
              mainApplicant.fullName = lc.LinkedCase.MainApplicant.FullName;
              mainApplicant.id = lc.LinkedCase.MainApplicant.Id;
              mainApplicant.type = lc.Type;
            }

            // reformat linked entities
            const unorderedLinkedEntities = [];
            lc.LinkedEntities.forEach((le, i) => {
              // highlight case if DIP in progress
              let highlightedForm = false;
              if (
                le.LinkedRecordType === "dbw_decisioninprinciple" &&
                !le.Submitted
              ) {
                highlightedCase = true;
                highlightedForm = true;
              }

              if (
                le.LinkedRecordType ===
                  "dbw_selfbuilddetailedplotapplication" &&
                !le.Submitted
              ) {
                highlightedCase = true;
                highlightedForm = true;
              }

              // reformat form name
              let formName;
              if (le.LinkedRecordType === "dbw_plotapplication")
                formName = "Plot Application";
              if (le.LinkedRecordType === "dbw_decisioninprinciple")
                formName = "Decision In Principle";
              if (
                le.LinkedRecordType === "dbw_selfbuilddetailedplotapplication"
              ) {
                formName = "Detailed Application";
              }
              // reformat status
              let status;
              if (le.Submitted) status = "Submitted";
              else status = "Active";
              // add linked entity to linked entities array
              if (
                type === "Main Applicant" ||
                formName === "Detailed Application"
              ) {
                unorderedLinkedEntities.push({
                  formName,
                  status,
                  IfaNotRequired: lc.IfaNotRequired,
                  highlighted: highlightedForm,
                  readOnly: le.Locked,
                });
              }
            });
            // re-order linked entities
            const linkedEntities = [];
            const PA = unorderedLinkedEntities.find(
              (ule) => ule.formName === "Plot Application"
            );
            const DIP = unorderedLinkedEntities.find(
              (ule) => ule.formName === "Decision In Principle"
            );
            const DA = unorderedLinkedEntities.find(
              (ule) => ule.formName === "Detailed Application"
            );
            if (PA) linkedEntities.push(PA);
            if (DIP) linkedEntities.push(DIP);
            if (DA) linkedEntities.push(DA);
            const site = lc.LinkedCase.CaseTitle.split(/[-]/)[0].slice(6);

            const appointedData = {};
            if (
              ["MainApplicant"].includes(lc.Type) &&
              lc.IfaStatus !== "NotApplicable"
            ) {
              this.ifasLoading = true;

              this.$getIFAByCaseRef
                .$get("", { params: { appRef: lc.LinkedCase.CaseReference } })
                .then((response) => {
                  (appointedData.FullName =
                    response.Ifas[0].FirstName +
                    " " +
                    response.Ifas[0].LastName),
                    (appointedData.CompanyName = response.CompanyName),
                    (appointedData.FcaNumber = response.FcaNumber),
                    (appointedData.Address = response.Address),
                    (appointedData.CompanyName = response.CompanyName),
                    (appointedData.CreatedOn = response.CreatedOn),
                    (appointedData.FcaNumber = response.FcaNumber),
                    (appointedData.Id = response.Id),
                    (appointedData.email = response.Ifas[0].Email),
                    (appointedData.Ifas = response.Ifas),
                    (appointedData.IfaNumber = response.Ifas[0].IfaNumber),
                    (appointedData.IsDirty = response.IsDirty),
                    (appointedData.TelephoneNumber = response.TelephoneNumber),
                    (appointedData.WebSiteUrl = response.WebSiteUrl);

                  this.ifasLoading = false;
                })
                .catch((error) => {
                  this.ifasLoading = false;
                  console.log(["error getCaseIFA: ", error]);
                });
            }

            // > 2 = DA
            // > 1 = DIP
            // else PA stage
            const checkStatus = () =>
              linkedEntities.length > 2
                ? "DA"
                : linkedEntities.length > 1
                ? "DIP"
                : "PA";

            // add linked case to cases array
            this.cases.push({
              appointedIFA: [appointedData],
              clientDetails: mainApplicant && mainApplicant,
              ref: lc.LinkedCase.CaseReference,
              id: lc.Id,
              name: lc.LinkedCase.CaseTitle,
              site,
              type,
              status: lc.LinkedCase.StatusReason,
              dateCreated: formatDate(lc.LinkedCase.CreatedOn),
              linkedEntities,
              applicationStage: checkStatus(),
              ifaStatus: lc.IfaStatus,
              highlighted: highlightedCase,
              ifaNotRequired: lc.IfaNotRequired,
            });
          });

          this.$root.$emit("userTypeUpdated", this.ifaJourney);

          // if case saved in store, navigate to updated case
          if (this.selectedCase) {
            const updatedCase = this.cases.find(
              (c) => c.id === this.selectedCase.id
            );
            if (updatedCase) this.selectedCase = updatedCase;
            this.handleAlerts();
          }

          this.casesLoading = false;
        });
    },
    closeAlerts() {
      this.showCompleteDIPAlert = false;
      this.showCompleteDAAlert = false;
      this.showIFAAcceptedAlert = false;
      this.showIFAAuthorisedAlert = false;
    },
    handleAlerts() {
      this.showIFASelector = false;
      this.closeAlerts();
      if (
        this.selectedCase.status === "InProgress" &&
        this.selectedCase.type === "Main Applicant"
      ) {
        if (this.selectedCase.applicationStage === "DIP") {
          // DIP
          const status = this.selectedCase.linkedEntities.find(
            (le) => le.formName === "Decision In Principle"
          ).status;
          if (status === "Active") this.showCompleteDIPAlert = true;
        } else if (this.selectedCase.applicationStage === "DA") {
          // DA
          const status = this.selectedCase.linkedEntities.find(
            (le) => le.formName === "Detailed Application"
          ).status;
          if (status === "Active") {
            if (this.selectedCase.ifaNotRequired === "True") {
              // IFA not required
              this.showCompleteDAAlert = true;
            } else if (this.selectedCase.ifaNotRequired === "False") {
              // IFA required
              if (this.selectedCase.ifaStatus === "AcceptedByIfa") {
                // IFA accepted
                this.showIFAAcceptedAlert = true;
              } else if (
                this.selectedCase.ifaStatus === "AuthorisedByCustomer"
              ) {
                // IFA authorised
                this.showIFAAuthorisedAlert = true;
              } else if (
                this.selectedCase.ifaStatus === "Declined" ||
                this.selectedCase.ifaStatus === "NotApplicable"
              ) {
                // show IFA selector
                this.showIFASelector = true;
              }
            }
          }
        }
      }
    },
    viewCase(id) {
      this.selectedCase = this.cases.find((c) => c.id === id);
      this.$store.commit("Global/setSelectedCase", this.selectedCase);
      this.handleAlerts();
    },
    viewForm(caseRef, form, readOnly) {
      // redirect user to form
      if (form === "Plot Application") {
        this.$store.commit("Global/setReadOnlyPA", readOnly);
        this.$store.commit("Global/setApiParams", { appref: caseRef });
        this.$plotApplicationGetService
          .$get("", this.ApiOptions)
          .then((response) => {
            this.$store.commit(
              "PlotApplication/setPlotApplicationData",
              response
            );
            this.$router.push(`/self-build-wales/plot-application/page-1`);
          });
      } else if (form === "Decision In Principle") {
        this.$store.commit("Global/setApiParams", { appref: caseRef });
        this.$store.commit("Global/setReadOnlyDIP", readOnly);
        if (!readOnly) {
          this.$router.push("/self-build-wales/decision-in-principle/page-1");
        } else {
          this.$dipGetService.$get("", this.ApiOptions).then((response) => {
            this.$store.commit("DecisionInPrinciple/setDIPData", response);
            this.$router.push("/self-build-wales/decision-in-principle/page-2");
          });
        }
      } else if (form === "Detailed Application") {
        this.$store.commit("Global/setApiParams", { appref: caseRef });
        this.$store.commit("Global/setReadOnlyDA", readOnly);
        if (!readOnly) {
          this.$router.push("/self-build-wales/detailed-application/page-1");
        } else {
          this.$detailedApplicationGetService
            .$get("", this.ApiOptions)
            .then((response) => {
              this.$store.commit(
                "DetailedApplication/setDetailedApplicationData",
                response
              );
              this.$router.push(
                `/self-build-wales/detailed-application/page-2`
              );
            });
        }
      }
    },
    goBackToCaseList() {
      this.selectedCase = null;
      this.$store.commit("Global/resetSelectedCase");
      this.closeAlerts();
    },
    selectMA(IFANo, IFAName, IFAEmail, AppRef) {
      this.selectedAdvisor = {
        ifaNo: IFANo,
        name: IFAName,
        email: IFAEmail,
        appRef: AppRef,
      };
      this.showAppointIFAModal = true;
    },
    fetchIFA() {
      this.responseArray = [];
      this.lookupInProgress = true;
      this.error = false;
      this.ifaNameCopy = this.ifaName;

      this.$getIFAcompaniesService
        .$get("", { params: { companyName: this.ifaName.trim() } })
        .then((response) => {
          if (response.length > 0) {
            this.lookupInProgress = false;
            this.lookupFound = true;
            const vm = this;
            // Array of companies returned
            response.map((res) => {
              // IFAS returns in array but everything else is at base of request
              const companyName = res.CompanyName;
              const address = res.Address;
              const address2 = address.Address2 || "";
              const address3 = address.Address3 || "";
              const telephoneNumber = res.TelephoneNumber || "";

              res.Ifas.forEach(function (ifa) {
                const responseObject = {
                  mortgageAdvisorName: ifa.FirstName + " " + ifa.LastName,
                  mortgageCompanyName: companyName,
                  ifaNo: ifa.IfaNumber,
                  telephoneNumber,
                  mortgageCompanyAddress: `
                    ${address.Address1 && address.Address1 + ","}
                    ${address2 && address2 + ","}
                    ${address3 && address3 + ","}
                    ${address.City && address.City + ","}
                    ${address.PostCode && address.PostCode}
                  `,
                  mortgageAdvisorEmail: ifa.Email,
                };
                vm.responseArray.push(responseObject);
              });
            });
          } else {
            this.lookupInProgress = false;
            this.lookupFound = false;
            this.$nextTick(() => {
              this.$v.$reset();
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.lookupInProgress = false;
          this.lookupFound = false;
          this.$nextTick(() => {
            this.$v.$reset();
          });
        });
    },
    refresh() {
      setTimeout(() => {
        this.$router.go();
      }, 100);
    },
    updateIFAStatus(AppRef, ifaEmail, ifaStatus) {
      this.requestInProgress = true;
      // this.loading = true;
      if (ifaStatus === "AuthorisedByCustomer")
        this.authorisedByCustomerLoading = true;
      if (ifaStatus === "AcceptedByIfa") this.acceptedByIfaLoading = true;
      if (ifaStatus === "Declined") this.ifaDeclineLoading = true;

      this.$updateIFAStatusService
        .$post("", null, {
          params: { appRef: AppRef, email: ifaEmail, status: ifaStatus },
        })
        .then((response) => {
          console.log("updateIFAStatus success: ", response);

          if (ifaStatus === "AcceptedByIfa") {
            this.selectedCase.ifaStatus = ifaStatus;
            this.acceptedByIfaLoading = false;
            this.refresh();
          }

          if (ifaStatus === "AuthorisedByCustomer") {
            this.selectedCase.ifaStatus = ifaStatus;
            this.authorisedByCustomerLoading = false;
            this.refresh();
          }

          if (ifaStatus === "Declined") {
            this.selectedCase.ifaStatus = ifaStatus;
            this.selectedCase = null;
            this.$store.commit("Global/resetSelectedCase");
            this.$router.push({ query: {} });
            this.ifaDeclineLoading = false;
            this.refresh();
          }

          this.showIFADeclineModal = false;
          this.requestInProgress = false;
        })
        .catch((err) => {
          console.log("updateIFAStatus error: ", err);
          this.requestInProgress = false;
          this.authorisedByCustomerLoading = false;
          this.acceptedByIfaLoading = false;
          this.ifaDeclineLoading = false;
        });
    },
    postIFA(ifaStatus) {
      this.requestInProgress = true;
      this.postIFALoading = true;
      this.$assignIFAService
        .$post("", null, {
          params: {
            email: this.selectedAdvisor.email,
            appRef: this.selectedAdvisor.appRef,
          },
        })
        .then(() => {
          this.postIFALoading = false;
          this.showAppointIFAModal = false;
          this.showIFASelector = false;
          this.ifaNotRequired = true;
          this.showIFANotification = false;
          this.requestInProgress = false;
          this.selectedCase.ifaStatus = ifaStatus;
        })
        .catch((err) => {
          console.log("link MA to case error: ", err);
          this.postIFALoading = false;
          this.showAppointIFAModal = false;
          this.requestInProgress = false;
        });
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    scrollIntoView(id) {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    },
  },
  validations() {
    return {
      ifaName: {
        required,
        minLength: minLength(4),
      },
      lookupCorrect: {
        required: requiredIf(function () {
          return this.lookupFound === true;
        }),
        isChecked(value) {
          if (this.lookupFound === true) {
            if (value === "accepted") return true;
            else return false;
          } else {
            return true;
          }
        },
      },
    };
  },
};
</script>

<style lang="scss">
.lookup-spinner {
  max-width: 80px;
}

.case-table-wrapper {
  overflow-x: scroll;
  max-width: calc(100vw - 30px);
}
.case-table {
  //background-color: $dbw-table-grey;
}
.highlighted {
  background-color: $dbw-background-green;
}
.link {
  color: $primary;
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
}
.table {
  tbody > tr > td {
    border-top: none;
  }
  thead > tr > th > div {
    white-space: nowrap;
  }
}
.cases-loading-wrapper {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
