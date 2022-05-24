import { filter, find, get, isEmpty, isFinite, isNil, map, some, startCase } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import {
  ArrayInput,
  AutocompleteArrayInput,
  Create,
  Datagrid,
  DisabledInput,
  Edit,
  EditButton,
  FormDataConsumer,
  FunctionField,
  List,
  REDUX_FORM_NAME,
  ReferenceArrayField,
  ReferenceArrayInput,
  ReferenceField,
  ReferenceInput,
  required,
  SelectInput,
  Show,
  SimpleForm,
  SimpleFormIterator,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  TextInput
} from "react-admin";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import { change } from "redux-form";
import { CatchmentSelectInput } from "./components/CatchmentSelectInput";
import { LineBreak } from "../common/components/utils";
import { datePickerModes, localeChoices, timePickerModes } from "../common/constants";
import EnableDisableButton from "./components/EnableDisableButton";
import http from "common/utils/httpClient";
import {
  CustomToolbar,
  formatRoles,
  isRequired,
  mobileNumberFormatter,
  mobileNumberParser,
  UserFilter,
  UserTitle,
  validateEmail,
  validatePassword,
  validatePasswords,
  validatePhone
} from "./UserHelper";
import { DocumentationContainer } from "../common/components/DocumentationContainer";
import { ToolTipContainer } from "../common/components/ToolTipContainer";
import { AvniTextInput } from "./components/AvniTextInput";
import { AvniBooleanInput } from "./components/AvniBooleanInput";
import { AvniRadioButtonGroupInput } from "../common/components/AvniRadioButtonGroupInput";
import { Paper } from "@material-ui/core";
import { createdAudit, modifiedAudit } from "./components/AuditUtil";
import ResetPasswordButton from "./components/ResetPasswordButton";
import { AvniPasswordInput } from "./components/AvniPasswordInput";
import { TitleChip } from "./components/TitleChip";
import Chip from "@material-ui/core/Chip";

export const UserCreate = ({ user, organisation, ...props }) => (
  <Paper>
    <DocumentationContainer filename={"User.md"}>
      <Create {...props}>
        <UserForm user={user} nameSuffix={organisation.usernameSuffix} />
      </Create>
    </DocumentationContainer>
  </Paper>
);

export const UserEdit = ({ user, ...props }) => (
  <Edit {...props} title={<UserTitle titlePrefix="Edit" />} undoable={false}>
    <UserForm edit user={user} />
  </Edit>
);

export const UserList = ({ organisation, ...props }) => (
  <List
    {...props}
    bulkActions={false}
    filter={{ organisationId: organisation.id }}
    filters={<UserFilter />}
    title={`${organisation.name} Users`}
  >
    <Datagrid rowClick="show">
      <TextField label="Login ID" source="username" />
      <TextField source="name" label="Name of the Person" />
      <ReferenceField
        label="Catchment"
        source="catchmentId"
        reference="catchment"
        linkType="show"
        allowEmpty
      >
        <TextField source="name" />
      </ReferenceField>
      <FunctionField label="Role" render={user => formatRoles(user.roles)} />
      <TextField source="email" label="Email Address" />
      <TextField source="phoneNumber" label="Phone Number" />
      <FunctionField
        label="Status"
        render={user =>
          user.voided === true ? "Deleted" : user.disabledInCognito === true ? "Disabled" : "Active"
        }
      />
    </Datagrid>
  </List>
);

const isAdminAndLoggedIn = (loggedInUser, selectedUser) =>
  loggedInUser && loggedInUser.orgAdmin && loggedInUser.username === selectedUser.username;

const CustomShowActions = ({ user, basePath, data, resource }) => {
  return (
    (data && (
      <CardActions style={{ zIndex: 2, display: "flex", float: "right", flexDirection: "row" }}>
        <EditButton label="Edit User" basePath={basePath} record={data} />
        {isAdminAndLoggedIn(data, user) ? null : (
          <Fragment>
            <ResetPasswordButton basePath={basePath} record={data} resource={resource} />
            <EnableDisableButton
              disabled={data.disabledInCognito}
              basePath={basePath}
              record={data}
              resource={resource}
            />
          </Fragment>
        )}
        {/*Commenting out delete user functionality as it is not required as of now
            <DeleteButton basePath={basePath} record={data}
                          label="Delete User" undoable={false}
                          redirect={basePath} resource={resource}/>*/}
      </CardActions>
    )) ||
    null
  );
};

