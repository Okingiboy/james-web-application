import React from "react";
import { LineBreak } from "../../common/components/utils";
import TextFormElement from "./TextFormElement";
import NotesFormElement from "./NotesFormElement";
import SingleSelectFormElement from "./SingleSelectFormElement";
import MultiSelectFormElement from "./MultiSelectFormElement";
import NumericFormElement from "./NumericFormElement";
import { DateFormElement, DateTimeFormElement } from "./DateFormElement";
import TimeFormElement from "./TimeFormElement";
import DurationFormElement from "./DurationFormElement";
import { Concept, KeyValue } from "avni-models";
import MediaFormElement from "./MediaFormElement";
import PhoneNumberFormElement from "./PhoneNumberFormElement";
import LocationFormElement from "./LocationFormElement";
import LandingSubjectFormElement from "./LandingSubjectFormElement";
import QuestionGroupFormElement from "./QuestionGroupFormElement";
import { isNil } from "lodash";

const div = () => <div />;

const elements = {
  Date: DateFormElement,
  DateTime: DateTimeFormElement,
  Time: TimeFormElement,
  Duration: DurationFormElement,
  SingleSelect: SingleSelectFormElement,
  MultiSelect: MultiSelectFormElement,
  Numeric: NumericFormElement,
  Boolean: div,
  Text: TextFormElement,
  Notes: NotesFormElement,
  NA: div,
  Image: MediaFormElement,
  Video: MediaFormElement,
  Audio: MediaFormElement,
  File: MediaFormElement,
  Id: TextFormElement,
  PhoneNumber: PhoneNumberFormElement,
  Subject: LandingSubjectFormElement,
  Location: LocationFormElement,
  QuestionGroup: QuestionGroupFormElement
};

export const FormElement = ({
  children: formElement,
  value,
  update,
  obsHolder,
  validationResults,
  uuid,
  feIndex,
  filteredFormElements,
  isChildFormElement,
  ignoreLineBreak,
  isGrid,
  updateObs
}) => {
  if (!isChildFormElement && !isNil(formElement.groupUuid)) return null;
  const type = formElement.getType();
  if (type === Concept.dataType.Id) {
    formElement.keyValues = [
      ...formElement.keyValues,
      KeyValue.fromResource({ key: "editable", value: false })
    ];
    formElement.mandatory = false;
  }
  const props = {
    formElement,
    value,
    update,
    obsHolder,
    validationResults,
    uuid,
    filteredFormElements,
    isGrid,
    updateObs
  };
  const Element = elements[type];
  return (
    <div>
      {!ignoreLineBreak && <LineBreak num={feIndex === 0 ? 0 : 2} />}
      {/*this check can be removed later when DEA supports all the data types (Location is not supported yet)*/}
      {Element && <Element {...props} />}
      {/* <LineBreak num={1} /> */}
    </div>
  );
};
