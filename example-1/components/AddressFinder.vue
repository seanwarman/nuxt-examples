<template>
  <b-form class="mb-5" @submit="(e) => e.preventDefault()">
    <p class="mb-2">Enter a postcode</p>
    <div class="mb-3 d-flex flex-wrap">
      <b-form-input
        :id="`postCodeInput${index === null ? '' : index}${
          type === null ? '' : type
        }`"
        v-model="postCodeInput"
        :disabled="disabled"
        class="post-code-input mr-3 mb-3"
        type="text"
        placeholder="Postcode"
        @keyup.enter="findAddress"
      />
      <b-button
        :variant="
          postCodeInput.length ? 'outline-primary' : 'outline-secondary'
        "
        :disabled="disabled"
        class="mb-3"
        @click="findAddress"
      >
        Find address
      </b-button>
    </div>
    <template v-if="showNoAddressesFoundError">
      <p class="error">No addresses found</p>
    </template>
    <template v-if="addressDropDownVisible">
      <p class="font-weight-bold">Select an address from the list</p>
      <b-dropdown
        :text="`${addressOptions.length} address${
          addressOptions.length === 1 ? '' : 'es'
        } found`"
        :disabled="disabled"
        variant="outline-primary"
        class="align-self-start mb-3"
      >
        <b-dropdown-item
          v-for="(option, i) in addressOptions"
          :key="i"
          @click="setAddress(option)"
        >
          {{ option.address[0]
          }}{{ option.address[1] && ", " + option.address[1] }}
        </b-dropdown-item>
      </b-dropdown>
    </template>
    <p
      v-if="!enterFullAddress"
      class="link mb-3"
      @click="!disabled && (enterFullAddress = true)"
    >
      I can't enter a UK postcode
    </p>
    <template
      v-if="
        enterFullAddress ||
        address1.length ||
        address2.length ||
        address3.length ||
        city.length ||
        postCode.length
      "
    >
      <p class="mb-1">Building and street</p>
      <div>
        <b-form-invalid-feedback
          id="address1-feedback"
          :state="validateState('address1')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          :id="`address1${index === null ? '' : index}${
            type === null ? '' : type
          }`"
          :ref="`address1${index === null ? '' : index}${
            type === null ? '' : type
          }`"
          v-model="$v.address1.$model"
          :disabled="disabled"
          :state="validateState('address1')"
          class="form-input mb-1"
          type="text"
        />
      </div>
      <b-form-input
        v-model="address2"
        :disabled="disabled"
        class="form-input mb-1"
        type="text"
      />
      <b-form-input
        v-model="address3"
        :disabled="disabled"
        class="form-input mb-1"
        type="text"
      />
      <p class="mb-1">Town or city</p>
      <div>
        <b-form-invalid-feedback
          id="city-feedback"
          :state="validateState('city')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          :id="`city${index === null ? '' : index}${type === null ? '' : type}`"
          :ref="`city${index === null ? '' : index}${
            type === null ? '' : type
          }`"
          v-model="$v.city.$model"
          :disabled="disabled"
          :state="validateState('city')"
          class="form-input mb-1"
          type="text"
        />
      </div>
      <p class="mb-1">Postcode</p>
      <div class="mb-5">
        <b-form-invalid-feedback
          id="postCode-feedback"
          :state="validateState('postCode')"
          class="error mb-1"
        >
          Invalid
        </b-form-invalid-feedback>
        <b-form-input
          :id="`postCode${index === null ? '' : index}${
            type === null ? '' : type
          }`"
          :ref="`postCode${index === null ? '' : index}${
            type === null ? '' : type
          }`"
          v-model="$v.postCode.$model"
          :disabled="disabled"
          :state="validateState('postCode')"
          class="form-input mb-1"
          type="text"
        />
      </div>
    </template>
  </b-form>
</template>

<script>
import Vue from "vue";
import Vuelidate from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import { isPostcode } from "~/lib/validation";
import { addressLookupHeaders } from "~/static/addressLookupConstants.js";
Vue.use(Vuelidate);
export default {
  props: {
    index: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    address: {
      type: Object,
      default() {
        return {
          address1: String,
          address2: String,
          address3: String,
          city: String,
          postCode: String,
        };
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      postCodeInput: "",
      addressDropDownVisible: false,
      addressOptionsVisible: false,
      showNoAddressesFoundError: false,
      addressOptions: [],
      address1: "",
      address2: "",
      address3: "",
      city: "",
      postCode: "",
      enterFullAddress: false,
    };
  },
  mounted() {
    if (
      this.address.address1 ||
      this.address.address2 ||
      this.address.address3 ||
      this.address.city ||
      this.address.postCode
    ) {
      this.mapPropsToState();
      this.enterFullAddress = true;
    }
  },
  methods: {
    mapPropsToState() {
      this.address1 = this.address.address1;
      this.address2 = this.address.address2;
      this.address3 = this.address.address3;
      this.city = this.address.city;
      this.postCode = this.address.postCode;
      this.postCodeInput = "";
    },
    findAddress() {
      if (this.postCodeInput.length) {
        this.$axios
          .$get(
            `https://api.addressian.co.uk/v2/autocomplete/${this.postCodeInput}`,
            addressLookupHeaders
          )
          .then((response) => {
            response.sort(
              (a, b) => parseFloat(a.address) - parseFloat(b.address)
            );
            this.addressOptions = response;
            if (response.length) {
              this.showNoAddressesFoundError = false;
              this.addressDropDownVisible = true;
            } else {
              this.showNoAddressesFoundError = true;
              this.addressDropDownVisible = false;
            }
          })
          .catch(() => {
            this.showNoAddressesFoundError = true;
            this.addressDropDownVisible = false;
          });
      }
    },
    setAddress(option) {
      this.address1 = option.address[0];
      this.address2 = option.address[1];
      this.address3 = option.address[2];
      this.city = option.city;
      this.postCode = option.postcode;
      this.addressOptionsVisible = false;
      this.enterFullAddress = true;
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
  },
  validations: {
    address1: {
      required,
      maxLength: maxLength(100),
    },
    address2: {
      maxLength: maxLength(100),
    },
    address3: {
      maxLength: maxLength(100),
    },
    city: {
      required,
      maxLength: maxLength(100),
    },
    postCode: {
      required,
      isPostcode,
      maxLength: maxLength(100),
    },
  },
};
</script>

<style lang="scss">
.post-code-input {
  width: 140px;
}
.link {
  color: $dbw-green;
  &:hover {
    cursor: pointer;
  }
}
.error {
  font-size: 80%;
  color: #dc003e;
}
</style>
