import React, { PropTypes } from 'react';

// TODO - work in progress
const TagInput = ({ label, name, showError, error, value, placeholder, onChange, helpText, showHelpText }) => {
  return (
    <div className={(error && showError) ? "validFormField form-group has-error" : "validFormField form-group"}>
      {label ? <label className="control-label" htmlFor={name}>{label}</label> : undefined }
      <input
        id={name}
        name={name}
        type="text"
        className="form-control"
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(name, e.target.value, e); }}
      />
      {(error != "" && showError) ? <div className="control-label">{error}</div> : undefined}
      {(helpText && showHelpText) && <i className="help hint">{helpText}</i>}
    </div>
  );
};

TagInput.propTypes = {
  // required name for the field
  name: PropTypes.string.isRequired,
  // if provided it'll create a label element to accompany the field
  label: PropTypes.string,
  // value to display in the field
  value: PropTypes.string.isRequired,
  // placeholder text for an empty field. default: ""
  placeholder: PropTypes.string,
  // an error message to displacy
  error: PropTypes.string,
  // weather or not to actually display any passed-in errors
  showError: PropTypes.bool,
  // change handler func. will be called with (name, value, event)
  onChange: PropTypes.func.isRequired,
  // short message to help the user
  helpText: PropTypes.string,
  // weather to show help text or not
  showHelpText: PropTypes.bool,
};

TagInput.defaultProps = {
  name: undefined,
  error: undefined,
  showError: true,
  placeholder: "",
};

export default TagInput;
