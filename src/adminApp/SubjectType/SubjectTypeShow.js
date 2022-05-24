import React, { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import http from "common/utils/httpClient";
import { Redirect } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { Title } from "react-admin";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import _, { get } from "lodash";
import { GroupRoleShow } from "./GroupRoleShow";
import { findRegistrationForm } from "../domain/formMapping";
import { useFormMappings, useLocationType } from "./effects";
import { BooleanStatusInShow } from "../../common/components/BooleanStatusInShow";
import { Audit } from "../../formDesigner/components/Audit";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import { AdvancedSettingShow } from "./AdvancedSettingShow";

const SubjectTypeShow = props => {
  const [subjectType, setSubjectType] = useState({});
  const [editAlert, setEditAlert] = useState(false);
  const [formMappings, setFormMappings] = useState([]);
  const [locationTypes, setLocationsTypes] = useState([]);
  const [iconPreviewUrl, setIconPreviewUrl] = React.useState("");

  useFormMappings(setFormMappings);
  useLocationType(types => setLocationsTypes(types));
  useEffect(() => {
    http
      .get("/web/subjectType/" + props.match.params.id)
      .then(response => response.data)
      .then(result => {
        setSubjectType(result);
      });
  }, []);

  React.useEffect(() => {
    if (subjectType.iconFileS3Key != null) {
      http
        .get(http.withParams(`/media/signedUrl`, { url: subjectType.iconFileS3Key }))
        .then(res => res.data)
        .then(res => {
          setIconPreviewUrl(res);
        });
    }
  }, [subjectType.iconFileS3Key]);

  return (
    !_.isEmpty(subjectType) && (
      <>
        <Box boxShadow={2} p={3} bgcolor="background.paper">
          <Title title={"Subject Type: " + subjectType.name} />
          <Grid container item={12} style={{ justifyContent: "flex-end" }}>
            <Button color="primary" type="button" onClick={() => setEditAlert(true)}>
              <EditIcon />
              Edit
            </Button>
          </Grid>
          <div className="container" style={{ float: "left" }}>
            <div>
              <FormLabel style={{ fontSize: "13px" }}>Name</FormLabel>
              <br />
              <span style={{ fontSize: "15px" }}>{subjectType.name}</span>
            </div>
            <p />
            <div>
              <FormLabel style={{ fontSize: "13px" }}>Type</FormLabel>
              <br />
              <span style={{ fontSize: "15px" }}>{subjectType.type}</span>
            </div>
            <p />
            {iconPreviewUrl && (
              <div>
                <FormLabel style={{ fontSize: "13px" }}>{"Subject Type Icon"}</FormLabel>
                <br />
                <img src={iconPreviewUrl} alt="Icon Preview" />
              </div>
            )}
            <p />
            <BooleanStatusInShow status={subjectType.active} label={"Active"} />
            <p />
            <BooleanStatusInShow
              status={subjectType.allowProfilePicture}
              label={"Allow Profile Picture"}
            />
            <div>
              <FormLabel style={{ fontSize: "13px" }}>Registration Form</FormLabel>
              <br />
              <span style={{ fontSize: "15px" }}>
                <a
                  href={`#/appdesigner/forms/${get(
                    findRegistrationForm(formMappings, subjectType),
                    "formUUID"
                  )}`}
                >
                  {get(findRegistrationForm(formMappings, subjectType), "formName")}
                </a>
              </span>
            </div>
            <p />
            <div>
              <FormLabel style={{ fontSize: "13px" }}>Organisation Id</FormLabel>
              <br />
              <span style={{ fontSize: "15px" }}>{subjectType.organisationId}</span>
            </div>
            <p />
            <div>
              <FormLabel style={{ fontSize: "13px" }}>Subject Summary Rule</FormLabel>
              <br />
              <Editor
                readOnly
                value={subjectType.subjectSummaryRule || ""}
                highlight={code => highlight(code, languages.js)}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 15,
                  height: "auto",
                  borderStyle: "solid",
                  borderWidth: "1px"
                }}
              />
            </div>
            <p />
            {subjectType.group && <GroupRoleShow groupRoles={subjectType.groupRoles} />}
            <AdvancedSettingShow locationTypes={locationTypes} subjectType={subjectType} />
            <Audit {...subjectType} />
          </div>
          {editAlert && <Redirect to={"/appDesigner/subjectType/" + props.match.params.id} />}
        </Box>
      </>
    )
  );
};

export default SubjectTypeShow;
