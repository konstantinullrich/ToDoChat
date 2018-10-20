import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Initialize Firebase
const config = {
  // TODO: Add your Firebase Credencials. You get them from the Overview Page of your Firebase Project by clicking on the add to Web Symbol(< />)
};
firebase.initializeApp(config);

const firebaseAuth = firebase.auth;
const provider = new firebase.auth.FacebookAuthProvider();
const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true,};
firestore.settings(settings);

class KonstiFirebase {
  constructor() {
    this.user = {};
  };

  // Authentication
  authenticateWithFacebook = () => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithPopup(provider).then(result => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // let token = result.credential.accessToken;
        // The signed-in user info.
        let user = result.user;
        this.user = user;
        firestore.collection('todos').doc(user.uid).set({
          displayName: user.displayName,
          photoUrl: user.photoURL,
        }, { merge: true })
        .then(doc => {
          resolve(doc);
        }).catch(error => {
          reject(error);
        })
      }).catch(error => {
        reject(error);
      });
    });
  }
  signOut = () => {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        resolve();
      }).catch(error => {
        // An error happened.
        reject(error);
      });
    });
  }
  getUser = () => {
    return new Promise(resolve => {
      resolve(this.user);
    });
  }

  // Konsti Base Tasks
  getTasks = () => {
    return new Promise((resolve, reject) => {
      firestore.collection('todos').doc(this.user.uid).collection('myTodos').get().then(data => {
        if (data.empty) {
          resolve([]);
        } else {
          let retVal=[];
          data.docs.forEach((element, index, array) => {
            let parsedValue = element.data();
            parsedValue.id = element.id;
            retVal.push(parsedValue);
            if (index+1 === array.length) {
              resolve(retVal);
            }
          });
        }
      });
    });
  }
  createTask = createData => {
    return new Promise((resolve, reject) => {
      createData.created_at = Date.now();
      createData.status = false;
      firestore.collection('todos').doc(this.user.uid).collection('myTodos').add({
        name: createData.name,
        created_at: createData.created_at,
        done_till: createData.done_till,
        status: createData.status
      }).then(docRef => {
        docRef.get().then(data => {
          let retVal = data.data();
          retVal.id = docRef.id;
          resolve(retVal);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }
  updateTask = task => {
    return new Promise((resolve, reject) => {
      firestore.collection('todos').doc(this.user.uid).collection('myTodos').doc(task.id).update(
        task
      ).then(() => {
        resolve(task);
      }).catch(error => {
        reject(error);
      });
    });
  }
  getTodoieState = () => {
    return new Promise((resolve, reject) => {
      firestore.collection('todos').doc(this.user.uid).collection('myTodos').get().then(data => {
        if (data.empty) resolve([])
        else {
          let tasks = []
          data.docs.forEach((element, index, array) => {
            let task = element.data();
            task.id = element.id;
            if(task.status === false) tasks.push(task)
          });
          resolve(tasks);
        }
      })
    })
  }
}

export { KonstiFirebase, firebaseAuth };
