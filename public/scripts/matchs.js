// Actual project global const
let actualProject;
// Round Matchs global object
let roundMatchs;

const setAppSettings = async () => {
  // Initiate firestore
  const firestore = firebase.firestore();
  // Get app settings and set global variables
  await firestore.collection('core-settings')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // Define global const actualProject;
        actualProject = doc.data()['actual-project'];
      });
    })
    .catch((error) => {
      // Show alert on firestore error
      alert('Error getting documents: ', error);
    });
  // Check if settings are applied
  if (actualProject) {
    return true;
  }
  return false;
};

const getMatchs = async (project) => {
  const matchs = [];
  // Initiate firestore
  const firestore = firebase.firestore();
  // Set matchs collection reference
  const matchsRef = firestore.collection('code-review').doc(project).collection('matchs');
  await matchsRef.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        matchs.push(doc.data());
      });
    });
  if (matchs.length > 0) {
    return matchs;
  }
  return false;
};

const getUsers = async (projects) => {
  const users = [];
  const firestore = firebase.firestore();
  const usersRef = firestore.collection('review-users').doc(projects).collection('users');
  await usersRef.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        user.id = doc.id;
        users.push(user);
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

const showMatch = (match) => {
  const matchElement = `
    <div class="tryber">
      <div class="tryber-name">
        ${match.reviewer.name}
      </div>
    </div>
    <div class="image-container">
      <img src="./imgs/code-review.png" alt="Code-review icon">
    </div>
    <div class="tryber">
      <div id="dev" class="tryber-name">
        ${match.dev.name}
      </div>
      <button id="${match.dev.id}" class="pull-link-btn">
        <img src="./imgs/pull-request.png" alt="Pull Request Icon">
      </button>
    </div>`;
  const matchContainer = document.createElement('div');
  matchContainer.classList.add('match-container', 'animate__animated', 'animate__fadeIn');
  matchContainer.innerHTML = matchElement;
  document.querySelector('#matchs').appendChild(matchContainer);

  const button = document.getElementById(match.dev.id);
  button.addEventListener('click', () => {
    window.location.href = match.dev['pull-link'];
  });
};

const search = (input, matchs) => {
  const searchResult = matchs.filter((match) => {
    return (match.dev.name.toLowerCase().includes(input.toLowerCase())
      || match.reviewer.name.toLowerCase().includes(input.toLowerCase()));
  });

  if (searchResult.length > 0) {
    const visibleMatchs = document.querySelectorAll('.match-container');
    visibleMatchs.forEach((match) => {
      match.remove();
    });

    searchResult.forEach((result) => {
      showMatch(result);
    });
  }
};

const initApp = async () => {
  if (await setAppSettings()) {
    const matchs = await getMatchs(actualProject);
    const users = await getUsers(actualProject);

    const matchsResult = matchs.map((match) => {
      const dev = users.find((user) => user.id === match.dev);
      const reviewer = users.find((user) => user.id === match.reviewer);

      return {
        dev,
        reviewer,
      };
    });
    document.querySelector('.matchs-loader').classList.add('hidden');
    matchsResult.forEach((match) => {
      showMatch(match);
    });

    roundMatchs = matchsResult;
    // Enable search of matchs
    document.querySelector('.search-bar').classList.remove('hidden');
  }
  return false;
};

window.onload = () => {
  initApp();

  const searchInput = document.querySelector('#match-search');
  searchInput.addEventListener('input', (e) => {
    if (e.target.value !== '') {
      search(e.target.value, roundMatchs);
    }
  });
};
