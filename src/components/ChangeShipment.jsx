import React from 'react';
import { addAllCollection, deleteAllCollection, addCollection, updateCollection } from '../Helper';
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat/app";

export default function ChangeShipment({ firestore, shipment }) {
    // retrive data
    const collectionShipment = firestore.collection('shipmentList');
    const collectionInventory = firestore.collection('inventoryList');
    const [shipmentList] = useCollectionData(collectionShipment.orderBy("timeStamp"), {
        idField: "id",
    });
    const [inventory] = useCollectionData(collectionInventory.orderBy("timeStamp"), {
        idField: "id",
    });

    // change inventory data
    const changeShipment = (counterIncrement) => {
        const currentCounter = shipmentList[0].counter + counterIncrement;
        updateCollection(collectionShipment, shipmentList[0].id, { counter: currentCounter });

        deleteAllCollection(collectionInventory, inventory);
        if (currentCounter > 0) {
            addAllCollection(collectionInventory, shipmentList[currentCounter].data);
        }
    }

    // make all inventory not shipped
    const removeShipment = () => {
        for (let i of inventory) {
            updateCollection(collectionInventory, i.id, { ship: false });
        }
    }

    return (
        <div className="change">
            <button className={shipmentList && shipmentList.length > 1 && shipmentList[0].counter > 0 ? 'enabled' : 'disabled'} onClick={() => {
                if (shipmentList && shipmentList.length > 1 && shipmentList[0].counter > 0) {
                    changeShipment(-1);
                }
            }}>Load Previous Shipment</button>
            <button className={shipmentList && shipmentList.length > 1 && shipmentList.length > shipmentList[0].counter + 1 ? 'enabled' : 'disabled'} onClick={() => {
                if (shipmentList && shipmentList.length > 1 && shipmentList.length > shipmentList[0].counter + 1) {
                    changeShipment(1);
                }
            }}>Load Next Shipment</button>
            <button className={shipment.length > 0 ? 'enabled' : 'disabled'} onClick={() => {
                if (shipment.length > 0) {
                    if (shipmentList) {
                        if (shipmentList.length === 0) {
                            addCollection(collectionShipment, { counter: 0, timeStamp: firebase.firestore.FieldValue.serverTimestamp() })
                        }

                        addCollection(collectionShipment, { data: inventory, timeStamp: firebase.firestore.FieldValue.serverTimestamp() });
                        removeShipment();
                    }
                }
            }}>Save Current Shipment</button>
        </div>
    )
}
