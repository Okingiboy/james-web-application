// alphanumeric must start with a letter and contian only letters & numbers
// const alphaNumericRegex = /^[a-z0-9_-]{2,35}$/gi,
      // titleRegex        = /^[\sa-z0-9_-]{1,200}$/gi,
      // slugRegex  = /^[a-z0-9-_]+$/gi,
      // pathRegex  = /^[a-z0-9-_/]+/$/gi,

// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// make sure a handle contains only alphanumeric chars,_,-, and starts with a letter
// function validHandle(handle = "") {
//   return (alphaNumericRegex.exec(handle) != null);
// }

function validUuid(uuid = "") {
  return (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.exec(uuid) != null);
}

// check email against regex
// function validEmail(email = "") {
//   return (emailRegex.exec(email) != null);
// }

// check slug against regex
// function validSlug(slug = "") {
//   return (slugRegex.exec(slug) != null);
// }

// check path against regex
// function validPath(path="") {
//   return (pathRegex.exec(path) != null)
// }

// see if a string is in fact a UUID
// export function validUuid(id) {
//  return uuid.Parse(id) != nil
// }

// check if a handle is taken, also checking against
// organization namespace to avoid collisions
// TODO - refactor to only return an error if taken
// export function HandleTaken(db *sql.DB, handle string) (taken bool, err error) {
//  err = db.QueryRow("SELECT exists(SELECT 1 FROM(SELECT lower(handle) FROM account WHERE handle = $1 AND deleted=false) AS existing)", strings.ToLower(handle)).Scan(&taken)

//  if err == sql.ErrNoRows {
//    err = nil
//    taken = false
//  }

//  return
// }

// check if an email is taken
// export function EmailTaken(db *sql.DB, email string) (taken bool, err error) {
//  err = db.QueryRow(`SELECT exists(SELECT 1 FROM account WHERE email = $1 AND deleted=false)`, email).Scan(&taken)
//  if err == sql.ErrNoRows {
//    err = nil
//    taken = false
//  }
//  return
// }

// check if a dataset path is taken
// export function PathTaken(db sqlQueryable, path string) (taken bool, err error) {
//  err = db.QueryRow("SELECT exists(SELECT 1 FROM dataset WHERE path = $1 AND deleted=false)", path).Scan(&taken)
//  if err == sql.ErrNoRows {
//    err = nil
//    taken = false
//  }
//  return
// }

// check if dataset exists in a given dataset
// export function DatasetExists(db sqlQueryable, datasetId string) (exists bool, err error) {
//  err = db.QueryRow("SELECT exists(SELECT 1 FROM dataset WHERE id = $1)", datasetId).Scan(&exists)
//  if err == sql.ErrNoRows {
//    err = nil
//    exists = false
//  }

//  return
// }

// check if a user exists on a given database
// export function UserExists(db sqlQueryable, userId string) (exists bool, err error) {
//  err = db.QueryRow("SELECT exists(SELECT 1 FROM account WHERE id = $1)", userId).Scan(&exists)
//  if err == sql.ErrNoRows {
//    err = nil
//    exists = false
//  }

//  return
// }

// generic "exists" for models that have a table
// export function ModelExists(db sqlQueryable, modelType ModelEnum, id string) (exists bool, err error) {
//  if !validUuid(id) {
//    return false, nil
//  }

//  name := modelType.TableName()
//  if name == "" {
//    return false, ErrInvalidModel
//  }

//  err = db.QueryRow(fmt.Sprintf("SELECT exists(SELECT 1 FROM %s WHERE id= $1 and deleted= false)", name), id).Scan(&exists)
//  if err == sql.ErrNoRows {
//    err = nil
//    exists = false
//  }
//  return
// }

function Validator(input) {
  // code
  this.input = input;
  this.errors = [];

  this.required = () => {
    if (!this.input) {
      this.errors.push("required");
    }
    return this;
  };

  this.handle = () => {
    const handle = this.input;
    if (typeof handle != "string") {
      this.errors.push("handle must be a string");
    } else if (/^[a-z0-9_-]+$/i.exec(handle) == null) {
      this.errors.push("handle can only contain a-z, 0-9, _, or -");
    } else if (handle.length < 2) {
      this.errors.push("handle too short. Min 2 characters.");
    } else if (handle.length > 50) {
      this.errors.push("handle too long. 50 characters max.");
    }

    return this;
  };

  this.name = () => {
    const name = this.input;
    if (typeof name != "string") {
      this.errors.push("invalid name");
    } else if (name.length > 100) {
      this.errors.push("name too long");
    }

    // TODO - re-enable
    // if !titleRegex.MatchString(d.Name) {
    //  this.errors.push("invalid name")
    // }

    return this;
  };

  this.model = () => {
    let id = this.input || "";
    if (typeof id == "object") {
      id = id.id;
    }
    if (!validUuid(id)) {
      this.errors.push("model has invalid id");
    }
    return this;
  };

  this.user = () => {
    // if d.Owner == nil {
    //  return ErrOwnerRequired
    // } else if exists, err := UserExists(db, d.Owner.Id); err != nil {
    //  return err
    // } else if !exists {
    //  return ErrInvalidOwner
    // }
    return this;
  };

  this.email = () => {
    let email = this.input || "";
    if (emailRegex.exec(email) == null) {
      this.errors.push("invalid email");
    }

    return this;
  };

  this.message = () => {
    return (this.errors.length > 0) ? this.errors[0] : undefined;
  };

  return this;
}

export default function Validate(input) {
  return new Validator(input);
}
