import React from "react";
import MaterialTable from "material-table";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import api from "../api";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getGroupDashboards, getAllDashboards } from "../reducers";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import { RadioButtonUnchecked, RadioButtonChecked } from "@material-ui/icons";

const GroupDashboards = ({
  getGroupDashboards,
  getAllDashboards,
  groupId,
  allDashboards,
  groupDashboards,
  ...props
}) => {
  const [otherDashboards, setOtherDashboards] = React.useState([]);
  const [otherDashboardsOptions, setOtherDashboardsOptions] = React.useState([]);
  const otherDashboardsOptionsRef = React.useRef(null);

  React.useEffect(() => {
    getGroupDashboards(groupId);
    getAllDashboards();
  }, []);

  React.useEffect(() => {
    if (allDashboards && groupDashboards) {
      setOtherDashboards(
        allDashboards.filter(
          dashboard =>
            !groupDashboards
              .map(groupDashboard => groupDashboard.dashboardId)
              .includes(dashboard.id)
        )
      );
    }
  }, [allDashboards, groupDashboards]);

  React.useEffect(() => {
    setOtherDashboardsOptions(
      otherDashboards.map(otherDashboard => ({
        label: otherDashboard.name,
        value: otherDashboard.id
      }))
    );
  }, [otherDashboards]);

  const [dashboardsToBeAdded, setDashboardsToBeAdded] = React.useState([]);
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  const onDashboardListChange = event => {
    setDashboardsToBeAdded(event);
    event && event.length > 0 ? setButtonDisabled(false) : setButtonDisabled(true);
  };

  const addDashboardToGroupHandler = event => {
    event.preventDefault();
    otherDashboardsOptionsRef.current.select.clearValue();

    api
      .addDashboardsToGroup(
        dashboardsToBeAdded.map(dashboard => ({ dashboardId: dashboard.value, groupId: +groupId }))
      )
      .then(response => {
        const [response_data, error] = response;
        if (!response_data && error) {
          alert(error);
        } else if (response_data) {
          getGroupDashboards(groupId);
        }
      });
  };

  const removeDashboardFromGroupHandler = (event, rowData) => {
    api.removeDashboardFromGroup(rowData.id).then(response => {
      const [, error] = response;
      if (error) {
        alert(error);
      } else {
        getGroupDashboards(groupId);
      }
    });
  };

  const setPrimaryDashboard = ({ id, groupId, dashboardId }, primaryDashboard) => {
    api.updateGroupDashboard(id, groupId, dashboardId, primaryDashboard).then(response => {
      const [, error] = response;
      if (error) {
        alert(error);
      } else {
        getGroupDashboards(groupId);
      }
    });
  };

  const columns = [
    { title: "Name", field: "dashboardName", searchable: true },
    { title: "Description", field: "dashboardDescription", searchable: true },
    {
      title: "Is Primary",
      field: "primaryDashboard",
      searchable: false,
      render: rowData => (
        <Checkbox
          icon={<RadioButtonUnchecked />}
          checkedIcon={<RadioButtonChecked />}
          checked={!!rowData.primaryDashboard}
          onChange={e => setPrimaryDashboard(rowData, e.target.checked)}
        />
      )
    }
  ];
  return (
    <div style={{ width: "100%" }}>
      <h6>Select dashboards to add to this group:</h6>
      <Grid container spacing={2} style={{ width: "100%" }}>
        <Grid item xs={10}>
          <Select
            name="addDashboardList"
            ref={otherDashboardsOptionsRef}
            isMulti
            isSearchable
            options={otherDashboardsOptions}
            onChange={onDashboardListChange}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={event => addDashboardToGroupHandler(event)}
            disabled={buttonDisabled}
            fullWidth={true}
          >
            Add dashboard(s)
          </Button>
        </Grid>
      </Grid>
      <br />
      <hr />
      <MaterialTable
        title="Group Dashboards"
        columns={columns}
        data={groupDashboards}
        actions={[
          rowData => ({
            icon: "delete_outline",
            tooltip: "Remove dashboard from group",
            onClick: (event, rowData) => removeDashboardFromGroupHandler(event, rowData)
          })
        ]}
        options={{
          actionsColumnIndex: 3,
          searchFieldAlignment: "left",
          headerStyle: {
            zIndex: 0
          }
        }}
        localization={{
          header: { actions: "Remove" }
        }}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  groupDashboards: state.userGroups.groupDashboards,
  allDashboards: state.userGroups.allDashboards
});

export default withRouter(
  connect(
    mapStateToProps,
    { getGroupDashboards, getAllDashboards }
  )(GroupDashboards)
);
