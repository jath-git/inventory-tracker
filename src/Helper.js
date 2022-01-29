// This App is Deployed. See Live Site at:
// https://inventory-tracker-app.netlify.app

import firebase from "firebase/compat/app";

const copyArr = (arr, removeIdx) => {
    let newArr = [];
    for (let i = 0; i < arr.length; ++i) {
        if (i !== removeIdx) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

const padDollar = number => {
    return `$ ${roundDollar(number)}`;
}

const roundDollar = number => {
    return (Math.round(number * 100) / 100).toFixed(2);
}

const showHideCaption = (caption, label) => {
    caption.current.style.display = 'block';
    caption.current.textContent = label;
    const duration = 2000;

    setTimeout(() => {
        caption.current.style.display = 'none';
    }, duration);
}

const capitalize = word => {
    return word[0].toUpperCase() + word.substring(1).toLowerCase();
}

const addCollection = async (collection, item) => {
    await collection.add(item);
}

const updateCollection = async (collection, doc, field) => {
    await collection.doc(doc).update(field);
}

const deleteCollection = async (collection, doc) => {
    await collection.doc(doc).delete();
}

const deleteAllCollection = (collection, data) => {
    for (let i = 0; i < data.length; ++i) {
        deleteCollection(collection, data[i].id);
    }
}

const addAllCollection = (collection, data) => {
    for (let i = 0; i < data.length; ++i) {
        addCollection(collection, data[i]);
    }
}

const translateRef = (obj, caption) => {
    let newObj = {};
    for (let i in obj) {
        if (i === 'product') {
            if (obj[i].current.value !== '') {
                newObj[i] = obj[i].current.value;
            } else {
                showHideCaption(caption, `${capitalize(i)} must have a valid name`);
                return null;
            }
        } else {
            if (!isNaN(obj[i].current.value)) {
                if (Number(obj[i].current.value) >= 0) {
                    if (obj[i].current.value === '') {
                        showHideCaption(caption, `${capitalize(i)} must not be empty`);
                        return null;
                    } else {
                        newObj[i] = Number(obj[i].current.value);
                    }
                } else {
                    showHideCaption(caption, `${capitalize(i)} must not be non-negative`);
                    return null;
                }
            } else {
                showHideCaption(caption, `${capitalize(i)} must be a number`);
                return null;
            }
        }
    }

    newObj.ship = false;
    newObj.timeStamp = firebase.firestore.FieldValue.serverTimestamp();

    return newObj;
}

const reverseArr = arr => {
    for (let i = 0; i < Math.floor(arr.length / 2); ++i) {
        const temp = arr[i];
        arr[i] = arr[arr.length - 1 - i];
        arr[arr.length - 1 - i] = temp;
    }
}

const getArrayTotal = (array) => {
    let total = 0;
    for (let item of array) {
        if (isNaN(item.price)) {
            return `Total: ${padDollar(0)}`;
        }
        total += item.price * item.quantity;
    }
    return `Total: ${padDollar(total)}`;
}

export { copyArr, showHideCaption, capitalize, addCollection, updateCollection, deleteCollection, deleteAllCollection, addAllCollection, translateRef, reverseArr, getArrayTotal, padDollar, roundDollar };