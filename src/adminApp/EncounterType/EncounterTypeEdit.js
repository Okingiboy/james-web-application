import React, { useEffect, useReducer, useState } from "react";
import http from "common/utils/httpClient";
import { Redirect } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { Title } from "react-admin";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import { encounterTypeInitialState } from "../Constant";
import { encounterTypeReducer } from "../Reducers";
import MenuItem from "@material-ui/core/MenuItem";
import _ from "lodash";
import {
  findEncounterCancellationForms,
  findEncounterForms,
  findProgramEncounterCancellationForm,
  findProgramEncounterCancellationForms,
  findProgramEncounterForm,
  findProgramEncounterForms
} from "../domain/formMapping";
import { SaveComponent } from "../../common/components/SaveComponent";
import { AvniTextField } from "../../common/components/AvniTextField";
import { AvniSelect } from "../../common/components/AvniSelect";
import { AvniSelectForm } from "../../common/components/AvniSelectForm";
import { AvniFormLabel } from "../../common/components/AvniFormLabel";
import { AvniSwitch } from "../../common/components/AvniSwitch";
import { sampleEncounterEligibilityCheckRule } from "../../formDesigner/common/SampleRule";
import { confirmBeforeRuleEdit, validateRule } from "../../formDesigner/util";
import RuleDesigner from "../../formDesigner/components/DeclarativeRule/RuleDesigner";