const formatOperatingScope = opScope => opScope && opScope.replace(/^By/, "");

const formatLang = lang =>
  localeChoices
    .filter(local => local.id === lang)
    .map(lang => lang.name)
    .join("");

const ConceptSyncAttributeShow = ({
  syncAttributesData,
  title,
  property,
  conceptProperty,
  ...props
}) => {
  const syncSettings = get(props.record, "syncSettings", {});
  const conceptUUID = get(syncSettings, conceptProperty);
  if (isEmpty(conceptUUID)) return null;
  const isCoded =
    get(find(syncAttributesData[conceptProperty], sad => sad.id === conceptUUID), "dataType") ===
    "Coded";
  return (
    <Fragment>
      <span style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "12px" }}>{title}</span>
      <p />
      {isCoded ? (
        <ReferenceArrayField {...props} reference="concept" source={`syncSettings.${property}`}>
          <SingleFieldList linkType={false}>
            <TitleChip source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
      ) : (
        map(get(syncSettings, property, []), value => <Chip label={value} />)
      )}
    </Fragment>
  );
};

export const UserDetail = ({ user, ...props }) => {
  const [syncAttributesData, setSyncAttributesData] = useState(initialSyncAttributes);
  fetchSyncAttributeData(setSyncAttributesData);

  return (
    <Show title={<UserTitle />} actions={<CustomShowActions user={user} />} {...props}>
      <SimpleShowLayout>
        <TextField source="username" label="Login ID (username)" />
        <TextField source="name" label="Name of the Person" />
        <TextField source="email" label="Email Address" />
        <TextField source="phoneNumber" label="Phone Number" />
        <ReferenceField
          label="Catchment"
          source="catchmentId"
          reference="catchment"
          linkType="show"
          allowEmpty
        >
          <TextField source="name" />
        </ReferenceField>
        <FunctionField label="Role" render={user => formatRoles(user.roles)} />
        <FunctionField
          label="Operating Scope"
          render={user => formatOperatingScope(user.operatingIndividualScope)}
        />
        <LineBreak />
        <ConceptSyncAttributeShow
          {...props}
          title={"Sync concept 1 values"}
          property={`syncConcept1Values`}
          conceptProperty={`syncConcept1`}
          syncAttributesData={syncAttributesData}
        />
        <LineBreak />
        <ConceptSyncAttributeShow
          {...props}
          title={"Sync concept 2 values"}
          property={`syncConcept2Values`}
          conceptProperty={`syncConcept2`}
          syncAttributesData={syncAttributesData}
        />
        <ReferenceArrayField
          label={"Direct assignment"}
          reference="individual"
          source={`directAssignmentIds`}
        >
          <SingleFieldList linkType={false}>
            <TitleChip source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
        <FunctionField
          label="Preferred Language"
          render={user => (!isNil(user.settings) ? formatLang(user.settings.locale) : "")}
        />
        <FunctionField
          label="Date Picker Mode"
          render={user => (!isNil(user.settings) ? user.settings.datePickerMode : "Calendar")}
        />
        <FunctionField
          label="Time Picker Mode"
          render={user => (!isNil(user.settings) ? user.settings.timePickerMode : "Clock")}
        />
        <FunctionField
          label="Track Location"
          render={user =>
            !isNil(user.settings) ? (user.settings.trackLocation ? "True" : "False") : ""
          }
        />
        <FunctionField
          label="Beneficiary Mode"
          render={user =>
            !isNil(user.settings) ? (user.settings.showBeneficiaryMode ? "True" : "False") : ""
          }
        />
        <FunctionField
          label="Disable dashboard auto refresh"
          render={user =>
            !isNil(user.settings) ? (user.settings.disableAutoRefresh ? "True" : "False") : ""
          }
        />
        <FunctionField
          label="Register + Enrol"
          render={user =>
            !isNil(user.settings) ? (user.settings.registerEnrol ? "True" : "False") : ""
          }
        />
        <TextField label="Identifier prefix" source="settings.idPrefix" />
        <FunctionField label="Created" render={audit => createdAudit(audit)} />
        <FunctionField label="Modified" render={audit => modifiedAudit(audit)} />
      </SimpleShowLayout>
    </Show>
  );
};

