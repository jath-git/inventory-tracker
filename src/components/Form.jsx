// This App is Deployed. See Live Site at:
// https://inventory-tracker-app.netlify.app

import React from 'react';
import { translateRef, addCollection, updateCollection, showHideCaption, roundDollar } from '../Helper';
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat/app";

export default function Form({ inputs, firestore, caption }) {
    // retrieve inventory
    const collectionInventory = firestore.collection('inventoryList');
    const [inventory] = useCollectionData(collectionInventory.orderBy("timeStamp"), {
        idField: "id",
    });

    // add new inventory or update existing inventory accordingly
    const addInventory = e => {
        e.preventDefault();
        const newInventory = translateRef(inputs, caption);
        if (newInventory !== null && !addExisting(newInventory)) {
            addCollection(collectionInventory, newInventory);
        }
    }

    // check if inventory exists and if so, adds quantity
    const addExisting = newInventory => {
        for (let i of inventory) {
            if (i.product === newInventory.product) {
                if (roundDollar(i.price) === roundDollar(newInventory.price)) {
                    updateCollection(collectionInventory, i.id, { quantity: i.quantity + newInventory.quantity });
                    updateCollection(collectionInventory, i.id, { timeStamp: firebase.firestore.FieldValue.serverTimestamp() });
                } else {
                    showHideCaption(caption, 'Inventory with same name already exists');
                }
                return true;
            }
        }
        return false;
    }

    return (
        <form onSubmit={addInventory}>
            <table className="form">
                <tbody>
                    <tr>
                        <td className="right">
                            <label>Product:</label>
                        </td>
                        <td className="left">
                            <input type="text" className="type" placeholder="Enter Name of Product" ref={inputs.product} />
                        </td>
                    </tr>
                    <tr>
                        <td className="right">
                            <label>Price (CAD):</label>
                        </td>
                        <td className="left">
                            <input type="text" className="type" placeholder="Enter Price per Unit" ref={inputs.price} />
                        </td>
                    </tr>
                    <tr>
                        <td className="right">
                            <label>Quantity:</label>
                        </td>
                        <td className="left">
                            <input type="number" className="type" placeholder="Enter Quantity of Units" ref={inputs.quantity} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <button className="submit" type="submit">
                                Add to Inventory
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
}
