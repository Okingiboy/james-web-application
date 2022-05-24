import Types from "./SubjectType/Types";
import { default as UUID } from "uuid";
import { isEmpty, map } from "lodash";

export function programReducer(program, action) {
  switch (action.type) {
    case "name":
      return { ...program, name: action.payload };
    case "colour":
      return { ...program, colour: action.payload };
    case "active":
      return { ...program, active: action.payload };
    case "programSubjectLabel":
      return { ...program, programSubjectLabel: action.payload };
    case "enrolmentSummaryRule":
      return { ...program, enrolmentSummaryRule: action.payload };
    case "enrolmentEligibilityCheckRule":
      return { ...program, enrolmentEligibilityCheckRule: action.payload };
    case "enrolmentEligibilityCheckDeclarativeRule":
      return { ...program, enrolmentEligibilityCheckDeclarativeRule: action.payload };
    case "setLoaded":
      return { ...program, loaded: true };
    case "programEnrolmentForm":
      return { ...program, programEnrolmentForm: action.payload };
    case "programExitForm":
      return { ...program, programExitForm: action.payload };
    case "setData":
      return {
        ...program,
        name: action.payload.name,
        colour: action.payload.colour,
        programSubjectLabel: action.payload.programSubjectLabel,
        enrolmentSummaryRule: action.payload.enrolmentSummaryRule,
        enrolmentEligibilityCheckRule: action.payload.enrolmentEligibilityCheckRule,
        enrolmentEligibilityCheckDeclarativeRule:
          action.payload.enrolmentEligibilityCheckDeclarativeRule,
        active: action.payload.active,
        loaded: true
      };
    default:
      return program;
  }
}

export function encounterTypeReducer(encounterType, action) {
  switch (action.type) {
    case "name":
      return { ...encounterType, name: action.payload };
    case "active":
      return { ...encounterType, active: action.payload };
    case "encounterEligibilityCheckRule":
      return { ...encounterType, encounterEligibilityCheckRule: action.payload };
    case "programEncounterForm":
      return { ...encounterType, programEncounterForm: action.payload };
    case "programEncounterCancellationForm":
      return { ...encounterType, programEncounterCancellationForm: action.payload };
    case "encounterEligibilityCheckDeclarativeRule":
      return { ...encounterType, encounterEligibilityCheckDeclarativeRule: action.payload };
    case "setLoaded":
      return { ...encounterType, loaded: true };
    case "setData":
      return {
        ...encounterType,
        name: action.payload.name,
        encounterEligibilityCheckRule: action.payload.encounterEligibilityCheckRule,
        encounterEligibilityCheckDeclarativeRule:
          action.payload.encounterEligibilityCheckDeclarativeRule,
        active: action.payload.active,
        loaded: true
      };
    default:
      return encounterType;
  }
}

export function subjectTypeReducer(subjectType, action) {
  switch (action.type) {
    case "name":
      return { ...subjectType, name: action.payload };
    case "group":
      return { ...subjectType, group: action.payload.group, groupRoles: action.payload.groupRoles };
    case "household":
      return {
        ...subjectType,
        group: action.payload.group,
        household: action.payload.household,
        groupRoles: action.payload.groupRoles
      };
    case "groupRole":
      return { ...subjectType, groupRoles: action.payload };
    case "registrationForm":
      return { ...subjectType, registrationForm: action.payload };
    case "active":
      return { ...subjectType, active: action.payload };
    case "type":
      const type = action.payload;
      if (!Types.isGroup(type)) {
        return { ...subjectType, type, groupRoles: [] };
      }
      const groupRoles = Types.isHousehold(type) ? _getHouseholdRoles() : [];
      const memberSubjectType = Types.isHousehold(type)
        ? map(groupRoles, ({ subjectMemberName }) => subjectMemberName)[0]
        : "";
      return { ...subjectType, type, groupRoles, memberSubjectType };
    case "householdMemberSubject":
      const roles = map(
        subjectType.groupRoles,
        ({ groupRoleUUID, role, minimumNumberOfMembers, maximumNumberOfMembers }) => ({
          subjectMemberName: action.payload,
          groupRoleUUID,
          role,
          minimumNumberOfMembers,
          maximumNumberOfMembers
        })
      );
      return { ...subjectType, groupRoles: roles, memberSubjectType: action.payload };
    case "setData":
      return {
        ...subjectType,
        ...action.payload,
        memberSubjectType: Types.isHousehold(action.payload.type)
          ? map(action.payload.groupRoles, ({ subjectMemberName }) => subjectMemberName)[0]
          : ""
      };
    case "subjectSummaryRule":
      return { ...subjectType, subjectSummaryRule: action.payload };
    case "locationTypes":
      return { ...subjectType, locationTypeUUIDs: action.payload };
    case "allowEmptyLocation":
      return { ...subjectType, allowEmptyLocation: action.payload };
    case "allowProfilePicture":
      return { ...subjectType, allowProfilePicture: action.payload };
    case "uniqueName":
      return { ...subjectType, uniqueName: action.payload };
    case "validFirstNameRegex":
      return {
        ...subjectType,
        validFirstNameFormat: {
          ...subjectType.validFirstNameFormat,
          regex: _getNullOrValue(action.payload)
        }
      };
    case "validFirstNameDescriptionKey":
      return {
        ...subjectType,
        validFirstNameFormat: {
          ...subjectType.validFirstNameFormat,
          descriptionKey: _getNullOrValue(action.payload)
        }
      };
    case "validLastNameRegex":
      return {
        ...subjectType,
        validLastNameFormat: {
          ...subjectType.validLastNameFormat,
          regex: _getNullOrValue(action.payload)
        }
      };
    case "validLastNameDescriptionKey":
      return {
        ...subjectType,
        validLastNameFormat: {
          ...subjectType.validLastNameFormat,
          descriptionKey: _getNullOrValue(action.payload)
        }
      };
    case "syncAttribute":
      const { name, value } = action.payload;
      return {
        ...subjectType,
        [name]: value
      };
    case "nameHelpText":
      return {
        ...subjectType,
        nameHelpText: action.payload
      };
    default:
      return subjectType;
  }
}

const _getHouseholdRoles = () => {
  const roles = [];
  roles.push(_getRole("Head of household", 1, 1));
  roles.push(_getRole("Member", 1, 100));
  return roles;
};

const _getRole = (role, minimumNumberOfMembers, maximumNumberOfMembers) => ({
  groupRoleUUID: UUID.v4(),
  role,
  minimumNumberOfMembers,
  maximumNumberOfMembers
});

const _getNullOrValue = value => (isEmpty(value) ? null : value);
