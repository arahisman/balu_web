export function updateUser(data) {
  return {
    type: "USER_UPDATE",
    payload:  data ,
  };
}

export function logOut() {
  return {
    type: "LOGOUT",
  };
}
