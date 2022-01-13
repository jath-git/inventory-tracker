import React from 'react';
import { updateCollection, deleteCollection } from '../Helper';
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Inventory({ firestore }) {
    // retrieve inventory
    const collectionInventory = firestore.collection('inventoryList');
    const [inventory] = useCollectionData(collectionInventory.orderBy("timeStamp"), {
        idField: "id",
    });

    // change current quantity by 1
    // delete inventory if not enough inventory
    const changeQuantity = (index, isIncrease) => {
        let increment = -1;
        if (isIncrease === true) {
            increment = 1;
        } else if (inventory[index].quantity <= 0) {
            deleteInventory(index);
            return;
        }

        updateCollection(collectionInventory, inventory[index].id, { quantity: inventory[index].quantity + increment });
    }

    // delete the index-th row from inventory data
    const deleteInventory = index => {
        deleteCollection(collectionInventory, inventory[index].id);
    }

    return (
        <div>
            <div className="title">Inventory</div>
            <table className="list">
                <thead>
                    <tr>
                        <th width="10%">Shipment</th>
                        <th width="40%">Product</th>
                        <th width="20%">Price (CAD)</th>
                        <th width="20%">Quantity</th>
                        <th width="10%">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {!inventory ? null :
                        inventory.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td><input type="checkbox" checked={item.ship} onChange={() => updateCollection(collectionInventory, item.id, { ship: !item.ship })}></input></td>
                                    <td>{item.product}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td className="edit">
                                        <button onClick={() => changeQuantity(index, true)}>+</button>
                                        <button onClick={() => changeQuantity(index, false)}>-</button>
                                        <img alt="trash" src="assets/trash.png" width="10px" onClick={() => deleteInventory(index)} />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
