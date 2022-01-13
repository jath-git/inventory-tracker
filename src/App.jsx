// This App is Deployed. See Live Site at:
// https://inventory-tracker-app.netlify.app

// firebase imports
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// react, other imports
import { useRef } from 'react';
import { reverseArr } from './Helper';
import "./App.scss";

// components
// middle center
import Form from './components/Form';
// middle left
import Inventory from './components/Inventory';
// middle right
import Shipment from './components/Shipment';
// top right
import ChangeShipment from './components/ChangeShipment';

// configure firebase connection
firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
});

// configure firestore
const firestore = firebase.firestore();

export default function App() {
    // create references and data arrays used in multiple components
    const caption = useRef();
    let shipment = [];
    const [inventory] = useCollectionData(firestore.collection('inventoryList').orderBy("timeStamp"), {
        idField: "id",
    });
    const inputs = {
        product: useRef(),
        price: useRef(),
        quantity: useRef()
    }

    // order inventory when loaded
    // reduce inventory to only have shipped products
    if (inventory) {
        reverseArr(inventory);
        for (let i of inventory) {
            if (i.ship) {
                shipment.push(i);
            }
        }
    }

    return (
        <div>
            {/* title */}
            <header>Inventory Tracker</header>
            <label className="caption" ref={caption}></label>

            {/* input fields */}
            <ChangeShipment firestore={firestore} shipment={shipment} />
            <Form inputs={inputs} firestore={firestore} caption={caption}></Form>

            {/* show tables of products */}
            {inventory ?
                <table className="full">
                    <tbody>
                        <tr>
                            <td width="50%">
                                <Inventory firestore={firestore} />
                            </td>

                            <td width="50%">
                                <Shipment shipment={shipment} />
                            </td>
                        </tr>
                    </tbody>
                </table> : null}
        </div>
    )
}