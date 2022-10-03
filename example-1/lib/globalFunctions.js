// reformat ISO date as dd-mm-yyyy
export function formatDate(ISODate) {
  const d = ISODate.split(/[-.T :]/);
  const newDate = `${d[2]}-${d[1]}-${d[0]}`;
  return newDate;
}

// find day, month, or year from ISO date
export function findDateValue(ISODate, value) {
  const d = ISODate.split(/[-.T :]/);
  let index;
  if (value === "day") index = 2;
  if (value === "month") index = 1;
  if (value === "year") index = 0;
  return d[index];
}

// find boolean from boolean string
export function findBoolean(value) {
  let boolean = null;
  if (value === "True") boolean = true;
  if (value === "False") boolean = false;
  return boolean;
}

// find boolean string from boolean
export function findBooleanString(value) {
  let booleanString = "Unassigned";
  if (value === true) booleanString = "True";
  if (value === false) booleanString = "False";
  return booleanString;
}

function formatAllCapsName(string) {
  return string.charAt(0) + string.substr(1).replace(/\s+/g, "-").toLowerCase();
}

// format first and last name of directors returned from companies house api
export function formatCHAPIDirectorName(name) {
  const n = name.split(/[,]/);
  const firstNames = n[1].split(/[ ]/);
  const lastNames = n[0].split(/[ -]/);
  const firstName = firstNames[1];
  const lastName = `${formatAllCapsName(lastNames[0])}${
    lastNames[1] ? `-${formatAllCapsName(lastNames[1])}` : ""
  }`;
  return { firstName, lastName };
}

export function numberWithCommas(number) {
  if (number < 1000) return number;
  else return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function findMonth(date) {
  const d = date.split(/[-.T :]/);
  return d[1];
}

export function findYear(date) {
  const d = date.split(/[-.T :]/);
  return d[0];
}
