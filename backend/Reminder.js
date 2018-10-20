const admin = require('firebase-admin');
const serviceAccount = {
  // TODO: Add your Firebase Admin credentials from: https://console.firebase.google.com/project/YOUR_PROJECT_ID/settings/serviceaccounts/adminsdk
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // TODO: Add your Firebase databaseURL
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com"
});
const firestore = admin.firestore();

exports.getUserIds = () => {
  return new Promise((resolve, reject) => {
    firestore.collection('todos').get().then(data => {
      if (data.empty) {
        reject("No Users");
      } else {
        let retVal = [];
        data.docs.forEach((userRef, index, array) => {
          retVal.push(userRef.id);
          if (index+1 === array.length) {
            resolve(retVal);
          }
        });
      }
    });
  });
}

exports.getUserbyPhonenummber = phonenumber => {
  return new Promise((resolve, reject) => {
    firestore.collection('todos').where("phonenumber","==", phonenumber).get().then(data => {
      if (data.empty) {
        reject("No Users");
      } else {
        resolve(data.docs[0].id);
      }
    });
  });
}

exports.getTasks = userId => {
  return new Promise((resolve, reject) => {
    firestore.collection(`todos/`+userId.toString()+`/myTodos`).where("status", "==", false).get().then(data => {
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


exports.getUserData = userId => {
  return new Promise((resolve, reject) => {
    firestore.doc(`todos/`+userId.toString()).get().then(data => {
      if (!data.exists) {
        reject("No User");
      } else {
        resolve(data.data());
      }
    });
  });
}


exports.createTask = (createData, userId) => {
  // let createData = {
  //  name: "...", // string
  //  done_till: 123456 // number
  // }
  return new Promise((resolve, reject) => {
    createData.created_at = Date.now();
    createData.status = false;
    firestore.collection(`todos/`+userId+`/myTodos`).add({
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

exports.updateTask = (task, userId) => {
  return new Promise((resolve, reject) => {
    firestore.doc(`todos/`+userId+`/myTodos/`+task.id).update(
      task
    ).then(() => {
      resolve(task);
    }).catch(error => {
      reject(error);
    });
 });
}
