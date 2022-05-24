import { FormControl, FormLabel, makeStyles } from "@material-ui/core";
import React from "react";
import api from "../reports/api";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ScreenWithAppBar from "../common/components/ScreenWithAppBar";
import { getOperationalModules, getUploadStatuses } from "./reducers";
import JobStatus from "./JobStatus";
import Paper from "@material-ui/core/Paper";
import _ from "lodash";
import Box from "@material-ui/core/Box";
import ReportTypes, { reportTypes } from "./ReportTypes";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "../dataEntryApp/components/Radio";
import { DocumentationContainer } from "../common/components/DocumentationContainer";
import AddressLevelsByType from "../common/components/AddressLevelsByType";
import { reportSideBarOptions } from "./Common";
import { applicableOptions, ExportReducer, initialState } from "./ExportReducer";
import { RegistrationType } from "./components/export/RegistrationType";
import { EnrolmentType } from "./components/export/EnrolmentType";
import { EncounterType } from "./components/export/EncounterType";
import { GroupSubjectType } from "./components/export/GroupSubjectType";

const useStyles = makeStyles(theme => ({
  root: {},
  button: {
    color: "#3f51b5"
  }
}));

const Export = ({
  operationalModules,
  getOperationalModules,
  getUploadStatuses,
  exportJobStatuses
}) => {
  const classes = useStyles();

  React.useEffect(() => {
    getOperationalModules();
  }, []);

  const [exportRequest, dispatchFun] = React.useReducer(ExportReducer, initialState);
  const [enableExport, setEnableExport] = React.useState(false);
  const {
    reportType,
    subjectType,
    program,
    encounterType,
    startDate,
    endDate,
    addressLevelIds,
    addressLevelError
  } = exportRequest;
  const dispatch = (type, payload) => dispatchFun({ type, payload });
  const subjectTypes = _.get(operationalModules, "subjectTypes");
  const { programOptions, encounterTypeOptions } = applicableOptions(
    operationalModules,
    exportRequest
  );

  const onStartExportHandler = async () => {
    const request = {
      subjectTypeUUID: subjectType.uuid,
      programUUID: program.uuid,
      encounterTypeUUID: encounterType.uuid,
      startDate: startDate.setHours(0, 0, 0, 0),
      endDate: endDate.setHours(23, 59, 59, 999),
      reportType: ReportTypes.getCode(reportType.name),
      addressLevelIds: addressLevelIds,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    const [ok, error] = await api.startExportJob(request);
    if (!ok && error) {
      alert(error);
    }
    setTimeout(() => getUploadStatuses(0), 1000);
  };

  const renderAddressLevel = () => {
    return (
      <Grid container direction={"row"}>
        <Grid item xs={12}>
          <AddressLevelsByType
            addressLevelsIds={addressLevelIds}
            setAddressLevelsIds={ids => dispatch("addressLevelIds", ids)}
            setError={error => dispatch("AddressLevelError", error)}
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{ color: "red", marginBottom: "10px" }}>{addressLevelError}</div>
        </Grid>
      </Grid>
    );
  };

  const onReportTypeChange = type => {
    dispatch("reportType", type);
    setEnableExport(false);
  };

  const RenderReportTypes = () => {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Report Type</FormLabel>
        <FormGroup row>
          {ReportTypes.names.map(type => (
            <FormControlLabel
              key={type.name}
              control={
                <Radio
                  checked={type.name === reportType.name}
                  onChange={() => onReportTypeChange(type)}
                  value={type.name}
                />
              }
              label={type.name}
            />
          ))}
        </FormGroup>
      </FormControl>
    );
  };

  const commonProps = { dispatch, startDate, endDate, subjectType, subjectTypes, setEnableExport };
  const reportTypeMap = {
    [reportTypes.Registration]: <RegistrationType {...commonProps} />,
    [reportTypes.Enrolment]: (
      <EnrolmentType {...commonProps} programOptions={programOptions} program={program} />
    ),
    [reportTypes.Encounter]: (
      <EncounterType
        {...commonProps}
        programOptions={programOptions}
        program={program}
        encounterTypeOptions={encounterTypeOptions}
        encounterType={encounterType}
      />
    ),
    [reportTypes.GroupSubject]: <GroupSubjectType {...commonProps} />
  };

  const renderReportTypeOptions = () => {
    return reportType.name ? reportTypeMap[reportType.name] : <React.Fragment />;
  };

  return (
    <ScreenWithAppBar
      appbarTitle={`Longitudinal Export`}
      enableLeftMenuButton={true}
      sidebarOptions={reportSideBarOptions}
    >
      {operationalModules && (
        <div>
          <Box border={1} mb={2} borderColor={"#ddd"} p={2}>
            <DocumentationContainer filename={"Report.md"}>
              <Grid>
                {RenderReportTypes()}
                {renderReportTypeOptions()}
                {!_.isEmpty(reportType.name) && renderAddressLevel()}
              </Grid>
              <Grid container direction="row" justify="flex-start">
                <Button
                  variant="contained"
                  color="primary"
                  aria-haspopup="false"
                  onClick={onStartExportHandler}
                  disabled={!enableExport}
                  className={classes.item}
                >
                  Generate Export
                </Button>
              </Grid>
            </DocumentationContainer>
          </Box>
          <Grid item>
            <Paper style={{ marginBottom: 100 }}>
              <JobStatus
                exportJobStatuses={exportJobStatuses}
                operationalModules={operationalModules}
              />
            </Paper>
          </Grid>
        </div>
      )}
    </ScreenWithAppBar>
  );
};

const mapStateToProps = state => ({
  operationalModules: state.reports.operationalModules,
  exportJobStatuses: state.reports.exportJobStatuses
});

export default withRouter(
  connect(
    mapStateToProps,
    { getOperationalModules, getUploadStatuses }
  )(Export)
);
