import React, { Fragment, useEffect, useState } from "react";
import { cloneDeep, isEqual } from "lodash";
import { Redirect, withRouter } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { CreateComponent } from "../../common/components/CreateComponent";
import MaterialTable from "material-table";
import { Title } from "react-admin";
import http from "common/utils/httpClient";

const ResourceListView = ({ history, title, resourceName, resourceURLName, columns }) => {
  const [redirect, setRedirect] = useState(false);
  const [result, setResult] = useState([]);
  const tableRef = React.createRef();

  useEffect(() => {
    http
      .get(`/web/${resourceName}`)
      .then(response => {
        const result = response.data.filter(({ voided }) => !voided);
        setResult(result);
      })
      .catch(error => console.log(error));
  }, []);

  const editResource = rowData => ({
    icon: "edit",
    tooltip: `Edit ${title}`,
    onClick: event => history.push(`/appDesigner/${resourceURLName}/${rowData.id}`)
  });

  const voidResource = rowData => ({
    icon: "delete_outline",
    tooltip: `Delete ${title}`,
    onClick: (event, rowData) => {
      const voidedMessage = `Do you really want to delete ${title} ${rowData.name} ?`;
      if (window.confirm(voidedMessage)) {
        http
          .delete(`/web/${resourceName}/${rowData.id}`)
          .then(response => {
            if (response.status === 200) {
              const index = result.indexOf(rowData);
              const clonedResult = cloneDeep(result);
              clonedResult.splice(index, 1);
              setResult(clonedResult);
            }
          })
          .catch(error => error => console.log(error));
      }
    }
  });

  return (
    <>
      <Box boxShadow={2} p={3} bgcolor="background.paper">
        <Title title={title} />
        <div className="container">
          <div style={{ float: "right", right: "50px", marginTop: "15px" }}>
            <CreateComponent onSubmit={() => setRedirect(true)} name={`New ${title}`} />
          </div>
          <MaterialTable
            title=""
            components={{
              Container: props => <Fragment>{props.children}</Fragment>
            }}
            tableRef={tableRef}
            columns={columns}
            data={result}
            options={{
              addRowPosition: "first",
              sorting: true,
              debounceInterval: 500,
              search: false,
              rowStyle: rowData => ({
                backgroundColor: rowData["voided"] ? "#DBDBDB" : "#fff"
              })
            }}
            actions={[editResource, voidResource]}
          />
        </div>
      </Box>
      {redirect && <Redirect to={`/appDesigner/${resourceURLName}/create`} />}
    </>
  );
};

function areEqual(prevProps, nextProps) {
  return isEqual(prevProps, nextProps);
}

export default withRouter(React.memo(ResourceListView, areEqual));
