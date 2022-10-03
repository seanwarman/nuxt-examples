/* eslint-disable no-lonely-if */
import _ from "lodash";
import { helpers } from "vuelidate/lib/validators";

export function validateForm(formObject, page) {
  formObject.$touch();
  const invalidField = _.findKey(
    formObject.$params,
    (value, key) => formObject[key].$invalid
  );
  if (invalidField) {
    const invalidFieldId = page.$refs[invalidField].id;
    document.getElementById(invalidFieldId).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }
  return invalidField;
}
export function validateRepeat(formObject, page) {
  formObject.$touch();
  const invalidField = _.findKey(
    formObject.$params,
    (value, key) => formObject[key].$invalid
  );
  if (invalidField) {
    if (_.isArray(page[invalidField])) {
      const invalidFieldIndex = _.findKey(
        formObject[invalidField].$each.$iter,
        (value) => value.$invalid
      );
      const invalidFieldName = _.findKey(
        formObject[invalidField].$each.$iter[invalidFieldIndex],
        (value) => value.$invalid
      );
      document
        .getElementById(`${invalidFieldName}-${invalidFieldIndex}`)
        .scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      return invalidFieldName;
    } else {
      document.getElementById(invalidField).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      return invalidField;
    }
  }
}
// TODO replace all uses of validateForm/validateRepeat with this all encompassing function
export function validateFormNew(page) {
  page.$v.$touch();
  // find invalid field
  const invalidField = _.findKey(
    page.$v.$params,
    (value, key) => page.$v[key].$invalid
  );
  if (!invalidField) return false;
  else {
    // if invalid field not array, scroll into view and return
    if (!_.isArray(page[invalidField])) {
      document.getElementById(invalidField).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      return true;
    } else {
      // find index of invalid array item
      const invalidArray = page.$v[invalidField].$each.$iter;
      const invalidArrayItemIndex = _.findKey(
        invalidArray,
        (value) => value.$invalid
      );
      // find invalid field in array item
      const invalidArrayItemField = _.findKey(
        invalidArray[invalidArrayItemIndex],
        (value) => value.$invalid
      );
      // if invalid array item field not itself an array, scroll into view and return
      if (
        !_.isArray(
          page[invalidField][invalidArrayItemIndex][invalidArrayItemField]
        )
      ) {
        document
          .getElementById(
            `${invalidField}-${invalidArrayItemIndex}-${invalidArrayItemField}`
          )
          .scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        return true;
      } else {
        // find index of invalid array item
        const invalidNestedArray =
          invalidArray[invalidArrayItemIndex][invalidArrayItemField].$each
            .$iter;
        const invalidNestedArrayItemIndex = _.findKey(
          invalidNestedArray,
          (value) => value.$invalid
        );
        // find invalid field in array item
        const invalidNestedArrayItemField = _.findKey(
          invalidNestedArray[invalidNestedArrayItemIndex],
          (value) => value.$invalid
        );
        // scroll invalid field into view and return
        document
          .getElementById(
            `${invalidField}-${invalidArrayItemIndex}-${invalidArrayItemField}-${invalidNestedArrayItemIndex}-${invalidNestedArrayItemField}`
          )
          .scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        return true;
      }
    }
  }
}

export function validateTable(formObject, page) {
  formObject.$touch();
  const invalidField = _.findKey(
    formObject.$params,
    (value, key) => formObject[key].$invalid
  );
  if (invalidField) {
    if (_.isArray(page[invalidField])) {
      const invalidParentIndex = _.findKey(
        formObject[invalidField].$each.$iter,
        (value) => value.$invalid
      );
      const invalidParentName = _.findKey(
        formObject[invalidField].$each.$iter[invalidParentIndex],
        (value) => value.$invalid
      );
      const invalidFieldIndex = _.findKey(
        formObject[invalidField].$each[invalidParentIndex][invalidParentName]
          .$each.$iter,
        (value) => value.$invalid
      );
      const invalidFieldName = _.findKey(
        formObject[invalidField].$each[invalidParentIndex][invalidParentName]
          .$each.$iter[invalidFieldIndex],
        (value) => value.$invalid
      );
      document
        .getElementById(
          `${invalidParentName}-${invalidParentIndex}-${invalidFieldName}-${invalidFieldIndex}`
        )
        .scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      return invalidFieldName;
    } else {
      document.getElementById(invalidField).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      return invalidField;
    }
  }
}

export function validateAddress(ref, isRepeat) {
  if (ref == null) {
    return;
  }
  let invalidField;
  if (isRepeat) {
    ref.forEach(function (item) {
      item.$v.$touch();
      invalidField = _.findKey(
        item.$v.$params,
        (value, key) => item.$v[key].$invalid
      );
      invalidField = `${invalidField}`;
    });
  } else {
    ref.$v.$touch();
    invalidField = _.findKey(
      ref.$v.$params,
      (value, key) => ref.$v[key].$invalid
    );
  }
  if (invalidField) {
    if (ref.enterFullAddress) {
      document
        .getElementById(
          `${invalidField}${ref.index === null ? "" : ref.index}${
            ref.type === null ? "" : ref.type
          }`
        )
        .scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      return invalidField;
    } else {
      ref.enterFullAddress = true;
      document
        .getElementById(
          `postCodeInput${ref.index === null ? "" : ref.index}${
            ref.type === null ? "" : ref.type
          }`
        )
        .scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      return invalidField;
    }
  }
}

export const isEmail = helpers.regex(
  "isEmail",
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/i
);

export const isName = helpers.regex(
  "isName",
  /^(([A-Za-z])+(([A-Za-z'-])([A-Za-z])+)*)$/
);

export const isPostcode = helpers.regex(
  "isPostcode",
  /(^[A-Za-z]{1,2}[0-9]{1,2})\s?([0-9][A-Za-z]{2}$)/i
);

export const isUrl = helpers.regex(
  "isUrl",
  /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
);

// allows numbers, spaces, +, (, and )
export const isPhoneNumber = helpers.regex("isPhoneNumber", /(^[ 0-9()+]+$)/);

// allows numbers between 1900 and 2099
export const isYear = helpers.regex("isYear", /(^19[0-9]{2}|20[0-9]{2}$)/);

// allows numbers 1 to 12 (with or without precending 0 on 1-9)
export const isMonth = helpers.regex("isMonth", /(^(0?[1-9]|1[0-2])$)/);

// allows numbers 1 to 31 (with or without precending 0 on 1-9)
export const isDay = helpers.regex(
  "isDay",
  /(^(0?[1-9]|1[0-9]|2[0-9]|3[0-1])$)/
);

export function isDateInPast(date) {
  const formattedDate = new Date(
    Date.parse(`${date.year}-${date.month}-${date.day}`)
  );
  return formattedDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
}

export function isDateInFuture(date) {
  const formattedDate = new Date(
    Date.parse(`${date.year}-${date.month}-${date.day}`)
  );
  return formattedDate.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);
}

export function isYearInPast(fieldDate) {
  new Date().getFullYear();
  return fieldDate < new Date().getFullYear();
}

export function isYearInFuture(fieldDate) {
  new Date().getFullYear();
  return fieldDate > new Date().getFullYear();
}

export function isAdult(birthDate) {
  const { year, month, day } = birthDate;
  const today = new Date();
  const birth = new Date(year, Number(month) - 1, day);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 18;
}

export function isTrue(fieldValue) {
  return fieldValue === true;
}

export function isAssigned(value) {
  return value !== "Unassigned";
}

export function isWholeNumber(value) {
  if (value % 1 === 0) return true;
  else return false;
}