const operatingScopes = Object.freeze({
  NONE: "None",
  FACILITY: "ByFacility",
  CATCHMENT: "ByCatchment"
});

const catchmentChangeMessage = `Please ensure that the user has already synced all 
data for their previous sync attributes, and has deleted all local data from their app`;

const ConceptSyncAttribute = ({ syncAttributesData, syncAttributeName, edit, ...props }) =>
  syncAttributesData[syncAttributeName].length > 0 && (
    <FormDataConsumer>
      {({ formData, dispatch, ...rest }) => {
        //TODO : workaround for the bug https://github.com/marmelab/react-admin/issues/3249
        //TODO : this should be removed after react-admin upgrade
        const syncConceptAttributeValues = get(
          formData,
          `syncSettings.${syncAttributeName}Values`,
          []
        );
        const syncAttributeConceptUUID = get(formData, `syncSettings.${syncAttributeName}`);
        const syncAttributeConcept = find(
          syncAttributesData[syncAttributeName],
          c => c.id === syncAttributeConceptUUID
        );
        const selectedValue = get(formData, `syncSettings.${syncAttributeName}`);
        const defaultValue = selectedValue ? { defaultValue: selectedValue } : {};

        if (some(syncConceptAttributeValues, v => typeof v === "object")) {
          dispatch(
            change(
              REDUX_FORM_NAME,
              `syncSettings.${syncAttributeName}Values`,
              map(syncConceptAttributeValues, v => (typeof v === "object" ? undefined : v))
            )
          );
        }
        return (
          <Fragment>
            <SelectInput
              resettable
              source={`syncSettings.${syncAttributeName}`}
              label={startCase(syncAttributeName)}
              choices={syncAttributesData[syncAttributeName]}
              onChange={(e, newVal) => {
                if (edit && newVal !== syncAttributeConceptUUID) {
                  alert(catchmentChangeMessage);
                  dispatch(change(REDUX_FORM_NAME, `syncSettings.${syncAttributeName}Values`, []));
                }
              }}
              {...defaultValue}
            />
            {!isEmpty(syncAttributeConceptUUID) ? (
              get(syncAttributeConcept, "dataType") === "Coded" ? (
                <ReferenceArrayInput
                  resettable
                  source={`syncSettings.${syncAttributeName}Values`}
                  reference="concept"
                  label={`${startCase(syncAttributeName)} Values`}
                  filterToQuery={searchText => ({ conceptUUID: syncAttributeConceptUUID })}
                  validate={required("Please provide the concept value")}
                  {...rest}
                >
                  <AutocompleteArrayInput resettable />
                </ReferenceArrayInput>
              ) : (
                <Fragment>
                  <div style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "12px", marginTop: "5px" }}>
                    {"Values to sync"}
                  </div>
                  <ArrayInput
                    source={`syncSettings.${syncAttributeName}Values`}
                    label={""}
                    resettable
                  >
                    <SimpleFormIterator>
                      <TextInput
                        label={`${startCase(syncAttributeName)} Value`}
                        validate={isRequired}
                      />
                    </SimpleFormIterator>
                  </ArrayInput>
                </Fragment>
              )
            ) : null}
          </Fragment>
        );
      }}
    </FormDataConsumer>
  );

const initialSyncAttributes = { syncConcept1: [], syncConcept2: [] };

function fetchSyncAttributeData(setSyncAttributesData) {
  useEffect(() => {
    http.get("/subjectType/syncAttributesData").then(res => {
      const {
        syncConcept1,
        syncConcept2,
        isAnySubjectTypeDirectlyAssignable,
        isAnySubjectTypeSyncByLocation
      } = res.data;
      setSyncAttributesData({
        syncConcept1,
        syncConcept2,
        isAnySubjectTypeDirectlyAssignable,
        isAnySubjectTypeSyncByLocation
      });
    });
  }, []);
}

