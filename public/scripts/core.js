// Project database
let actualProject;
// project properties
let project;


// Firestore functions
const setAppSettings = async () => {
  const firestore = firebase.firestore();

  await firestore.collection('core-settings')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // Define global const usersDatabase;
        actualProject = doc.data()['actual-project'];
      });
    })
    .catch((error) => {
      alert('Error getting documents: ', error);
    });
  // Check if settings are applied
  if (actualProject) {
    // Get project informations
    const projectRef = firestore.collection('review-users');
    await projectRef.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id === actualProject) {
            project = {
              'project-detail': doc.data()['project-detail'],
              'project-end': doc.data()['project-end'],
              'project-name': doc.data()['project-name'],
              'review-match-date': doc.data()['review-match-date'],
              'review-subscription-end': doc.data()['review-subscription-end'],
            };
          }
        });
      });
    return true;
  }

  return false;
};

const checkRoundMatch = async (project) => {
  const firestore = firebase.firestore();

  const matchRef = firestore.collection('code-review').doc(project);
  const matchStatus = await matchRef.get()
    .then((querySnapshot) => {
      if (querySnapshot.data()) {
        return querySnapshot.data()['match-made'];
      }
      return false;
    });
  return matchStatus;
};

const getReviewUsers = async () => {
  const users = [];
  const firestore = firebase.firestore();
  const usersRef = firestore.collection('review-users').doc(actualProject).collection('users');
  await usersRef.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
    })
    .catch((error) => {
      alert('Error getting documents, report to devs: ', error);
    });
  if (users.length > 0) {
    return users;
  }
  return false;
};

const storeUser = async (data) => {
  const firestore = firebase.firestore();
  const usersRef = firestore.collection('review-users').doc(actualProject).collection('users');
  await usersRef.add(data) // Store user data on document
    .then((docRef) => docRef.id) // Return document id if ok
    .catch(() => false); // Return false on store error

  return true;
};
// End of

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

const putUserOnLinst = (user) => {
  const tryberElement = document.createElement('div');
  tryberElement.classList.add('tryber');
  const tryberName = document.createElement('div');
  tryberName.classList.add('tryber-name');
  const pullLinkBtn = document.createElement('button');
  pullLinkBtn.classList.add('pull-link-btn');


  tryberName.textContent = user.name;
  tryberElement.appendChild(tryberName);

  pullLinkBtn.innerHTML = '<img src="./imgs/pull-request.png" alt="Pull Request Icon">';
  pullLinkBtn.addEventListener('click', () => {
    window.location.href = user.pullLink;
  });
  tryberElement.appendChild(pullLinkBtn);


  const trybersList = document.querySelector('.trybers-list');
  trybersList.insertBefore(tryberElement, trybersList.firstChild);
};

const createUser = async (form) => {
  // Disable confirm-btn button
  document.querySelector('#confirm-btn').disabled = true;
  // Get user data from sign in form
  const user = {
    name: form.elements[0].value,
    slackUser: form.elements[1].value,
    pullLink: form.elements[2].value,
  };
  // Store user data on firebase and wait the result
  const result = await storeUser(user);
  // If ok show sucess msg else show try again msg
  if (result) {
    // Disable the join button on home page
    document.querySelector('.join-button').classList.add('hidden');
    document.querySelector('.user-login').classList.add('hidden');
    // Show successes msg
    document.querySelector('.success-msg').classList.remove('hidden');
    document.querySelector('.success-msg img').classList.add('positive-img-animation');
    // Put user on homepage list
    putUserOnLinst(user);
  }
};

const updateProjectDetails = (project) => {
  document.querySelector('.project-title').innerHTML = `${project['project-name']} <span>Project</span>`;
  document.querySelector('.project-subtitle').innerHTML = project['project-detail'];
  document.querySelector('.project-dealine').innerHTML = `Deadline: <span>${project['project-end']}</span>`;
  document.querySelector('#match-date').innerHTML = project['review-match-date'];
  document.querySelector('#join-date').innerHTML = project['review-subscription-end'];
};

const initApp = async () => {
  // Get app settings on app start
  const appSettings = await setAppSettings();
  // If settings seted get users
  if (appSettings) {
    const matchStatus = await checkRoundMatch(actualProject);
    if (!matchStatus) {
      updateProjectDetails(project);
      document.querySelector('.loader').classList.add('hidden');
      document.querySelector('.project-card').classList.add('animate__animated', 'animate__bounceIn');
      getReviewUsers()
        .then((users) => {
          users.forEach((user) => {
            // For each user found put user o homepage list
            putUserOnLinst(user);
          });
        });
    } else {
      window.location.replace('/matchs.html');
    }
  }
};

window.onload = () => {
  initApp();

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