const EncounterTypeEdit = props => {
  const [encounterType, dispatch] = useReducer(encounterTypeReducer, encounterTypeInitialState);
  const [nameValidation, setNameValidation] = useState(false);
  const [error, setError] = useState("");
  const [redirectShow, setRedirectShow] = useState(false);
  const [encounterTypeData, setEncounterTypeData] = useState({});
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [subjectT, setSubjectT] = useState({});
  const [subjectType, setSubjectType] = useState([]);
  const [programT, setProgramT] = useState({});
  const [program, setProgram] = useState([]);
  const [formList, setFormList] = useState([]);
  const [subjectValidation, setSubjectValidation] = useState(false);
  const [ruleValidationError, setRuleValidationError] = useState();

  useEffect(() => {
    http
      .get("/web/encounterType/" + props.match.params.id)
      .then(response => response.data)
      .then(result => {
        setEncounterTypeData(result);
        dispatch({ type: "setData", payload: result });
        http
          .get("/web/operationalModules")
          .then(response => {
            const formMap = response.data.formMappings;
            formMap.map(l => (l["isVoided"] = false));
            setFormList(response.data.forms);
            setSubjectType(response.data.subjectTypes);
            setProgram(response.data.programs);
            const temp = response.data.formMappings.filter(
              l => l.encounterTypeUUID === result.uuid
            );

            setSubjectT(
              response.data.subjectTypes.filter(l => l.uuid === temp[0].subjectTypeUUID)[0]
            );
            setProgramT(response.data.programs.filter(l => l.uuid === temp[0].programUUID)[0]);

            setSubjectT(
              response.data.subjectTypes.filter(l => l.uuid === temp[0].subjectTypeUUID)[0]
            );

            const form = findProgramEncounterForm(formMap, result);
            dispatch({ type: "programEncounterForm", payload: form });

            const cancellationForm = findProgramEncounterCancellationForm(formMap, result);
            dispatch({ type: "programEncounterCancellationForm", payload: cancellationForm });
          })
          .catch(error => {});
      });
  }, []);

  const onSubmit = () => {
    let hasError = false;
    if (encounterType.name.trim() === "") {
      setNameValidation(true);
      hasError = true;
    }

    if (_.isEmpty(subjectT)) {
      setSubjectValidation(true);
      hasError = true;
    }
    const { jsCode, validationError } = validateRule(
      encounterType.encounterEligibilityCheckDeclarativeRule,
      holder => holder.generateEligibilityRule()
    );
    if (!_.isEmpty(validationError)) {
      hasError = true;
      setRuleValidationError(validationError);
    } else if (!_.isEmpty(jsCode)) {
      encounterType.encounterEligibilityCheckRule = jsCode;
    }
    if (hasError) {
      return;
    }

    setNameValidation(false);
    setSubjectValidation(false);

    http
      .put("/web/encounterType/" + props.match.params.id, {
        name: encounterType.name,
        encounterEligibilityCheckRule: encounterType.encounterEligibilityCheckRule,
        encounterEligibilityCheckDeclarativeRule:
          encounterType.encounterEligibilityCheckDeclarativeRule,
        id: props.match.params.id,
        subjectTypeUuid: subjectT.uuid,
        active: encounterType.active,
        programEncounterFormUuid: _.get(encounterType, "programEncounterForm.formUUID"),
        programEncounterCancelFormUuid: _.get(
          encounterType,
          "programEncounterCancellationForm.formUUID"
        ),
        programUuid: _.get(programT, "uuid"),
        voided: encounterTypeData.voided
      })
      .then(response => {
        if (response.status === 200) {
          setError("");
          setRedirectShow(true);
        }
      });
  };

  const onDelete = () => {
    if (window.confirm("Do you really want to delete encounter type?")) {
      http
        .delete("/web/encounterType/" + props.match.params.id)
        .then(response => {
          if (response.status === 200) {
            setDeleteAlert(true);
          }
        })
        .catch(error => {});
    }
  };

  function getCancellationForms() {
    return _.isEmpty(programT)
      ? findEncounterCancellationForms(formList)
      : findProgramEncounterCancellationForms(formList);
  }

  function getEncounterForms() {
    return _.isEmpty(programT) ? findEncounterForms(formList) : findProgramEncounterForms(formList);
  }

  function resetValue(type) {
    dispatch({
      type,
      payload: null
    });
  }

  function updateProgram(program) {
    setProgramT(program);
    const formType = _.get(encounterType, "programEncounterForm.formType");
    const cancelFormType = _.get(encounterType, "programEncounterCancellationForm.formType");

    if (_.isEmpty(programT)) {
      if (formType === "ProgramEncounter") {
        resetValue("programEncounterForm");
      }
      if (cancelFormType === "ProgramEncounterCancellation") {
        resetValue("programEncounterCancellationForm");
      }
    } else {
      if (formType === "Encounter") {
        resetValue("programEncounterForm");
      }
      if (cancelFormType === "IndividualEncounterCancellation") {
        resetValue("programEncounterCancellationForm");
      }
    }
  }

  return (
    <>
      <Box boxShadow={2} p={3} bgcolor="background.paper">
        <Title title={"Edit Encounter Type "} />
        <Grid container item={12} style={{ justifyContent: "flex-end" }}>
          <Button color="primary" type="button" onClick={() => setRedirectShow(true)}>
            <VisibilityIcon /> Show
          </Button>
        </Grid>
        <div className="container" style={{ float: "left" }}>
          <AvniTextField
            id="name"
            label="Name"
            autoComplete="off"
            value={encounterType.name}
            onChange={event => dispatch({ type: "name", payload: event.target.value })}
            toolTipKey={"APP_DESIGNER_ENCOUNTER_TYPE_NAME"}
          />
          <div />
          {nameValidation && (
            <FormLabel error style={{ marginTop: "10px", fontSize: "12px" }}>
              Empty name is not allowed.
            </FormLabel>
          )}
          {error !== "" && (
            <FormLabel error style={{ marginTop: "10px", fontSize: "12px" }}>
              {error}
            </FormLabel>
          )}
          <p />
          <AvniSelect
            label="Select subject type *"
            value={_.isEmpty(subjectT) ? "" : subjectT}
            onChange={event => setSubjectT(event.target.value)}
            style={{ width: "200px" }}
            required
            options={subjectType.map(option => (
              <MenuItem value={option} key={option.uuid}>
                {option.name}
              </MenuItem>
            ))}
            toolTipKey={"APP_DESIGNER_ENCOUNTER_TYPE_SUBJECT"}
          />
          <div />
          {subjectValidation && (
            <FormLabel error style={{ marginTop: "10px", fontSize: "12px" }}>
              Empty subject type is not allowed.
            </FormLabel>
          )}
          <p />
          <AvniSelect
            label="Select Program"
            value={_.isEmpty(programT) ? "" : programT}
            onChange={event => updateProgram(event.target.value)}
            style={{ width: "200px" }}
            required
            options={program.map(option => (
              <MenuItem value={option} key={option.uuid}>
                {option.name}
              </MenuItem>
            ))}
            toolTipKey={"APP_DESIGNER_ENCOUNTER_TYPE_PROGRAM"}
          />
          <p />
          <AvniSelectForm
            label={"Select Encounter Form"}
            value={_.get(encounterType, "programEncounterForm.formName")}
            onChange={selectedForm =>
              dispatch({
                type: "programEncounterForm",
                payload: selectedForm
              })
            }
            formList={getEncounterForms()}
            toolTipKey={"APP_DESIGNER_ENCOUNTER_TYPE_FORM"}
          />
          <p />
          <AvniSelectForm
            label={"Select Encounter Cancellation Form"}
            value={_.get(encounterType, "programEncounterCancellationForm.formName")}
            onChange={selectedForm =>
              dispatch({
                type: "programEncounterCancellationForm",
                payload: selectedForm
              })
            }
            formList={getCancellationForms()}
            toolTipKey={"APP_DESIGNER_ENCOUNTER_TYPE_CANCELLATION_FORM"}
          />
          <p />
          <AvniSwitch
            checked={encounterType.active ? true : false}
            onChange={event => dispatch({ type: "active", payload: event.target.checked })}
            name="Active"
            toolTipKey={"APP_DESIGNER_ENCOUNTER_TYPE_ACTIVE"}
          />
          <p />
          <AvniFormLabel
            label={"Encounter Eligibility Check Rule"}
            toolTipKey={"APP_DESIGNER_ENCOUNTER_TYPE_ELIGIBILITY_RULE"}
          />
          {encounterType.loaded && (
            <RuleDesigner
              rulesJson={encounterType.encounterEligibilityCheckDeclarativeRule}
              onValueChange={jsonData =>
                dispatch({
                  type: "encounterEligibilityCheckDeclarativeRule",
                  payload: jsonData
                })
              }
              updateJsCode={declarativeRuleHolder =>
                dispatch({
                  type: "encounterEligibilityCheckRule",
                  payload: declarativeRuleHolder.generateEligibilityRule()
                })
              }
              jsCode={encounterType.encounterEligibilityCheckRule}
              error={ruleValidationError}
              subjectType={subjectT}
              getApplicableActions={state => state.getApplicableEncounterEligibilityActions()}
              sampleRule={sampleEncounterEligibilityCheckRule()}
              onJsCodeChange={event => {
                confirmBeforeRuleEdit(
                  encounterType.encounterEligibilityCheckDeclarativeRule,
                  () => dispatch({ type: "encounterEligibilityCheckRule", payload: event }),
                  () =>
                    dispatch({ type: "encounterEligibilityCheckDeclarativeRule", payload: null })
                );
              }}
            />
          )}
          <p />
        </div>
        <Grid container item sm={12}>
          <Grid item sm={1}>
            <SaveComponent name="save" onSubmit={onSubmit} styleClass={{ marginLeft: "14px" }} />
          </Grid>
          <Grid item sm={11}>
            <Button style={{ float: "right", color: "red" }} onClick={() => onDelete()}>
              <DeleteIcon /> Delete
            </Button>
          </Grid>
        </Grid>
      </Box>
      {redirectShow && <Redirect to={`/appDesigner/encounterType/${props.match.params.id}/show`} />}
      {deleteAlert && <Redirect to="/appDesigner/encounterType" />}
    </>
  );
};

export default EncounterTypeEdit;
