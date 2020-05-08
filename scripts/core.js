const getUserdata = (form) => {
  // Get user data from signin form
  const user = {
    name: form.elements[0].value,
    slackUser: form.elements[1].value,
    pullLink: form.elements[2].value,
  };

  return user;
};

window.onload = () => {
  const newUserForm = document.querySelector('#new-user-form');
  newUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get user data
    const user = getUserdata(newUserForm);
    // Store user data on firebase
  });
};
