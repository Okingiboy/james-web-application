import React, { Fragment } from "react";
import Grid from "@material-ui/core/Grid";
import { AvniFormControl } from "../../common/components/AvniFormControl";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { FormElement } from "avni-models";

const SubjectFormElementKeyValues = props => {
  return (
    <Fragment>
      <Grid item sm={4}>
        <AvniFormControl toolTipKey={"APP_DESIGNER_FORM_ELEMENT_DISPLAY_ALL_GROUP_MEMBERS"}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.formElementData.keyValues.displayAllGroupMembers}
                onChange={event =>
                  props.handleGroupElementKeyValueChange(
                    props.groupIndex,
                    FormElement.keys.displayAllGroupMembers,
                    event.target.checked,
                    props.index
                  )
                }
              />
            }
            label="Display all group members"
          />
        </AvniFormControl>
      </Grid>
      <Grid item sm={4}>
        <AvniFormControl toolTipKey={"APP_DESIGNER_FORM_ELEMENT_SEARCH_OPTIONS"}>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.formElementData.keyValues.searchOptions}
                onChange={event =>
                  props.handleGroupElementKeyValueChange(
                    props.groupIndex,
                    FormElement.keys.searchOptions,
                    event.target.checked,
                    props.index
                  )
                }
              />
            }
            label="Search option"
          />
        </AvniFormControl>
      </Grid>
    </Fragment>
  );
};

export default SubjectFormElementKeyValues;
