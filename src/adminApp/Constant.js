export const programInitialState = {
  name: "",
  colour: "",
  programSubjectLabel: "",
  enrolmentSummaryRule: "",
  enrolmentEligibilityCheckRule: "",
  loaded: false
};

export const encounterTypeInitialState = {
  name: "",
  encounterEligibilityCheckRule: "",
  loaded: false
};

export const subjectTypeInitialState = {
  name: "",
  groupRoles: [],
  subjectSummaryRule: "",
  shouldSyncByLocation: true
};

export const colorPickerCSS = {
  boxShadow: "5px 10px 8px 10px #888888",
  border: "1px solid",
  backgroundColor: "#fff"
};
