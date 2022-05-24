import React, { useEffect, useState } from "react";
import http from "../../../common/utils/httpClient";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Box from "@material-ui/core/Box";
import { Redirect } from "react-router-dom";
import { Title } from "react-admin";
import { ShowLabelValue } from "../../common/ShowLabelValue";

export const VideoShow = props => {
  const [video, setVideo] = React.useState({});
  const [editAlert, setEditAlert] = useState(false);

  useEffect(() => {
    http.get(`/web/video/${props.match.params.id}`).then(res => setVideo(res.data));
  }, []);

  return (
    <Box boxShadow={2} p={3} bgcolor="background.paper">
      <Title title={"Show Video : " + video.title} />
      <Grid container item sm={12} style={{ justifyContent: "flex-end" }}>
        <Button color="primary" type="button" onClick={() => setEditAlert(true)}>
          <EditIcon />
          Edit
        </Button>
      </Grid>
      <div className="container" style={{ float: "left" }}>
        <ShowLabelValue label={"Name"} value={video.title} />
        <p />
        <ShowLabelValue label={"Description"} value={video.description} />
        <p />
        <ShowLabelValue label={"File name"} value={video.fileName} />
        <p />
        <ShowLabelValue label={"Duration"} value={video.duration} />
        <p />
      </div>
      {editAlert && <Redirect to={"/appDesigner/video/" + props.match.params.id} />}
    </Box>
  );
};
