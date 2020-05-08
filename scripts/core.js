// In use databases
// Users database
const usersDatabase = 'users-project09';
// Draw database
const drawDatabase = 'draw-project09';

// Firestore CRUD
const create = async (user, database) => {
  const firestore = firebase.firestore();
  const result = await firestore.collection(database) // Select firestore document
    .add(user) // Store user data on document
    .then((docRef) => docRef.id) // Return document id if ok
    .catch(() => false); // Return false on store error

  return result;
};

const createUser = async (form) => {
  // Get user data from signin form
  const user = {
    name: form.elements[0].value,
    slackUser: form.elements[1].value,
    pullLink: form.elements[2].value,
  };
  // Store user data on firebase
  const result = await create(user, usersDatabase);
  // IF ok show sucess msg else show try again msg
  if (result) {
    alert('ok');
  }
};

window.onload = () => {
  const newUserForm = document.querySelector('#new-user-form');
  newUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    createUser(newUserForm);
  });
};
