<template>
  <b-container class="p-3 dbw">
    <PageLoading v-if="loading" />
    <template v-else>
      <h1 class="font-weight-bold mb-5">
        {{
          companyRegistered ? "Directors and PSCs" : "Other Significant People"
        }}
      </h1>

      <template v-if="companyRegistered">
        <template v-if="directors.length">
          <div
            v-for="(director, index) in $v.directors.$each.$iter"
            :key="`director-${index}`"
          >
            <h4 class="font-weight-bold mb-3">
              Director {{ Number(index) + 1 }}
            </h4>
            <div class="mb-5">
              <template v-if="director.$model.source === 'CompaniesHouse'">
                <template v-if="director.$model.subType === 'Individual'">
                  <p class="font-weight-bold mb-0">Name</p>
                  <p class="mb-3">
                    {{
                      `${director.$model.firstName} ${director.$model.lastName}`
                    }}
                  </p>

                  <p class="font-weight-bold mb-0">Date of birth</p>
                  <p class="mb-3">
                    {{
                      `${
                        director.$model.birthMonth &lt; 10
                          ? "0" + director.$model.birthMonth
                          : director.$model.birthMonth
                      }-${director.$model.birthYear}`
                    }}
                  </p>
                </template>

                <template v-if="director.$model.subType === 'Company'">
                  <p class="font-weight-bold mb-0">Name</p>
                  <p class="mb-3">
                    {{ director.$model.name }}
                  </p>
                </template>

                <template v-if="director.$model.subType === 'Individual'">
                  <p class="font-weight-bold mb-0">Email address</p>
                  <div class="mb-5">
                    <b-form-invalid-feedback
                      id="email-feedback"
                      :state="
                        validateArrayItemState('directors', index, 'email')
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`email-${index}`"
                      :ref="`email-${index}`"
                      v-model="director.$model.email"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState('directors', index, 'email')
                      "
                      class="w-50 mb-1"
                      type="email"
                      :name="uuidv4()"
                      @blur="director.email.$touch"
                    />
                  </div>
                </template>
              </template>
              <template v-else>
                <p class="mb-3">Type</p>
                <div class="mb-3">
                  <b-form-invalid-feedback
                    :id="`subType-${index}`"
                    :state="
                      validateArrayItemState('directors', index, 'subType')
                    "
                    class="error mb-1"
                  >
                    Invalid
                  </b-form-invalid-feedback>
                  <b-form-group :disabled="ReadOnlyIA">
                    <b-form-radio
                      v-model="director.$model.subType"
                      value="Company"
                      @change="resetDirector(index)"
                    >
                      Company
                    </b-form-radio>
                    <b-form-radio
                      v-model="director.$model.subType"
                      value="Individual"
                      @change="resetDirector(index)"
                    >
                      Individual
                    </b-form-radio>
                  </b-form-group>
                </div>

                <template v-if="director.$model.subType === 'Individual'">
                  <p class="font-weight-bold mb-1">First name</p>
                  <div class="mb-3">
                    <b-form-invalid-feedback
                      id="firstName-feedback"
                      :state="
                        validateArrayItemState('directors', index, 'firstName')
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`firstName-${index}`"
                      :ref="`firstName-${index}`"
                      v-model="director.$model.firstName"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState('directors', index, 'firstName')
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>

                  <p class="font-weight-bold mb-1">Last name</p>
                  <div class="mb-3">
                    <b-form-invalid-feedback
                      id="lastName-feedback"
                      :state="
                        validateArrayItemState('directors', index, 'lastName')
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`lastName-${index}`"
                      :ref="`lastName-${index}`"
                      v-model="director.$model.lastName"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState('directors', index, 'lastName')
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>

                  <p class="font-weight-bold mb-1">Date of birth</p>
                  <b-form-invalid-feedback
                    :id="`birthDay-${index}`"
                    :ref="`birthDay-${index}`"
                    :state="
                      validateArrayItemState('directors', index, 'birthDay')
                    "
                    class="error mb-1"
                  >
                    Invalid day
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    :id="`birthMonth-${index}`"
                    :ref="`birthMonth-${index}`"
                    :state="
                      validateArrayItemState('directors', index, 'birthMonth')
                    "
                    class="error mb-1"
                  >
                    Invalid month
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    :id="`birthYear-${index}`"
                    :ref="`birthYear-${index}`"
                    :state="
                      validateArrayItemState('directors', index, 'birthYear')
                    "
                    class="error mb-1"
                  >
                    Invalid year
                  </b-form-invalid-feedback>
                  <b-row no-gutters class="mb-5">
                    <div class="date-field">
                      <p class="mb-1">Day</p>
                      <b-form-input
                        v-model="director.$model.birthDay"
                        :disabled="ReadOnlyIA"
                        :state="
                          validateArrayItemState('directors', index, 'birthDay')
                        "
                        type="number"
                        placeholder="dd"
                      />
                    </div>
                    <div class="date-field">
                      <p class="mb-1">Month</p>
                      <b-form-input
                        v-model="director.$model.birthMonth"
                        :disabled="ReadOnlyIA"
                        :state="
                          validateArrayItemState(
                            'directors',
                            index,
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
                        v-model="director.$model.birthYear"
                        :disabled="ReadOnlyIA"
                        :state="
                          validateArrayItemState(
                            'directors',
                            index,
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
                      id="email-feedback"
                      :state="
                        validateArrayItemState('directors', index, 'email')
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`email-${index}`"
                      :ref="`email-${index}`"
                      v-model="director.$model.email"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState('directors', index, 'email')
                      "
                      class="w-50 mb-1"
                      type="email"
                      :name="uuidv4()"
                      @blur="director.email.$touch"
                    />
                  </div>
                </template>
                <template v-else>
                  <p class="font-weight-bold mb-1">Company name</p>
                  <div class="mb-3">
                    <b-form-invalid-feedback
                      id="companyName-feedback"
                      :state="
                        validateArrayItemState(
                          'directors',
                          index,
                          'companyName'
                        )
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`companyName-${index}`"
                      :ref="`companyName-${index}`"
                      v-model="director.$model.companyName"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState(
                          'directors',
                          index,
                          'companyName'
                        )
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>

                  <p class="font-weight-bold mb-2">Company address</p>
                  <AddressFinder
                    :ref="`dir-company-address-${index}`"
                    :key="renderKey"
                    :address="director.$model.companyAddress"
                    :index="Number(index)"
                    :disabled="ReadOnlyIA"
                  />

                  <p class="font-weight-bold mb-1">Registered number</p>
                  <div class="mb-5">
                    <b-form-invalid-feedback
                      id="registeredNumber-feedback"
                      :state="
                        validateArrayItemState(
                          'directors',
                          index,
                          'registeredNumber'
                        )
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`registeredNumber-${index}`"
                      :ref="`registeredNumber-${index}`"
                      v-model="director.$model.registeredNumber"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState(
                          'directors',
                          index,
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
                  :disabled="ReadOnlyIA"
                  @click="deleteDirector(index)"
                >
                  Delete this director
                </b-button>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <p>No directors added yet</p>
        </template>

        <b-button
          variant="outline-primary"
          class="mb-5"
          :disabled="ReadOnlyIA"
          @click="addDirector"
        >
          Add another director
        </b-button>

        <template v-if="pscs.length">
          <div
            v-for="(psc, index) in $v.pscs.$each.$iter"
            :key="`psc-${index}`"
          >
            <h4 class="font-weight-bold mb-3">PSC {{ Number(index) + 1 }}</h4>
            <div class="mb-5">
              <template v-if="psc.$model.source === 'CompaniesHouse'">
                <template v-if="psc.$model.pscSubType === 'Individual'">
                  <p class="font-weight-bold mb-0">Name</p>
                  <p class="mb-3">
                    {{ `${psc.$model.pscFirstName} ${psc.$model.pscLastName}` }}
                  </p>

                  <p class="font-weight-bold mb-0">Date of birth</p>
                  <p class="mb-3">
                    {{
                      `${
                        psc.$model.pscBirthMonth &lt; 10
                          ? "0" + psc.$model.pscBirthMonth
                          : psc.$model.pscBirthMonth
                      }-${psc.$model.pscBirthYear}`
                    }}
                  </p>
                </template>

                <template v-if="psc.$model.pscSubType === 'Company'">
                  <p class="font-weight-bold mb-0">Name</p>
                  <p class="mb-3">
                    {{ psc.$model.pscName }}
                  </p>
                </template>

                <b-form-checkbox
                  :checked="psc.$model.pscDuplicteOfDirector"
                  class="mb-5"
                  :disabled="ReadOnlyIA"
                  @change="
                    psc.$model.pscDuplicteOfDirector =
                      !psc.$model.pscDuplicteOfDirector;
                    psc.$model.pscEmail = null;
                  "
                >
                  Duplicate of a director already in the list above
                </b-form-checkbox>

                <template
                  v-if="
                    psc.$model.pscSubType === 'Individual' &&
                    !psc.$model.pscDuplicteOfDirector
                  "
                >
                  <p class="font-weight-bold mb-0">Email address</p>
                  <div class="mb-5">
                    <b-form-invalid-feedback
                      id="pscEmail-feedback"
                      :state="validateArrayItemState('pscs', index, 'pscEmail')"
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`pscEmail-${index}`"
                      :ref="`pscEmail-${index}`"
                      v-model="psc.$model.pscEmail"
                      :disabled="ReadOnlyIA"
                      :state="validateArrayItemState('pscs', index, 'pscEmail')"
                      class="w-50 mb-1"
                      type="email"
                      :name="uuidv4()"
                      @blur="psc.pscEmail.$touch"
                    />
                  </div>
                </template>
              </template>
              <template v-else>
                <p class="mb-3">Type</p>
                <div class="mb-3">
                  <b-form-group
                    :id="`pscSubType-${index}`"
                    :ref="`pscSubType-${index}`"
                    :disabled="ReadOnlyIA"
                  >
                    <b-form-radio
                      v-model="psc.$model.pscSubType"
                      value="Company"
                      @change="resetPsc(index)"
                    >
                      Company
                    </b-form-radio>
                    <b-form-radio
                      v-model="psc.$model.pscSubType"
                      value="Individual"
                      @change="resetPsc(index)"
                    >
                      Individual
                    </b-form-radio>
                  </b-form-group>
                </div>

                <template v-if="psc.$model.pscSubType === 'Individual'">
                  <p class="font-weight-bold mb-1">First name</p>
                  <div class="mb-3">
                    <b-form-invalid-feedback
                      id="pscFirstName-feedback"
                      :state="
                        validateArrayItemState('pscs', index, 'pscFirstName')
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`pscFirstName-${index}`"
                      :ref="`pscFirstName-${index}`"
                      v-model="psc.$model.pscFirstName"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState('pscs', index, 'pscFirstName')
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>

                  <p class="font-weight-bold mb-1">Last name</p>
                  <div class="mb-3">
                    <b-form-invalid-feedback
                      id="pscLastName-feedback"
                      :state="
                        validateArrayItemState('pscs', index, 'pscLastName')
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`pscLastName-${index}`"
                      :ref="`pscLastName-${index}`"
                      v-model="psc.$model.pscLastName"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState('pscs', index, 'pscLastName')
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>

                  <p class="font-weight-bold mb-1">Date of birth</p>
                  <b-form-invalid-feedback
                    :id="`pscBirthDay-${index}`"
                    :ref="`pscBirthDay-${index}`"
                    :state="
                      validateArrayItemState('pscs', index, 'pscBirthDay')
                    "
                    class="error mb-1"
                  >
                    Invalid day
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    :id="`pscBirthMonth-${index}`"
                    :ref="`pscBirthMonth-${index}`"
                    :state="
                      validateArrayItemState('pscs', index, 'pscBirthMonth')
                    "
                    class="error mb-1"
                  >
                    Invalid month
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    :id="`pscBirthYear-${index}`"
                    :ref="`pscBirthYear-${index}`"
                    :state="
                      validateArrayItemState('pscs', index, 'pscBirthYear')
                    "
                    class="error mb-1"
                  >
                    Invalid year
                  </b-form-invalid-feedback>
                  <b-row no-gutters class="mb-5">
                    <div class="date-field">
                      <p class="mb-1">Day</p>
                      <b-form-input
                        v-model="psc.$model.pscBirthDay"
                        :disabled="ReadOnlyIA"
                        :state="
                          validateArrayItemState('pscs', index, 'pscBirthDay')
                        "
                        type="number"
                        placeholder="dd"
                      />
                    </div>
                    <div class="date-field">
                      <p class="mb-1">Month</p>
                      <b-form-input
                        v-model="psc.$model.pscBirthMonth"
                        :disabled="ReadOnlyIA"
                        :state="
                          validateArrayItemState('pscs', index, 'pscBirthMonth')
                        "
                        type="number"
                        placeholder="mm"
                      />
                    </div>
                    <div class="date-field year">
                      <p class="mb-1">Year</p>
                      <b-form-input
                        v-model="psc.$model.pscBirthYear"
                        :disabled="ReadOnlyIA"
                        :state="
                          validateArrayItemState('pscs', index, 'pscBirthYear')
                        "
                        type="number"
                        placeholder="yyyy"
                      />
                    </div>
                  </b-row>

                  <p class="font-weight-bold mb-0">Email address</p>
                  <div class="mb-5">
                    <b-form-invalid-feedback
                      id="pscEmail-feedback"
                      :state="validateArrayItemState('pscs', index, 'pscEmail')"
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`pscEmail-${index}`"
                      :ref="`pscEmail-${index}`"
                      v-model="psc.$model.pscEmail"
                      :disabled="ReadOnlyIA"
                      :state="validateArrayItemState('pscs', index, 'pscEmail')"
                      class="w-50 mb-1"
                      type="email"
                      :name="uuidv4()"
                      @blur="psc.pscEmail.$touch"
                    />
                  </div>
                </template>
                <template v-else>
                  <p class="font-weight-bold mb-1">Company name</p>
                  <div class="mb-3">
                    <b-form-invalid-feedback
                      id="pscCompanyName-feedback"
                      :state="
                        validateArrayItemState('pscs', index, 'pscCompanyName')
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`pscCompanyName-${index}`"
                      :ref="`pscCompanyName-${index}`"
                      v-model="psc.$model.pscCompanyName"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState('pscs', index, 'pscCompanyName')
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>

                  <p class="font-weight-bold mb-2">Company address</p>
                  <AddressFinder
                    :ref="`psc-company-address-${index}`"
                    :key="renderKey"
                    :address="psc.$model.pscCompanyAddress"
                    :index="Number(index) + directors.length"
                    :disabled="ReadOnlyIA"
                  />

                  <p class="font-weight-bold mb-1">Registered number</p>
                  <div class="mb-5">
                    <b-form-invalid-feedback
                      id="pscRegisteredNumber-feedback"
                      :state="
                        validateArrayItemState(
                          'pscs',
                          index,
                          'pscRegisteredNumber'
                        )
                      "
                      class="error mb-1"
                    >
                      Invalid
                    </b-form-invalid-feedback>
                    <b-form-input
                      :id="`pscRegisteredNumber-${index}`"
                      :ref="`pscRegisteredNumber-${index}`"
                      v-model="psc.$model.pscRegisteredNumber"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState(
                          'pscs',
                          index,
                          'pscRegisteredNumber'
                        )
                      "
                      class="w-50 mb-3"
                      type="text"
                    />
                  </div>
                </template>

                <b-button
                  variant="outline-danger"
                  :disabled="ReadOnlyIA"
                  @click="deletePsc(index)"
                >
                  Delete this PSC
                </b-button>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <p>No PSCs added yet</p>
        </template>

        <b-button
          variant="outline-primary"
          :disabled="ReadOnlyIA"
          @click="addPsc"
        >
          Add another PSC
        </b-button>
      </template>
      <template v-else>
        <p>
          Are there any other people who have significant control over the
          company?
        </p>
        <b-form-radio-group
          id="other-significant-people"
          ref="other-significant-people"
          v-model="$v.anyOtherSignificantPeople.$model"
          class="mb-5"
          :disabled="ReadOnlyIA"
          stacked
          @change="toggleAnyOtherSignificantPeople"
        >
          <b-form-radio :value="true">Yes</b-form-radio>
          <b-form-radio :value="false">No</b-form-radio>
        </b-form-radio-group>
        <div
          v-for="(osp, index) in $v.otherSignificantPeople.$each.$iter"
          :key="`osp-${index}`"
        >
          <h4 class="font-weight-bold mb-3">Person {{ Number(index) + 1 }}</h4>
          <div class="mb-5">
            <fieldset>
              <legend class="mb-3 h5">Type</legend>
              <div class="mb-3">
                <b-form-group
                  :id="`ospSubType-${index}`"
                  :ref="`ospSubType-${index}`"
                  :disabled="ReadOnlyIA"
                >
                  <b-form-radio
                    v-model="osp.$model.ospSubType"
                    value="Company"
                    @change="resetOsp(index)"
                  >
                    Company
                  </b-form-radio>
                  <b-form-radio
                    v-model="osp.$model.ospSubType"
                    value="Individual"
                    @change="resetOsp(index)"
                  >
                    Individual
                  </b-form-radio>
                </b-form-group>
              </div>
            </fieldset>

            <template v-if="osp.$model.ospSubType === 'Individual'">
              <label
                class="font-weight-bold mb-1"
                :for="`ospFirstName-${index}`"
              >
                First name
              </label>
              <div class="mb-3">
                <b-form-invalid-feedback
                  id="ospFirstName-feedback"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospFirstName'
                    )
                  "
                  class="error mb-1"
                >
                  Invalid
                </b-form-invalid-feedback>
                <b-form-input
                  :id="`ospFirstName-${index}`"
                  :ref="`ospFirstName-${index}`"
                  v-model="osp.$model.ospFirstName"
                  :disabled="ReadOnlyIA"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospFirstName'
                    )
                  "
                  class="w-50 mb-3"
                  type="text"
                />
              </div>

              <label
                class="font-weight-bold mb-1"
                :for="`ospLastName-${index}`"
              >
                Last name
              </label>
              <div class="mb-3">
                <b-form-invalid-feedback
                  id="ospLastName-feedback"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospLastName'
                    )
                  "
                  class="error mb-1"
                >
                  Invalid
                </b-form-invalid-feedback>
                <b-form-input
                  :id="`ospLastName-${index}`"
                  :ref="`ospLastName-${index}`"
                  v-model="osp.$model.ospLastName"
                  :disabled="ReadOnlyIA"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospLastName'
                    )
                  "
                  class="w-50 mb-3"
                  type="text"
                />
              </div>

              <fieldset>
                <legend class="font-weight-bold mb-1 h5">Date of birth</legend>
                <b-form-invalid-feedback
                  :id="`ospBirthDay-${index}`"
                  :ref="`ospBirthDay-${index}`"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospBirthDay'
                    )
                  "
                  class="error mb-1"
                >
                  Invalid day
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  :id="`ospBirthMonth-${index}`"
                  :ref="`ospBirthMonth-${index}`"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospBirthMonth'
                    )
                  "
                  class="error mb-1"
                >
                  Invalid month
                </b-form-invalid-feedback>
                <b-form-invalid-feedback
                  :id="`ospBirthYear-${index}`"
                  :ref="`ospBirthYear-${index}`"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospBirthYear'
                    )
                  "
                  class="error mb-1"
                >
                  Invalid year
                </b-form-invalid-feedback>
                <b-row no-gutters class="mb-5">
                  <div class="date-field">
                    <label :for="`ospBirthDayInput-${index}`" class="mb-1"
                      >Day
                    </label>
                    <b-form-input
                      :id="`ospBirthDayInput-${index}`"
                      v-model="osp.$model.ospBirthDay"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState(
                          'otherSignificantPeople',
                          index,
                          'ospBirthDay'
                        )
                      "
                      type="number"
                      placeholder="dd"
                    />
                  </div>
                  <div class="date-field">
                    <label class="mb-1" :for="`ospBirthMonthInput-${index}`">
                      Month
                    </label>
                    <b-form-input
                      :id="`ospBirthMonthInput-${index}`"
                      v-model="osp.$model.ospBirthMonth"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState(
                          'otherSignificantPeople',
                          index,
                          'ospBirthMonth'
                        )
                      "
                      type="number"
                      placeholder="mm"
                    />
                  </div>
                  <div class="date-field year">
                    <label class="mb-1" :for="`ospBirthYearInput-${index}`">
                      Year
                    </label>
                    <b-form-input
                      :id="`ospBirthYearInput-${index}`"
                      v-model="osp.$model.ospBirthYear"
                      :disabled="ReadOnlyIA"
                      :state="
                        validateArrayItemState(
                          'otherSignificantPeople',
                          index,
                          'ospBirthYear'
                        )
                      "
                      type="number"
                      placeholder="yyyy"
                    />
                  </div>
                </b-row>
              </fieldset>

              <label class="font-weight-bold mb-0" :for="`ospEmail-${index}`">
                Email address
              </label>
              <div class="mb-3">
                <b-form-invalid-feedback
                  id="ospEmail-feedback"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospEmail'
                    )
                  "
                  class="error mb-1"
                >
                  Invalid
                </b-form-invalid-feedback>
                <b-form-input
                  :id="`ospEmail-${index}`"
                  :ref="`ospEmail-${index}`"
                  v-model="osp.$model.ospEmail"
                  :disabled="ReadOnlyIA"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospEmail'
                    )
                  "
                  class="w-50 mb-1"
                  type="email"
                  :name="uuidv4()"
                  @blur="osp.ospEmail.$touch"
                />
              </div>

              <label
                class="font-weight-bold mb-1"
                :for="`ospCompanyRole-${index}`"
              >
                Role in the company
              </label>
              <div class="mb-5">
                <b-form-invalid-feedback
                  id="ospCompanyRole-feedback"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospCompanyRole'
                    )
                  "
                  class="error mb-1"
                >
                  Invalid
                </b-form-invalid-feedback>
                <b-form-input
                  :id="`ospCompanyRole-${index}`"
                  :ref="`ospCompanyRole-${index}`"
                  v-model="osp.$model.ospCompanyRole"
                  :disabled="ReadOnlyIA"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospCompanyRole'
                    )
                  "
                  class="w-50 mb-3"
                  type="text"
                />
              </div>
            </template>
            <template v-else>
              <p class="font-weight-bold mb-1">Company name</p>
              <div class="mb-3">
                <b-form-invalid-feedback
                  id="ospCompanyName-feedback"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospCompanyName'
                    )
                  "
                  class="error mb-1"
                >
                  Invalid
                </b-form-invalid-feedback>
                <b-form-input
                  :id="`ospCompanyName-${index}`"
                  :ref="`ospCompanyName-${index}`"
                  v-model="osp.$model.ospCompanyName"
                  :disabled="ReadOnlyIA"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospCompanyName'
                    )
                  "
                  class="w-50 mb-3"
                  type="text"
                />
              </div>

              <p class="font-weight-bold mb-2">Company address</p>
              <AddressFinder
                :ref="`osp-company-address-${index}`"
                :key="renderKey"
                :address="osp.$model.ospCompanyAddress"
                :index="Number(index) + otherSignificantPeople.length"
                :disabled="ReadOnlyIA"
              />

              <p class="font-weight-bold mb-1">Registered number</p>
              <div class="mb-5">
                <b-form-invalid-feedback
                  id="ospRegisteredNumber-feedback"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospRegisteredNumber'
                    )
                  "
                  class="error mb-1"
                >
                  Invalid
                </b-form-invalid-feedback>
                <b-form-input
                  :id="`ospRegisteredNumber-${index}`"
                  :ref="`ospRegisteredNumber-${index}`"
                  v-model="osp.$model.ospRegisteredNumber"
                  :disabled="ReadOnlyIA"
                  :state="
                    validateArrayItemState(
                      'otherSignificantPeople',
                      index,
                      'ospRegisteredNumber'
                    )
                  "
                  class="w-50 mb-3"
                  type="text"
                />
              </div>
            </template>

            <b-button
              variant="outline-danger"
              :disabled="ReadOnlyIA"
              @click="deleteOsp(index)"
            >
              Delete this person
            </b-button>
          </div>
        </div>

        <template v-if="otherSignificantPeople.length">
          <b-button
            variant="outline-primary"
            class="mb-5"
            :disabled="ReadOnlyIA"
            @click="addOsp"
          >
            Add another person
          </b-button>
        </template>
      </template>

      <div class="d-flex flex-column pt-5">
        <b-button
          variant="primary"
          class="align-self-start mb-3"
          :disabled="requestInProgress"
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
import { required, requiredIf, maxLength } from "vuelidate/lib/validators";
import {
  validateRepeat,
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
      renderKey: 0,
      companyRegistered: false,
      directors: [],
      pscs: [],
      anyOtherSignificantPeople: null,
      otherSignificantPeople: [],
      radioGroupActive: false,
    };
  },
  computed: {
    isRegistered() {
      return !!this.companyRegistered;
    },
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
    uuidv4,
    mapStoreValuesToComponentState() {
      const d = this.InvestmentApplicationData;
      // set companyRegistered boolean
      if (
        d.BusinessType === "LimitedCompany" ||
        d.BusinessType === "CompanyLtdByGuarantee" ||
        d.BusinessType === "LimitedLiabilityPartnership"
      )
        this.companyRegistered = true;
      // add directors and pscs
      d.DirectorsAndShareholders.forEach((person) => {
        if (this.companyRegistered) {
          if (person.PscType === "Director") {
            this.directors.push({
              id: person.Id,
              createdOn: new Date(person.CreatedOn),
              source: person.Source,
              subType: person.PscSubType,
              name: person.UnformattedName,
              firstName: person.FirstName,
              lastName: person.LastName,
              birthDay: person.BirthDay === 0 ? null : person.BirthDay,
              birthMonth: person.BirthMonth === 0 ? null : person.BirthMonth,
              birthYear: person.BirthYear === 0 ? null : person.BirthYear,
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
          } else if (person.PscType === "Individual") {
            this.pscs.push({
              id: person.Id,
              createdOn: new Date(person.CreatedOn),
              source: person.Source,
              pscSubType: person.PscSubType,
              pscName: person.UnformattedName,
              pscFirstName: person.FirstName,
              pscLastName: person.LastName,
              pscBirthDay: person.BirthDay === 0 ? null : person.BirthDay,
              pscBirthMonth: person.BirthMonth === 0 ? null : person.BirthMonth,
              pscBirthYear: person.BirthYear === 0 ? null : person.BirthYear,
              pscDuplicteOfDirector: findBoolean(person.DuplicateOfDirector),
              pscEmail: person.Email,
              pscCompanyName: person.CompanyAddress.CompanyName,
              pscRegisteredNumber: person.CompanyAddress.CompanyNumber,
              pscCompanyAddress: {
                address1: person.CompanyAddress.Address1,
                address2: person.CompanyAddress.Address2,
                address3: person.CompanyAddress.Address3,
                city: person.CompanyAddress.City,
                postCode: person.CompanyAddress.PostCode,
              },
            });
          }
        } else {
          this.otherSignificantPeople.push({
            id: person.Id,
            createdOn: new Date(person.CreatedOn),
            source: person.Source,
            ospSubType: person.PscSubType,
            ospName: person.UnformattedName,
            ospFirstName: person.FirstName,
            ospLastName: person.LastName,
            ospBirthDay: person.BirthDay === 0 ? null : person.BirthDay,
            ospBirthMonth: person.BirthMonth === 0 ? null : person.BirthMonth,
            ospBirthYear: person.BirthYear === 0 ? null : person.BirthYear,
            ospEmail: person.Email,
            ospCompanyRole: person.CompanyRole,
            ospCompanyName: person.CompanyAddress.CompanyName,
            ospRegisteredNumber: person.CompanyAddress.CompanyNumber,
            ospCompanyAddress: {
              address1: person.CompanyAddress.Address1,
              address2: person.CompanyAddress.Address2,
              address3: person.CompanyAddress.Address3,
              city: person.CompanyAddress.City,
              postCode: person.CompanyAddress.PostCode,
            },
          });
        }
      });
      // sort by date created
      this.directors = this.directors.sort((a, b) => a.createdOn - b.createdOn);
      this.pscs = this.pscs.sort((a, b) => a.createdOn - b.createdOn);
      this.otherSignificantPeople = this.otherSignificantPeople.sort(
        (a, b) => a.createdOn - b.createdOn
      );
      // set otherSignificant people boolean
      if (!this.companyRegistered && this.otherSignificantPeople.length)
        this.anyOtherSignificantPeople = true;
    },
    mapAddressesToComponentState() {
      this.directors.forEach((director, index) => {
        if (
          director.source === "UserEntered" &&
          director.subType === "Company"
        ) {
          const newAddress = this.$refs[`dir-company-address-${index}`];
          if (newAddress) {
            director.companyAddress = {
              address1: newAddress[0].address1,
              address2: newAddress[0].address2,
              address3: newAddress[0].address3,
              city: newAddress[0].city,
              postCode: newAddress[0].postCode,
            };
          }
        }
      });
      this.pscs.forEach((psc, index) => {
        if (psc.source === "UserEntered" && psc.pscSubType === "Company") {
          const newAddress = this.$refs[`psc-company-address-${index}`][0];
          psc.pscCompanyAddress = {
            address1: newAddress.address1,
            address2: newAddress.address2,
            address3: newAddress.address3,
            city: newAddress.city,
            postCode: newAddress.postCode,
          };
        }
      });
      this.otherSignificantPeople.forEach((osp, index) => {
        if (osp.ospSubType === "Company") {
          const newAddress = this.$refs[`osp-company-address-${index}`][0];
          osp.ospCompanyAddress = {
            address1: newAddress.address1,
            address2: newAddress.address2,
            address3: newAddress.address3,
            city: newAddress.city,
            postCode: newAddress.postCode,
          };
        }
      });
      this.renderKey += 1;
    },
    addDirector() {
      this.directors.push({
        id: uuidv4(),
        source: "UserEntered",
        subType: "Individual",
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
    deleteDirector(index) {
      this.mapAddressesToComponentState();
      this.directors = this.directors.filter((d, i) => i !== Number(index));
    },
    resetDirector(index) {
      const match = this.directors.find((d, i) => i === Number(index));
      match.firstName = null;
      match.lastName = null;
      match.birthDay = null;
      match.birthMonth = null;
      match.birthYear = null;
      match.email = null;
      match.companyName = null;
      match.registeredNumber = null;
      match.companyAddress = {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      };
      this.mapAddressesToComponentState();
    },
    addPsc() {
      this.pscs.push({
        id: uuidv4(),
        source: "UserEntered",
        pscSubType: "Individual",
        pscFirstName: null,
        pscLastName: null,
        pscBirthDay: null,
        pscBirthMonth: null,
        pscBirthYear: null,
        pscDuplicteOfDirector: false,
        pscEmail: null,
        pscCompanyName: null,
        pscRegisteredNumber: null,
        pscCompanyAddress: {
          address1: null,
          address2: null,
          address3: null,
          city: null,
          postCode: null,
        },
      });
    },
    deletePsc(index) {
      this.mapAddressesToComponentState();
      this.pscs = this.pscs.filter((d, i) => i !== Number(index));
    },
    resetPsc(index) {
      const match = this.pscs.find((d, i) => i === Number(index));
      match.pscFirstName = null;
      match.pscLastName = null;
      match.pscBirthDay = null;
      match.pscBirthMonth = null;
      match.pscBirthYear = null;
      match.pscDuplicteOfDirector = false;
      match.pscEmail = null;
      match.pscCompanyName = null;
      match.pscRegisteredNumber = null;
      match.pscCompanyAddress = {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      };
      this.mapAddressesToComponentState();
    },
    toggleAnyOtherSignificantPeople() {
      this.radioGroupActive = true;
      if (this.anyOtherSignificantPeople) this.addOsp();
      else this.otherSignificantPeople = [];
    },
    addOsp() {
      this.otherSignificantPeople.push({
        id: uuidv4(),
        source: "UserEntered",
        ospSubType: "Individual",
        ospFirstName: null,
        ospLastName: null,
        ospBirthDay: null,
        ospBirthMonth: null,
        ospBirthYear: null,
        ospEmail: null,
        ospCompanyRole: null,
        ospCompanyName: null,
        ospRegisteredNumber: null,
        ospCompanyAddress: {
          address1: null,
          address2: null,
          address3: null,
          city: null,
          postCode: null,
        },
      });
    },
    deleteOsp(index) {
      this.mapAddressesToComponentState();
      this.otherSignificantPeople = this.otherSignificantPeople.filter(
        (d, i) => i !== Number(index)
      );
      if (!this.otherSignificantPeople.length)
        this.anyOtherSignificantPeople = false;
    },
    resetOsp(index) {
      const match = this.otherSignificantPeople.find(
        (d, i) => i === Number(index)
      );
      match.ospFirstName = null;
      match.ospLastName = null;
      match.ospBirthDay = null;
      match.ospBirthMonth = null;
      match.ospBirthYear = null;
      match.ospEmail = null;
      match.ospCompanyRole = null;
      match.ospCompanyName = null;
      match.ospRegisteredNumber = null;
      match.ospCompanyAddress = {
        address1: null,
        address2: null,
        address3: null,
        city: null,
        postCode: null,
      };
      this.mapAddressesToComponentState();
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    validateArrayItemState(array, index, name) {
      const { $dirty, $error } = this.$v[array].$each.$iter[index][name];
      return $dirty ? !$error : null;
    },
    validateDate(year, month, day) {
      month = month - 1;
      const d = new Date(year, month, day);
      if (
        d.getFullYear() == year &&
        d.getMonth() == month &&
        d.getDate() == day
      ) {
        return true;
      }
      return false;
    },
    save() {
      if (this.ReadOnlyIA && companyRegistered) {
        this.$router.push("/dev-bank-wales/investment-application/page-6");
      } else if (this.ReadOnlyIA && !companyRegistered) {
        this.$router.push("/dev-bank-wales/investment-application/page-8");
      } else {
        this.requestInProgress = true;
        // validate form
        if (validateRepeat(this.$v, this)) {
          this.requestInProgress = false;
          return;
        }
        let anyInvalid = false;
        this.directors.forEach((director, index) => {
          if (
            director.source === "UserEntered" &&
            director.subType === "Company"
          ) {
            if (validateAddress(this.$refs[`dir-company-address-${index}`][0]))
              anyInvalid = true;
          }
        });
        this.pscs.forEach((psc, index) => {
          if (psc.source === "UserEntered" && psc.pscSubType === "Company") {
            if (validateAddress(this.$refs[`psc-company-address-${index}`][0]))
              anyInvalid = true;
          }
        });
        this.otherSignificantPeople.forEach((osp, index) => {
          if (osp.ospSubType === "Company") {
            if (validateAddress(this.$refs[`osp-company-address-${index}`][0]))
              anyInvalid = true;
          }
        });
        if (anyInvalid) {
          this.requestInProgress = false;
          return;
        }
        // map data to store
        this.mapAddressesToComponentState();
        this.$store.commit("InvestmentApplication/setDirectorsAndPscs", {
          directors: this.directors,
          pscs: this.pscs,
          osps: this.otherSignificantPeople,
          anyOtherSignificantPeople: this.anyOtherSignificantPeople,
        });

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
            /**
             * ---------------------------------------------------------------------------
             * If company is registered, there will be people/companies associated
             * As a sole trader/unregistered business, you can also add significant people
             * This takes ^that into account - else if none, user can submit
             * ---------------------------------------------------------------------------
             */
            if (this.companyRegistered) {
              // user continues with their application - page 7 is the new submission page
              this.$router.push(
                `/dev-bank-wales/investment-application/page-6`
              );
            } else {
              // page 7 is the new submission page
              this.$router.push(
                `/dev-bank-wales/investment-application/page-7`
              );
            }
            this.requestInProgress = false;
          })
          .catch(() => (this.requestInProgress = false));
      }
    },
    backWithoutSaving() {
      this.$router.push(`/dev-bank-wales/investment-application/page-4`);
    },
  },
  validations() {
    return {
      directors: {
        $each: {
          id: {},
          subType: {
            required: requiredIf(function (director) {
              return director.source === "UserEntered";
            }),
          },
          name: {},
          firstName: {
            required: requiredIf(function (director) {
              return (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              );
            }),
            maxLength: maxLength(250),
          },
          lastName: {
            required: requiredIf(function (director) {
              return (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              );
            }),
            maxLength: maxLength(250),
          },
          birthDay: {
            required: requiredIf(function (director) {
              return (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              );
            }),
            isDay,
            isDateInPast: (value, director) => {
              if (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              ) {
                return isDateInPast({
                  year: director.birthYear,
                  month: director.birthMonth,
                  day: director.birthDay,
                });
              } else {
                return true;
              }
            },
            isValidDate: (value, director) => {
              if (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              ) {
                return this.validateDate(
                  director.birthYear,
                  director.birthMonth,
                  director.birthDay
                );
              } else {
                return true;
              }
            },
          },
          birthMonth: {
            required: requiredIf(function (director) {
              return (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              );
            }),
            isMonth,
            isDateInPast: (value, director) => {
              if (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              ) {
                return isDateInPast({
                  year: director.birthYear,
                  month: director.birthMonth,
                  day: director.birthDay,
                });
              } else {
                return true;
              }
            },
            isValidDate: (value, director) => {
              if (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              ) {
                return this.validateDate(
                  director.birthYear,
                  director.birthMonth,
                  director.birthDay
                );
              } else {
                return true;
              }
            },
          },
          birthYear: {
            required: requiredIf(function (director) {
              return (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              );
            }),
            isYear,
            isDateInPast: (value, director) => {
              if (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              ) {
                return isDateInPast({
                  year: director.birthYear,
                  month: director.birthMonth,
                  day: director.birthDay,
                });
              } else {
                return true;
              }
            },
            isValidDate: (value, director) => {
              if (
                director.source === "UserEntered" &&
                director.subType === "Individual"
              ) {
                return this.validateDate(
                  director.birthYear,
                  director.birthMonth,
                  director.birthDay
                );
              } else {
                return true;
              }
            },
          },
          email: {
            required: requiredIf(function (director) {
              return director.subType === "Individual";
            }),
            isEmail,
            isUniqueEmail: (value, parent) => {
              const dirEmailMatch = this.directors.find(
                (d) => d.email === value && d.id !== parent.id
              );
              const pscEmailMatch = this.pscs.find(
                (p) => p.pscEmail === value && !p.pscDuplicteOfDirector
              );
              if (
                parent.subType !== "Company" &&
                (dirEmailMatch || pscEmailMatch)
              )
                return false;
              else return true;
            },
            maxLength: maxLength(500),
          },
          companyName: {
            required: requiredIf(function (director) {
              return (
                director.source === "UserEntered" &&
                director.subType === "Company"
              );
            }),
            maxLength: maxLength(500),
          },
          registeredNumber: {
            required: requiredIf(function (director) {
              return (
                director.source === "UserEntered" &&
                director.subType === "Company"
              );
            }),
          },
        },
      },
      pscs: {
        $each: {
          id: {},
          pscSubType: {
            required: requiredIf(function (psc) {
              return psc.source === "UserEntered";
            }),
          },
          pscName: {},
          pscFirstName: {
            required: requiredIf(function (psc) {
              return (
                psc.source === "UserEntered" && psc.pscSubType === "Individual"
              );
            }),
          },
          pscLastName: {
            required: requiredIf(function (psc) {
              return (
                psc.source === "UserEntered" && psc.pscSubType === "Individual"
              );
            }),
          },
          pscBirthDay: {
            required: requiredIf(function (psc) {
              return (
                psc.source === "UserEntered" && psc.pscSubType === "Individual"
              );
            }),
            isDay,
            isDateInPast: (value, psc) => {
              if (
                psc.source === "UserEntered" &&
                psc.pscSubType === "Individual"
              ) {
                return isDateInPast({
                  year: psc.pscBirthYear,
                  month: psc.pscBirthMonth,
                  day: psc.pscBirthDay,
                });
              } else {
                return true;
              }
            },
            isValidDate: (value, psc) => {
              if (
                psc.source === "UserEntered" &&
                psc.pscSubType === "Individual"
              ) {
                return this.validateDate(
                  psc.pscBirthYear,
                  psc.pscBirthMonth,
                  psc.pscBirthDay
                );
              } else {
                return true;
              }
            },
          },
          pscBirthMonth: {
            required: requiredIf(function (psc) {
              return (
                psc.source === "UserEntered" && psc.pscSubType === "Individual"
              );
            }),
            isMonth,
            isDateInPast: (value, psc) => {
              if (
                psc.source === "UserEntered" &&
                psc.pscSubType === "Individual"
              ) {
                return isDateInPast({
                  year: psc.pscBirthYear,
                  month: psc.pscBirthMonth,
                  day: psc.pscBirthDay,
                });
              } else {
                return true;
              }
            },
            isValidDate: (value, psc) => {
              if (
                psc.source === "UserEntered" &&
                psc.pscSubType === "Individual"
              ) {
                return this.validateDate(
                  psc.pscBirthYear,
                  psc.pscBirthMonth,
                  psc.pscBirthDay
                );
              } else {
                return true;
              }
            },
          },
          pscBirthYear: {
            required: requiredIf(function (psc) {
              return (
                psc.source === "UserEntered" && psc.pscSubType === "Individual"
              );
            }),
            isYear,
            isDateInPast: (value, psc) => {
              if (
                psc.source === "UserEntered" &&
                psc.pscSubType === "Individual"
              ) {
                return isDateInPast({
                  year: psc.pscBirthYear,
                  month: psc.pscBirthMonth,
                  day: psc.pscBirthDay,
                });
              } else {
                return true;
              }
            },
            isValidDate: (value, psc) => {
              if (
                psc.source === "UserEntered" &&
                psc.pscSubType === "Individual"
              ) {
                return this.validateDate(
                  psc.pscBirthYear,
                  psc.pscBirthMonth,
                  psc.pscBirthDay
                );
              } else {
                return true;
              }
            },
          },
          pscDuplicteOfDirector: {},
          pscEmail: {
            required: requiredIf(function (psc) {
              return (
                psc.pscSubType === "Individual" && !psc.pscDuplicteOfDirector
              );
            }),
            isEmail,
            isUniqueEmail: (value, parent) => {
              const dirEmailMatch = this.directors.find(
                (d) => d.email === value
              );
              const pscEmailMatch = this.pscs.find(
                (p) => p.pscEmail === value && p.id !== parent.id
              );
              if (
                parent.pscSubType !== "Company" &&
                !parent.pscDuplicteOfDirector &&
                (dirEmailMatch || pscEmailMatch)
              )
                return false;
              else return true;
            },
          },
          pscCompanyName: {
            required: requiredIf(function (psc) {
              return (
                psc.source === "UserEntered" && psc.pscSubType === "Company"
              );
            }),
          },
          pscRegisteredNumber: {
            required: requiredIf(function (psc) {
              return (
                psc.source === "UserEntered" && psc.pscSubType === "Company"
              );
            }),
          },
        },
      },
      anyOtherSignificantPeople: {
        required: requiredIf(function () {
          return !this.companyRegistered;
        }),
      },
      otherSignificantPeople: {
        $each: {
          id: {},
          ospSubType: {
            required,
          },
          ospName: {},
          ospFirstName: {
            required: requiredIf(function (osp) {
              return osp.ospSubType === "Individual";
            }),
          },
          ospLastName: {
            required: requiredIf(function (osp) {
              return osp.ospSubType === "Individual";
            }),
          },
          ospBirthDay: {
            required: requiredIf(function (osp) {
              return osp.ospSubType === "Individual";
            }),
            isDay,
            isValidDate: (value, osp) => {
              if (osp.ospSubType === "Individual") {
                return this.validateDate(
                  osp.ospBirthYear,
                  osp.ospBirthMonth,
                  osp.ospBirthDay
                );
              } else {
                return true;
              }
            },
            isDateInPast: (value, osp) => {
              if (osp.ospSubType === "Individual") {
                return isDateInPast({
                  year: osp.ospBirthYear,
                  month: osp.ospBirthMonth,
                  day: osp.ospBirthDay,
                });
              } else {
                return true;
              }
            },
          },
          ospBirthMonth: {
            required: requiredIf(function (osp) {
              return osp.ospSubType === "Individual";
            }),
            isMonth,
            isValidDate: (value, osp) => {
              if (osp.ospSubType === "Individual") {
                return this.validateDate(
                  osp.ospBirthYear,
                  osp.ospBirthMonth,
                  osp.ospBirthDay
                );
              } else {
                return true;
              }
            },
            isDateInPast: (value, osp) => {
              if (osp.ospSubType === "Individual") {
                return isDateInPast({
                  year: osp.ospBirthYear,
                  month: osp.ospBirthMonth,
                  day: osp.ospBirthDay,
                });
              } else {
                return true;
              }
            },
          },
          ospBirthYear: {
            required: requiredIf(function (osp) {
              return osp.ospSubType === "Individual";
            }),
            isYear,
            isValidDate: (value, osp) => {
              if (osp.ospSubType === "Individual") {
                return this.validateDate(
                  osp.ospBirthYear,
                  osp.ospBirthMonth,
                  osp.ospBirthDay
                );
              } else {
                return true;
              }
            },
            isDateInPast: (value, osp) => {
              if (osp.ospSubType === "Individual") {
                return isDateInPast({
                  year: osp.ospBirthYear,
                  month: osp.ospBirthMonth,
                  day: osp.ospBirthDay,
                });
              } else {
                return true;
              }
            },
          },
          ospEmail: {
            required: requiredIf(function (osp) {
              return osp.ospSubType === "Individual";
            }),
            isEmail,
            isUniqueEmail: (value, parent) => {
              const ospEmailMatch = this.otherSignificantPeople.find(
                (o) => o.ospEmail === value && o.id !== parent.id
              );
              if (parent.ospSubType !== "Company" && ospEmailMatch)
                return false;
              else return true;
            },
          },
          ospCompanyRole: {
            required: requiredIf(function (osp) {
              return osp.ospSubType === "Individual";
            }),
          },
          ospCompanyName: {
            required: requiredIf(function (osp) {
              return osp.ospSubType === "Company";
            }),
          },
          ospRegisteredNumber: {
            required: requiredIf(function (osp) {
              return osp.ospSubType === "Company";
            }),
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
