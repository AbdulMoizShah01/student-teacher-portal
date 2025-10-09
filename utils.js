import firebaseSDK from "./firebase/firebase.config";

const Firestore = firebaseSDK.firestore;

/**get all documents from a specific collection */
export const getAllOfCollection = async (collectionName) => {
  return new Promise((resolve, reject) => {
    if (!collectionName) reject("Collection name is required");
    Firestore.collection(collectionName).onSnapshot((snapshot) => {
      let data = snapshot?.docs?.map((obj) => {
        if (obj.exists) return obj?.data();
        else return null;
      });

      resolve(data?.filter((item) => item));
    });
  });
};
export const getDocumentById = async (collection, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      Firestore.collection(collection)
        .where("_id", "==", id)
        .onSnapshot((snapshot) => {
          console.log("snapshot-----", snapshot);
          let data = snapshot.docs.map((doc) => doc.data());
          console.log("inside-data", data);
          let obj = data[0];
          resolve(obj);
        });
    } catch (e) {
      reject(e);
    }
  });
};

export const createUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
};

export const saveData = async (collection, obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Firestore.collection(collection)
        .doc(obj?._id)
        .set(obj, { merge: true });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};



/**
 * Adds a string or object to an array field of a Firestore document.
 */
export const addToArrayField = async (collection, docId, key, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!collection || !docId || !key) {
        reject("Collection, docId, and key are required");
        return;
      }

      await Firestore.collection(collection)
        .doc(docId)
        .update({
          [key]: firebase.firestore.FieldValue.arrayUnion(value),
        });

      console.log(`✅ Added to ${key} in ${collection}/${docId}:`, value);
      resolve(true);
    } catch (e) {
      console.error("❌ Error adding to array field:", e);
      reject(e);
    }
  });
};

/*------------------Get Items by Mapping Items of one array to another----------------------*/


/**maps the string ids to objects from comparisionArray with key(_id) of id */
export const getItemsbyKey= (array,comparisionArray,key="_id") =>{

    let items=array?.map((string)=>{
        let obj=comparisionArray?.find((cO)=>{
           
            return cO?.[key]===string
        
        })
      
        return obj??{}
    });
    
return items??[]
}

