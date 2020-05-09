import { firestore, subscribedListeners } from '.';

const getCollectionSnapshot = (
  path,
  callback = () => {},
  unsubscribe = false
) => {
  if (!path) return null;

  let listener = firestore.collection(path).onSnapshot((querySnapshot) => {
    let documents = [];
    querySnapshot.forEach((doc) => {
      const { id } = doc;
      const data = doc.data();
      data.id = id;

      documents.push(data);
    });

    callback(documents);
  });

  subscribedListeners.push(listener);
};

const getCollectionSnapshotWhere = (
  path,
  key,
  operator,
  value,
  callback = () => {},
  unsubscribe = false
) => {
  if (!path) return null;

  let listener = firestore
    .collection(path)
    .where(key, operator, value)
    .onSnapshot((querySnapshot) => {
      let documents = [];
      querySnapshot.forEach((doc) => {
        const { id } = doc;
        const data = doc.data();
        data.id = id;

        documents.push(data);
      });
      callback(documents);
    });
  subscribedListeners.push(listener);
};

export { getCollectionSnapshot, getCollectionSnapshotWhere };
