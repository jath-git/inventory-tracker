import React from 'react'

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
                                    <td>{item.price}</td>
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
