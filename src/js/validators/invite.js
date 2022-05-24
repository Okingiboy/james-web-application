import Validate from './index';

export default function validateInvite(invite = {}) {
  const errors = {
    // invitename : Validate(invite.invitename).required().handle().message(),
    // name : Validate(invite.name).required().message(),
    username: Validate(invite.username).required().handle().message(),
    password: Validate(invite.username).required().message(),
    email: Validate(invite.email).required().email().message(),
    // description : Validate(invite.description).message()
  };

  errors.isValid = Object.keys(errors).every(key => (errors[key] == undefined));
  return errors;
}
