// This App is Deployed. See Live Site at:
// https://inventory-tracker-app.netlify.app

import React from 'react';
import { padDollar } from '../Helper';

export default function Shipment({ shipment }) {
    return (
        <div>
            <div className="title right">Shipment</div>
            <table className="shipment">
                <thead>
                    <tr>
                        <th width="50%">Product</th>
                        <th width="25%">Price (CAD)</th>
                        <th width="25%">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        shipment.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.product}</td>
                                    <td>{padDollar(item.price)}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
