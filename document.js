import {
  firebase,
  firestore,
  subscribedListeners
} from '.';

const getDocument = (path) => {
  if (!path) {
    console.log('firebase: getDocument - missing parameters');
    return false;
  }
  let document;
  firestore
    .doc(path)
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
      console.log('firebase: getDocument - error', error);
    });
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

const getDocumentSnapshot = (path, callback = () => {}) => {
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

const setDocument = (collection, id, document) => {
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
    })
    .catch((error) => {
      console.error('firebase: addDocument - Error adding document: ', error);
    });
};

const deleteDocument = (collection, id) => {
  if (!collection) {
    console.log('firebase: deleteDocument - missing parameters');
    return false;
  }
  firestore
    .collection(collection)
    .doc(id)
    .delete()
    .then(() => {
      console.log('firebase: deleteDocument - Deleted document with ID ' + id);
    })
    .catch((error) => {
      console.error(
        'firebase: deleteDocument - Error deleting document ID ' + id + ' from path: ' + collection,
        error
      );
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
  } catch (error) {
    console.error('firebase: updateDocumentArray - Error updating array', error);
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
  } catch (error) {
    console.error('firebase: deleteFromDocumentArray - Error updating array', error);
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
  deleteDocument,
  updateDocumentArray,
  deleteFromDocumentArray,
  updateDocumentWhereKeyValuePair,
};