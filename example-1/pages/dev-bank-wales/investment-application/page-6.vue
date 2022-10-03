<template>
  <b-container class="p-3 dbw">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-5">Other Significant People</h1>

      <div
        v-for="(person, index) in $v.people.$each.$iter"
        :key="`person-${index}`"
      >
        <h4 class="font-weight-bold mb-3">Person {{ Number(index) + 1 }}</h4>

        <p class="font-weight-bold mb-0">Name</p>
        <template v-if="person.$model.subType === 'Individual'">
          <p class="mb-3">
            {{ `${person.$model.firstName} ${person.$model.lastName}` }}
          </p>
        </template>
        <template v-else>
          <p class="mb-3">
            {{ person.$model.companyName }}
          </p>
        </template>

        <p class="font-weight-bold mb-2">Details</p>
        <div class="mb-5">
          <b-form-checkbox
            v-model="person.$model.isDirector"
            :disabled="ReadOnlyIA"
          >
            This person is a Director
          </b-form-checkbox>

          <b-form-checkbox
            v-model="person.$model.isNoLongerDirector"
            :disabled="ReadOnlyIA"
          >
            This person is no longer a Director
          </b-form-checkbox>

          <b-form-checkbox
            v-model="person.$model.isAuthorisedSignatory"
            :disabled="ReadOnlyIA"
          >
            This person is an authorised signatory
          </b-form-checkbox>

          <b-form-checkbox
            v-model="person.$model.isShareholderOver25Percent"
            :disabled="ReadOnlyIA"
          >
            This person is a shareholder of over 25%
          </b-form-checkbox>

          <b-form-checkbox
            v-model="person.$model.isNoLongerShareholderOver25Percent"
            :disabled="ReadOnlyIA"
          >
            This person is no longer a shareholder of over 25%
          </b-form-checkbox>

          <b-form-checkbox
            v-model="person.$model.isConnectedToShareholdersOver25Percent"
            :disabled="ReadOnlyIA"
            @change="noLongerConnected(person.$model.id)"
          >
            This person is connected to one or more other people who
            collectively own shares of over 25%
          </b-form-checkbox>
          <template v-if="person.$model.isConnectedToShareholdersOver25Percent">
            <div class="ml-5">
              <p class="font-weight-bold mb-2">
                To whom is this person connected?
              </p>
              <div class="mb-3">
                <b-form-checkbox-group
                  v-model="person.$model.connections"
                  :disabled="ReadOnlyIA"
                  stacked
                >
                  <b-form-checkbox
                    v-for="(
                      connection, connectionIndex
                    ) in findNewConnectionOptions(person.$model.id)"
                    :key="`connection-${connectionIndex}`"
                    :value="connection.id"
                    @change="
                      updateEffectedPeople(person.$model.id, connection.id)
                    "
                  >
                    <template v-if="connection.subType === 'Individual'">
                      {{ `${connection.firstName} ${connection.lastName}` }}
                    </template>
                    <template v-else>
                      {{ connection.companyName }}
                    </template>
                  </b-form-checkbox>
                </b-form-checkbox-group>
              </div>
              <div
                v-for="(newConnection, newConnectionIndex) in person.$model
                  .newConnections"
                :key="`new-connection-${newConnectionIndex}`"
                class="mb-3"
              >
                <p class="font-weight-bold mb-2">
                  New connection {{ Number(newConnectionIndex + 1) }}
                </p>

                <p class="mb-3">Type</p>
                <div class="mb-3">
                  <b-form-group id="type" ref="type" :disabled="ReadOnlyIA">
                    <b-form-radio
                      v-model="newConnection.subType"
                      value="Company"
                      @change="
                        resetNewConnection(person.$model.id, newConnection.id)
                      "
                    >
                      Company
                    </b-form-radio>
                    <b-form-radio
                      v-model="newConnection.subType"
                      value="Individual"
                      @change="
                        resetNewConnection(person.$model.id, newConnection.id)
                      "
                    >
                      Individual
                    </b-form-radio>
                  </b-form-group>
                </div>

                <template v-if="newConnection.subType === 'Individual'">
                  <p class="font-weight-bold mb-1">First name</p>
                  <div class="mb-3">
                    <b-form-invalid-feedback
                      :state="
                        validateNewConnectionItemState(
                          index,
                          newConnectionIndex,
                          'firstName'
                        )
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`people-${index}-newConnections-${newConnectionIndex}-firstName`"
                      v-model="newConnection.firstName"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateNewConnectionItemState(
                          index,
                          newConnectionIndex,
                          'firstName'
                        )
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>

                  <p class="font-weight-bold mb-1">Last name</p>
                  <div class="mb-3">
                    <b-form-invalid-feedback
                      :state="
                        validateNewConnectionItemState(
                          index,
                          newConnectionIndex,
                          'lastName'
                        )
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`people-${index}-newConnections-${newConnectionIndex}-lastName`"
                      v-model="newConnection.lastName"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateNewConnectionItemState(
                          index,
                          newConnectionIndex,
                          'lastName'
                        )
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>

                  <p class="font-weight-bold mb-1">Date of birth</p>
                  <b-form-invalid-feedback
                    :state="
                      validateNewConnectionItemState(
                        index,
                        newConnectionIndex,
                        'birthDay'
                      )
                    "
                    class="error mb-1"
                  >
                    Invalid day
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    :state="
                      validateNewConnectionItemState(
                        index,
                        newConnectionIndex,
                        'birthMonth'
                      )
                    "
                    class="error mb-1"
                  >
                    Invalid month
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    :state="
                      validateNewConnectionItemState(
                        index,
                        newConnectionIndex,
                        'birthYear'
                      )
                    "
                    class="error mb-1"
                  >
                    Invalid year
                  </b-form-invalid-feedback>
                  <b-row no-gutters class="mb-5">
                    <div class="date-field">
                      <p class="mb-1">Day</p>
                      <b-form-input
                        :id="`people-${index}-newConnections-${newConnectionIndex}-birthDay`"
                        v-model="newConnection.birthDay"
                        :disabled="ReadOnlyIA"
                        :state="
                          validateNewConnectionItemState(
                            index,
                            newConnectionIndex,
                            'birthDay'
                          )
                        "
                        type="number"
                        placeholder="dd"
                      />
                    </div>
                    <div class="date-field">
                      <p class="mb-1">Month</p>
                      <b-form-input
                        :id="`people-${index}-newConnections-${newConnectionIndex}-birthMonth`"
                        v-model="newConnection.birthMonth"
                        :disabled="ReadOnlyIA"
                        :state="
                          validateNewConnectionItemState(
                            index,
                            newConnectionIndex,
                            'birthMonth'
                          )
                        "
                        type="number"
                        placeholder="mm"
                      />
                    </div>
                    <div class="date-field year">
                      <p class="mb-1">Year</p>
                      <b-form-input
                        :id="`people-${index}-newConnections-${newConnectionIndex}-birthYear`"
                        v-model="newConnection.birthYear"
                        :disabled="ReadOnlyIA"
                        :state="
                          validateNewConnectionItemState(
                            index,
                            newConnectionIndex,
                            'birthYear'
                          )
                        "
                        type="number"
                        placeholder="yyyy"
                      />
                    </div>
                  </b-row>

                  <p class="font-weight-bold mb-0">Email address</p>
                  <div class="mb-5">
                    <b-form-invalid-feedback
                      :state="
                        validateNewConnectionItemState(
                          index,
                          newConnectionIndex,
                          'email'
                        )
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`people-${index}-newConnections-${newConnectionIndex}-email`"
                      v-model="newConnection.email"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateNewConnectionItemState(
                          index,
                          newConnectionIndex,
                          'email'
                        )
                      "
                      class="w-50 mb-1"
                      type="email"
                    />
                  </div>
                </template>
                <template v-else>
                  <p class="font-weight-bold mb-1">Company name</p>
                  <div class="mb-3">
                    <b-form-invalid-feedback
                      :state="
                        validateNewConnectionItemState(
                          index,
                          newConnectionIndex,
                          'companyName'
                        )
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`people-${index}-newConnections-${newConnectionIndex}-companyName`"
                      v-model="newConnection.companyName"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateNewConnectionItemState(
                          index,
                          newConnectionIndex,
                          'companyName'
                        )
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>

                  <p class="font-weight-bold mb-2">Company address</p>
                  <AddressFinder
                    :ref="`people-${index}-newConnections-${newConnectionIndex}-companyAddress`"
                    :key="renderKey"
                    :address="newConnection.companyAddress"
                    :index="Number(index)"
                    :type="newConnectionIndex.toString()"
                    :disabled="ReadOnlyIA"
                  />

                  <p class="font-weight-bold mb-1">Registered number</p>
                  <div class="mb-5">
                    <b-form-invalid-feedback
                      :state="
                        validateNewConnectionItemState(
                          index,
                          newConnectionIndex,
                          'registeredNumber'
                        )
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`people-${index}-newConnections-${newConnectionIndex}-registeredNumber`"
                      v-model="newConnection.registeredNumber"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateNewConnectionItemState(
                          index,
                          newConnectionIndex,
                          'registeredNumber'
                        )
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>
                </template>

                <b-button
                  variant="outline-danger"
                  class="mb-5"
                  :disabled="ReadOnlyIA"
                  @click="
                    deleteNewConnection(person.$model.id, newConnection.id)
                  "
                >
                  Delete person
                </b-button>
              </div>

              <b-button
                variant="outline-primary"
                :disabled="ReadOnlyIA"
                @click="addNewConnection(person.$model.id)"
              >
                Add another person
              </b-button>
            </div>
          </template>
        </div>
      </div>

      <div class="d-flex flex-column pt-5">
        <b-button
          variant="primary"
          class="align-self-start mb-3"
          :disabled="ReadOnlyIA || requestInProgress"
          @click="save"
        >
          {{ ReadOnlyIA ? "Continue" : "Save and continue" }}
        </b-button>
        <b-button
          variant="outline-primary"
          class="align-self-start"
          :disabled="requestInProgress"
          @click="backWithoutSaving"
        >
          {{ ReadOnlyIA ? "Back" : "Back without saving" }}
        </b-button>
      </div>
    </template>
  </b-container>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import Vue from "vue";
