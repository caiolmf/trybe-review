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
  const sheetElements = document.querySelectorAll('.botton-sheet');
  const sheetClose = document.querySelector('.sheet-close');
  // Active the botton sheet and its overlays
  sheetElements.forEach((element) => {
    element.classList.add('is-active');
  });
  // Create a event on the overlay to close the botton sheet
  sheetClose.addEventListener('click', () => {
    sheetElements.forEach((element) => {
      element.classList.remove('is-active');
    });
  });
};

const createUser = async (form) => {
  // Get user data from sign in form
  const user = {
    name: form.elements[0].value,
    slackUser: form.elements[1].value,
    pullLink: form.elements[2].value,
  };
  // Store user data on firebase and wait the result
  const result = await create(user, usersDatabase);
  // If ok show sucess msg else show try again msg
  if (result) {
    // Disable the join button on home page
    document.querySelector('.join-button').classList.add('hidden');
    document.querySelector('.user-login').classList.add('hidden');
    // Show successes msg
    document.querySelector('.success-msg').classList.remove('hidden');
    document.querySelector('.success-msg img').classList.add('positive-img-animation');
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