const UserForm = ({ edit, user, nameSuffix, ...props }) => {
  const [languages, setLanguages] = useState([]);
  const [syncAttributesData, setSyncAttributesData] = useState(initialSyncAttributes);
  const isSyncSettingsRequired =
    syncAttributesData.syncConcept1.length > 0 ||
    syncAttributesData.syncConcept2.length > 0 ||
    syncAttributesData.isAnySubjectTypeDirectlyAssignable;

  useEffect(() => {
    http.get("/organisationConfig").then(res => {
      const organisationLocales = isEmpty(res.data._embedded.organisationConfig)
        ? [localeChoices[0]]
        : filter(localeChoices, l =>
            res.data._embedded.organisationConfig[0].settings.languages.includes(l.id)
          );
      setLanguages(organisationLocales);
    });
  }, []);

  fetchSyncAttributeData(setSyncAttributesData);

  const sanitizeProps = ({ record, resource, save }) => ({
    record,
    resource,
    save
  });
  return (
    <SimpleForm
      toolbar={<CustomToolbar />}
      {...sanitizeProps(props)}
      redirect="show"
      validate={validatePasswords}
    >
      {edit ? (
        <DisabledInput source="username" label="Login ID (username)" />
      ) : (
        <FormDataConsumer>
          {({ formData, dispatch, ...rest }) => {
            return (
              <Fragment>
                <AvniTextInput
                  resettable
                  source="ignored"
                  validate={isRequired}
                  label={"Login ID (username)"}
                  onChange={(e, newVal) =>
                    !isEmpty(newVal) &&
                    dispatch(change(REDUX_FORM_NAME, "username", newVal + "@" + nameSuffix))
                  }
                  {...rest}
                  toolTipKey={"ADMIN_USER_USER_NAME"}
                >
                  <span>@{nameSuffix}</span>
                </AvniTextInput>
                {formData.username && (
                  <AvniBooleanInput
                    source={"customPassword"}
                    style={{ marginTop: "1em" }}
                    label={
                      'Set a custom password. If custom password is not set temporary password will be "password".'
                    }
                    onChange={(e, newVal) => {
                      if (!isNil(newVal)) {
                        dispatch(change(REDUX_FORM_NAME, "customPassword", newVal));
                        dispatch(change(REDUX_FORM_NAME, "password", null));
                        dispatch(change(REDUX_FORM_NAME, "confirmPassword", null));
                      }
                    }}
                    {...rest}
                    toolTipKey={"ADMIN_USER_SET_PASSWORD"}
                  />
                )}
                {formData.customPassword && (
                  <Fragment>
                    <AvniPasswordInput
                      resettable
                      source="password"
                      label="Custom password"
                      validate={validatePassword}
                      toolTipKey={"ADMIN_USER_CUSTOM_PASSWORD"}
                    />
                    <AvniPasswordInput
                      resettable
                      source="confirmPassword"
                      label="Verify password"
                      validate={isRequired}
                      toolTipKey={"ADMIN_USER_CUSTOM_PASSWORD"}
                    />
                  </Fragment>
                )}
              </Fragment>
            );
          }}
        </FormDataConsumer>
      )}
      <AvniTextInput
        source="name"
        label="Name of the Person"
        validate={isRequired}
        toolTipKey={"ADMIN_USER_NAME"}
      />
      <AvniTextInput
        source="email"
        label="Email Address"
        validate={validateEmail}
        toolTipKey={"ADMIN_USER_EMAIL"}
        multiline
      />

      <AvniTextInput
        source="phoneNumber"
        label="10 digit mobile number"
        validate={validatePhone}
        format={mobileNumberFormatter}
        parse={mobileNumberParser}
        toolTipKey={"ADMIN_USER_PHONE_NUMBER"}
      />
      <FormDataConsumer>
        {({ formData, dispatch, ...rest }) =>
          isAdminAndLoggedIn(props.record, user) ? null : (
            <AvniBooleanInput
              source="orgAdmin"
              style={{ marginTop: "3em", marginBottom: "2em" }}
              label="Make this user an administrator (user will be able to make organisation wide changes)"
              onChange={(e, newVal) => {
                if (newVal) {
                  dispatch(change(REDUX_FORM_NAME, "catchmentId", null));
                  dispatch(
                    change(REDUX_FORM_NAME, "operatingIndividualScope", operatingScopes.NONE)
                  );
                }
              }}
              {...rest}
              toolTipKey={"ADMIN_USER_ORG_ADMIN"}
            />
          )
        }
      </FormDataConsumer>
      <LineBreak />
      <FormDataConsumer>
        {({ formData, dispatch, ...rest }) => (
          <Fragment>
            <ToolTipContainer toolTipKey={"ADMIN_USER_CATCHMENT"} alignItems={"center"}>
              <Typography variant="title" component="h3">
                Catchment
              </Typography>
            </ToolTipContainer>
            <ReferenceInput
              source="catchmentId"
              reference="catchment"
              label="Which catchment?"
              filterToQuery={searchText => ({ name: searchText })}
              validate={
                syncAttributesData.isAnySubjectTypeSyncByLocation &&
                !formData.orgAdmin &&
                required("Please select a catchment")
              }
              onChange={(e, newVal) => {
                if (edit) alert(catchmentChangeMessage);
                dispatch(
                  change(
                    REDUX_FORM_NAME,
                    "operatingIndividualScope",
                    isFinite(newVal) ? operatingScopes.CATCHMENT : operatingScopes.NONE
                  )
                );
              }}
              {...rest}
            >
              <CatchmentSelectInput source="name" resettable />
            </ReferenceInput>
            <LineBreak num={3} />
          </Fragment>
        )}
      </FormDataConsumer>
      <DisabledInput
        source="operatingIndividualScope"
        defaultValue={operatingScopes.NONE}
        style={{ display: "none" }}
      />
      <Fragment>
        <ToolTipContainer toolTipKey={"ADMIN_USER_SETTINGS"} alignItems={"center"}>
          <Typography variant="title" component="h3">
            Settings
          </Typography>
        </ToolTipContainer>
        <SelectInput source="settings.locale" label="Preferred Language" choices={languages} />
        <AvniBooleanInput
          source="settings.trackLocation"
          label="Track location"
          toolTipKey={"ADMIN_USER_SETTINGS_TRACK_LOCATION"}
        />
        <AvniBooleanInput
          source="settings.showBeneficiaryMode"
          label="Beneficiary mode"
          toolTipKey={"ADMIN_USER_SETTINGS_BENEFICIARY_MODE"}
        />
        <AvniBooleanInput
          source="settings.disableAutoRefresh"
          label="Disable dashboard auto refresh"
          toolTipKey={"ADMIN_USER_SETTINGS_DISABLE_AUTO_REFRESH"}
        />
        <AvniBooleanInput
          source="settings.registerEnrol"
          label="Register + Enrol"
          toolTipKey={"ADMIN_USER_SETTINGS_REGISTER_ENROL"}
        />
        <AvniTextInput
          source="settings.idPrefix"
          label="Identifier prefix"
          toolTipKey={"ADMIN_USER_SETTINGS_IDENTIFIER_PREFIX"}
        />
        <br />
        <AvniRadioButtonGroupInput
          source="settings.datePickerMode"
          label="Date picker mode"
          choices={datePickerModes}
          toolTipKey={"ADMIN_USER_SETTINGS_DATE_PICKER_MODE"}
        />
        <br />
        <AvniRadioButtonGroupInput
          source="settings.timePickerMode"
          label="Time picker mode"
          choices={timePickerModes}
          toolTipKey={"ADMIN_USER_SETTINGS_TIME_PICKER_MODE"}
        />
        {isSyncSettingsRequired && (
          <div>
            <LineBreak />
            <ToolTipContainer toolTipKey={"ADMIN_SYNC_SETTINGS"} alignItems={"center"}>
              <Typography variant="title" component="h3">
                Sync Settings
              </Typography>
            </ToolTipContainer>
            <ConceptSyncAttribute
              syncAttributesData={syncAttributesData}
              syncAttributeName={"syncConcept1"}
              edit={edit}
            />
            <LineBreak />
            <ConceptSyncAttribute
              syncAttributesData={syncAttributesData}
              syncAttributeName={"syncConcept2"}
              edit={edit}
            />
            <LineBreak />
            {syncAttributesData.isAnySubjectTypeDirectlyAssignable && (
              <ReferenceArrayInput
                reference="individual"
                source="directAssignmentIds"
                label="Subjects to sync"
                filterToQuery={searchText => ({ name: searchText })}
              >
                <AutocompleteArrayInput resettable />
              </ReferenceArrayInput>
            )}
          </div>
        )}
      </Fragment>
    </SimpleForm>
  );
};
