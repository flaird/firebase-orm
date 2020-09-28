import {
  firebase,
  firestore,
  subscribedListeners
} from '.';

const getDocument = async (path) => {
  if (!path) {
    console.log('firebase: getDocument - missing parameters');
    return false;
  }
  let document = undefined;
  try {
    await firestore
      .doc(path)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const {
            id
          } = doc;
          document = doc.data();
          document.id = id;
        } else {
          console.log('firebase: getDocument - document does not exist');
          return false;
        }
      })
      .catch((error) => {
        console.log('firebase: getDocument - error', error);
      });
  } catch (error) {
    console.log('firebase: getDocument -outer  error', error);
  };
  return document;

};

const getDocumentWhere = (path, key, operator, value) => {
  if (!path || !key || !value) {
    console.log('firebase: getDocumentWhere - missing parameters');
    return false;
  }
  let document;
  firestore
    .doc(path)
    .where(key, operator, value)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const {
          id
        } = doc;
        document = doc.data();
        document.id = id;
        return document;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.log('firebase: getDocumentWhere - error', error);
    });
};

const getDocumentSnapshot = (path, callback = () => { }) => {
  if (!path) {
    console.log('firebase: getDocumentSnapshot - missing parameters');
    return false;
  }
  let document;
  let listener = firestore.doc(path).onSnapshot((doc) => {
    if (doc.exists) {
      const {
        id
      } = doc;
      document = doc.data();
      document.id = id;
      callback(document);
    } else {
      callback(undefined)
    }
  });

  subscribedListeners.push(listener);
};

const setDocument = async (collection, id, document) => {
  if (!collection || !id || !document) {
    console.log('firebase: setDocument - missing parameters');
    return false;
  }
  firestore
    .collection(collection)
    .doc(id)
    .set(document);
};

const addDocument = (collection, document) => {
  if (!collection) {
    console.log('firebase: addDocument - missing parameters');
    return false;
  }
  firestore
    .collection(collection)
    .add(document)
    .then((docRef) => {
      console.log('firebase: addDocument - Document written with ID: ', docRef.id);
      return true;
    })
    .catch((error) => {
      console.error('firebase: addDocument - Error adding document: ', error);
      return false;
    });
};

const updateDocument = async (path, document) => {
  if (!path) {
    console.log('firebase: updateDocument - missing parameters');
    return false;
  }
  await firestore
    .doc(path)
    .update(document)
    .then(() => {
      console.log('firebase: updateDocument - Document updated.');
      return true;
    })
    .catch((error) => {
      console.error('firebase: updateDocument - Error updating document: ', error);
      return false;
    });
};

const deleteDocument = async (collection, id) => {
  if (!collection) {
    console.log('firebase: deleteDocument - missing parameters');
    return false;
  }
  await firestore
    .collection(collection)
    .doc(id)
    .delete()
    .then(() => {
      console.log('firebase: deleteDocument - Deleted document with ID ' + id);
      return true;
    })
    .catch((error) => {
      console.error(
        'firebase: deleteDocument - Error deleting document ID ' + id + ' from path: ' + collection,
        error
      );
      return false;
    });
};

/* might need to add 'merge' parameter here */
const updateDocumentArray = (path, key, value) => {
  if (!path || !key || !value) {
    console.log('firebase: updateDocumentArray - missing parameters');
    return false;
  }
  try {
    const document = firestore.doc(path);
    document.update({
      [key]: firebase.firestore.FieldValue.arrayUnion(value),
    });
    return true;
  } catch (error) {
    console.error('firebase: updateDocumentArray - Error updating array', error);
    return false;
  }
};

const deleteFromDocumentArray = (path, key, value) => {
  if (!path || !key || !value) {
    console.log('firebase: deleteFromDocumentArray - missing parameters');
    return false;
  }
  try {
    const document = firestore.doc(path);
    document.update({
      [key]: firebase.firestore.FieldValue.arrayRemove(value),
    });
    return true;
  } catch (error) {
    console.error('firebase: deleteFromDocumentArray - Error updating array', error);
    return false;
  }
};

const updateDocumentWhereKeyValuePair = async (
  path,
  findBy,
  parameter,
  keyValuePair
) => {
  if (!path || !findBy || !parameter || !keyValuePair) {
    console.log('firebase: updateDocumentWhereKeyValuePair - missing parameters');
    return false;
  }
  const query = firestore
    .collection(path)
    .where(findBy, '==', parameter)
    .limit(1);
  const querySnapshot = await query.get();

  if (querySnapshot.size === 0) {
    console.log('firebase: updateDocumentWhereKeyValuePair - not found');
    return false;
  }

  querySnapshot.forEach((doc) => {
    doc.ref.set(keyValuePair, {
      merge: true,
    });
  });

  return true;
};

export {
  getDocument,
  getDocumentWhere,
  getDocumentSnapshot,
  setDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  updateDocumentArray,
  deleteFromDocumentArray,
  updateDocumentWhereKeyValuePair,
};