import Vuelidate from "vuelidate";
import { requiredIf, maxLength } from "vuelidate/lib/validators";
import {
  validateFormNew,
  validateAddress,
  isDay,
  isMonth,
  isYear,
  isEmail,
  isDateInPast,
} from "~/lib/validation";
import { findBoolean } from "~/lib/globalFunctions";
Vue.use(Vuelidate);
export default {
  data() {
    return {
      loading: true,
      requestInProgress: false,
      display: false,
      renderKey: 0,
      people: [],
    };
  },
  computed: {
    ReadOnlyIA: {
      get() {
        return this.$store.getters["Global/ReadOnlyIA"];
      },
    },
    AccountData: {
      get() {
        return this.$store.getters["Global/AccountData"];
      },
    },
    InvestmentApplicationData: {
      get() {
        return this.$store.getters[
          "InvestmentApplication/InvestmentApplicationData"
        ];
      },
    },
  },
  mounted() {
    this.isLoggedIn();
  },
  updated() {
    this.validatePersonCheckboxes();
  },
  methods: {
    isLoggedIn() {
      if (!this.$store.state.Global.LoggedIn) {
        this.$router.push({
          path: "/dev-bank-wales/investment-application/page-1",
          query: {
            loggedIn: false,
            pageVisited: this.$route.path,
          },
        });
      } else {
        this.mapStoreValuesToComponentState();
        this.loading = false;
      }
    },
    mapStoreValuesToComponentState() {
      const d = this.InvestmentApplicationData;
      d.DirectorsAndShareholders.forEach((person) => {
        if (
          person.DuplicateOfDirector !== "True" &&
          !person.SmallShareholderGroupOnly
        ) {
          // find connections
          const connections = [];
          person.ShareholderGroup.forEach((group) => {
            connections.push(group.To.Id);
          });
          // add person
          this.people.push({
            id: person.Id,
            type: person.PscType,
            subType: person.PscSubType,
            name: person.Name,
            firstName: person.FirstName,
            lastName: person.LastName,
            birthDay: person.BirthDay,
            birthMonth: person.BirthMonth,
            birthYear: person.BirthYear,
            email: person.Email,
            companyName: person.CompanyAddress.CompanyName,
            isDirector: findBoolean(person.IsDirector),
            isNoLongerDirector: findBoolean(person.IsNoLongerDirector),
            isAuthorisedSignatory: findBoolean(person.IsAuthorisedSignatory),
            isShareholderOver25Percent: findBoolean(
              person.IsShareholderOver25Percent
            ),
            isNoLongerShareholderOver25Percent: findBoolean(
              person.IsNoLongerShareholderOver25Percent
            ),
            isConnectedToShareholdersOver25Percent: findBoolean(
              person.IsConnectedToShareholderOver25Percent
            ),
            connections,
            newConnections: [],
            smallShareholderGroupOnly: person.SmallShareholderGroupOnly,
          });
        }
      });
      // add SmallShareholderGroupOnly people
      d.DirectorsAndShareholders.forEach((person) => {
        if (person.SmallShareholderGroupOnly) {
          // find first shareholder group connection
          const connectionId = person.ShareholderGroup[0].To.Id;
          const connectionMatch = this.people.find(
            (p) => p.id === connectionId
          );
          // add person to their newConnections array
          connectionMatch.newConnections.push({
            id: person.Id,
            type: person.PscType,
            subType: person.PscSubType,
            name: person.Name,
            firstName: person.FirstName,
            lastName: person.LastName,
            birthDay: person.BirthDay,
            birthMonth: person.BirthMonth,
            birthYear: person.BirthYear,
            email: person.Email,
            companyName: person.CompanyAddress.CompanyName,
            registeredNumber: person.CompanyAddress.CompanyNumber,
            companyAddress: {
              address1: person.CompanyAddress.Address1,
              address2: person.CompanyAddress.Address2,
              address3: person.CompanyAddress.Address3,
              city: person.CompanyAddress.City,
              postCode: person.CompanyAddress.PostCode,
            },
          });
        }
      });
    },
    mapAddressesToComponentState() {
      this.people.forEach((person, index) => {
        person.newConnections.forEach((newConnection, newConnectionIndex) => {
          if (newConnection.subType === "Company") {
            const newAddress =
              this.$refs[
                `people-${index}-newConnections-${newConnectionIndex}-companyAddress`
              ][0];
            newConnection.companyAddress = {
              address1: newAddress.address1,
              address2: newAddress.address2,
              address3: newAddress.address3,
              city: newAddress.city,
              postCode: newAddress.postCode,
            };
          }
        });
      });
      this.renderKey += 1;
    },
    addNewConnection(personId) {
      const match = this.people.find((p) => p.id === personId);
      const newConnectionId = uuidv4();
      match.connections.push(newConnectionId);
      match.newConnections.push({
        id: newConnectionId,
        type: "Individual",
        subType: "Individual",
        name: null,
        firstName: null,
        lastName: null,
        birthDay: null,
        birthMonth: null,
        birthYear: null,
        email: null,
        companyName: null,
        registeredNumber: null,
        companyAddress: {
          address1: null,
          address2: null,
          address3: null,
          city: null,
          postCode: null,
        },
      });
    },
    deleteNewConnection(personId, newConnectionId) {
      this.mapAddressesToComponentState();
      const match = this.people.find((p) => p.id === personId);
      // remove new connection
      match.newConnections = match.newConnections.filter(
        (newConnection) => newConnection.id !== newConnectionId
      );
      // remove effected connections to other people
      this.people.forEach((person) => {
        person.connections = person.connections.filter(
          (c) => c !== newConnectionId
        );
      });
      // if no connections remaining, set IsConnectedToShareholderOver25Percent to false
      if (!match.connections.length && !match.newConnections.length)
        match.isConnectedToShareholdersOver25Percent = false;
    },
    resetNewConnection(personId, newConnectionId) {
      const match = this.people.find((p) => p.id === personId);
      const newConnectionMatch = match.newConnections.find(
        (p) => p.id === newConnectionId
      );
      newConnectionMatch.name = null;
      newConnectionMatch.firstName = null;
      newConnectionMatch.lastName = null;
      newConnectionMatch.birthDay = null;
      newConnectionMatch.birthMonth = null;
      newConnectionMatch.birthYear = null;
      newConnectionMatch.email = null;
      newConnectionMatch.companyName = null;
      newConnectionMatch.registeredNumber = null;
      newConnectionMatch.companyAddress = {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      };
    },
    noLongerConnected(personId) {
      const personMatch = this.people.find((p) => p.id === personId);
      personMatch.connections = [];
      if (personMatch.isConnectedToShareholdersOver25Percent === false) {
        this.people.forEach((person) => {
          person.connections = person.connections.filter((c) => c !== personId);
          if (!person.connections.length)
            person.isConnectedToShareholdersOver25Percent = false;
          person.newConnections = [];
        });
      }
    },
    updateEffectedPeople(personId, connectionId) {
      const personMatch = this.people.find((p) => p.id === personId);
      const connectionMatch = this.people.find((p) => p.id === connectionId);
      if (connectionMatch) {
        const removed = !personMatch.connections.includes(connectionId);
        if (removed) {
          connectionMatch.connections = connectionMatch.connections.filter(
            (c) => c !== personId
          );
          if (!connectionMatch.connections.length)
            connectionMatch.isConnectedToShareholdersOver25Percent = false;
        } else {
          connectionMatch.connections.push(personId);
          connectionMatch.isConnectedToShareholdersOver25Percent = true;
        }
      }
    },
    findNewConnectionOptions(personId) {
      const newConnections = [];
      this.people.forEach((person) => {
        if (person.id !== personId) {
          newConnections.push(person);
          person.newConnections.forEach((nc) => {
            if (
              ((nc.subType === "Individual" && nc.firstName && nc.lastName) ||
                (nc.subType === "Company" && nc.companyName)) &&
              !newConnections.includes(nc.id)
            )
              newConnections.push(nc);
          });
        }
      });
      return newConnections;
    },
    validateArrayItemState(array, index, name) {
      const { $dirty, $error } = this.$v[array].$each.$iter[index][name];
      return $dirty ? !$error : null;
    },
    validateNewConnectionItemState(personIndex, newConnectionIndex, value) {
      const { $dirty, $error } =
        this.$v.people.$each.$iter[personIndex].newConnections.$each.$iter[
          newConnectionIndex
        ][value];
      return $dirty ? !$error : null;
    },
    validatePersonCheckboxes() {
      const people = this.people;
      const personInfluence = [];

      people.length > 0 &&
        people.map((person, id) => {
          const {
            isDirector,
            isNoLongerDirector,
            isAuthorisedSignatory,
            isShareholderOver25Percent,
            isNoLongerShareholderOver25Percent,
            isConnectedToShareholdersOver25Percent,
          } = person;

          const personObject = {
            isDirector,
            isNoLongerDirector,
            isAuthorisedSignatory,
            isShareholderOver25Percent,
            isNoLongerShareholderOver25Percent,
            isConnectedToShareholdersOver25Percent,
          };

          personInfluence.push(personObject);
        });

      const isValid = personInfluence.every((person) =>
        Object.values(person).includes(true)
      );

      if (!isValid) {
        this.display = false;
      } else {
        this.display = true;
      }
    },
    save() {
      this.requestInProgress = true;
      // validate form
      if (validateFormNew(this)) {
        this.requestInProgress = false;
        return;
      }
      // validate addresses
      let anyInvalid = false;
      this.people.forEach((person, index) => {
        person.newConnections.forEach((newConnection, newConnectionIndex) => {
          if (
            newConnection.subType === "Company" &&
            validateAddress(
              this.$refs[
                `people-${index}-newConnections-${newConnectionIndex}-companyAddress`
              ][0]
            )
          )
            anyInvalid = true;
        });
      });
      if (anyInvalid) {
        this.requestInProgress = false;
        return;
      }
      // map data to store
      this.mapAddressesToComponentState();
      this.$store.commit(
        "InvestmentApplication/setOtherSignificantPeople",
        this.people
      );
      // send store data to db
      this.$investmentApplicationUpdateService
        .$post("", this.InvestmentApplicationData, {
          params: { email: this.AccountData.Email },
        })
        .then((response) => {
          this.$store.commit(
            "InvestmentApplication/setInvestmentApplicationData",
            response
          );
          this.$router.push(`/dev-bank-wales/investment-application/page-7`);
          this.requestInProgress = false;
        })
        .catch(() => (this.requestInProgress = false));
    },
    backWithoutSaving() {
      this.$router.push(`/dev-bank-wales/investment-application/page-5`);
    },
  },
  validations() {
    return {
      people: {
        $each: {
          name: {},
          isDirector: {},
          isNoLongerDirector: {},
          isAuthorisedSignatory: {},
          isShareholderOver25Percent: {},
          isNoLongerShareholderOver25Percent: {},
          isConnectedToShareholdersOver25Percent: {},
          connections: [],
          newConnections: {
            $each: {
              id: {},
              type: {},
              firstName: {
                required: requiredIf(function (parent) {
                  return parent.subType === "Individual";
                }),
                maxLength: maxLength(250),
              },
              lastName: {
                required: requiredIf(function (parent) {
                  return parent.subType === "Individual";
                }),
                maxLength: maxLength(250),
              },
              birthDay: {
                required: requiredIf(function (parent) {
                  return parent.subType === "Individual";
                }),
                isDay,
              },
              birthMonth: {
                required: requiredIf(function (parent) {
                  return parent.subType === "Individual";
                }),
                isMonth,
              },
              birthYear: {
                required: requiredIf(function (parent) {
                  return parent.subType === "Individual";
                }),
                isYear,
                isDateInPast: (value, parent) => {
                  if (parent.subType === "Individual") {
                    return isDateInPast({
                      year: parent.birthYear,
                      month: parent.birthMonth,
                      day: parent.birthDay,
                    });
                  } else {
                    return true;
                  }
                },
              },
              email: {
                required: requiredIf(function (parent) {
                  return parent.subType === "Individual";
                }),
                isEmail,
                isUniqueEmail: (email, parent) => {
                  const existingPersonEmailMatch = this.people.find(
                    (p) => p.email === email
                  );
                  let newConnectionEmailMatch;
                  this.people.forEach((p) => {
                    const match = p.newConnections.find(
                      (nc) => nc.email === email && nc.id !== parent.id
                    );
                    if (match) newConnectionEmailMatch = true;
                  });
                  if (
                    parent.subType === "Individual" &&
                    (existingPersonEmailMatch || newConnectionEmailMatch)
                  )
                    return false;
                  else return true;
                },
                maxLength: maxLength(500),
              },
              companyName: {
                required: requiredIf(function (parent) {
                  return parent.subType === "Company";
                }),
                maxLength: maxLength(500),
              },
              registeredNumber: {
                required: requiredIf(function (parent) {
                  return parent.subType === "Company";
                }),
              },
            },
          },
        },
      },
    };
  },
};
</script>

<style lang="scss">
.date-field {
  margin-right: 20px;
  width: 100px;
  &.year {
    width: 130px;
  }
}
</style>
