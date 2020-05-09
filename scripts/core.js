// In use databases
// Users database
const usersDatabase = 'users-project09';
// Draw database
const drawDatabase = 'draw-project09';

// Firestore CRUD
const create = async (user, database) => {
  // const firestore = firebase.firestore();
  // const result = await firestore.collection(database) // Select firestore document
  //   .add(user) // Store user data on document
  //   .then((docRef) => docRef.id) // Return document id if ok
  //   .catch(() => false); // Return false on store error

  return true;
};

const showBottonSheet = () => {
  const overlay = document.querySelector('.overlay');
  const sheet = overlay.querySelector('.menu');
  const sheetClose = overlay.querySelector('.sheet-close');
  // Active the botton sheet and its overlay
  overlay.classList.add('is-active');
  sheet.classList.add('is-active');
  sheetClose.classList.add('is-active');
  // Create a event on the overlay to close the botton sheet
  sheetClose.addEventListener('click', () => {
    overlay.classList.remove('is-active');
    sheet.classList.remove('is-active');
  });
};

const createUser = async (form) => {
  // Get user data from sign in form
  const user = {
    name: form.elements[0].value,
    slackUser: form.elements[1].value,
    pullLink: form.elements[2].value,
  };
  // Store user data on firebase
  const result = await create(user, usersDatabase);
  // If ok show sucess msg else show try again msg
  if (result) {
    document.querySelector('#new-user-form').hidden = true;
  }
};

window.onload = () => {
  const joinBtn = document.querySelector('.join-button');
  const newUserForm = document.querySelector('#new-user-form');

  joinBtn.addEventListener('click', () => {
    showBottonSheet();
  });
  newUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    createUser(newUserForm);
  });
};
