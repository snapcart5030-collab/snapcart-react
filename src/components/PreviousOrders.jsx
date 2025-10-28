import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {MyOrders_Url,OrderStatusById_Url} from './Api_URL_Page'


function PreviousOrders() {
  const [orders, setOrders] = useState([]);
  const [cookies] = useCookies(["token"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch only delivered orders
  const fetchPreviousOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${MyOrders_Url()}/orders/myorders`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });

      const delivered = await Promise.all(
        res.data.map(async (order) => {
          try {
            const statusRes = await axios.get(
              `${OrderStatusById_Url()}/orderstatus/${order._id}`
            );
            if (statusRes.data.status === "delivered") {
              return { ...order, status: "delivered" };
            }
            return null;
          } catch {
            return null;
          }
        })
      );

      setOrders(delivered.filter(Boolean));
    } catch (err) {
      setError("Failed to load delivered orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cookies.token) fetchPreviousOrders();
  }, [cookies]);

  return (
    <div className="container mt-5">
      <h2>✅ Delivered Orders</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && orders.length === 0 && <p>No delivered orders yet.</p>}

      {orders.length > 0 && (
        <table className="table mt-3 table-striped table-hover">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) =>
              order.products?.map((item, i) => {
                const date = new Date(order.createdAt);
                return (
                  <tr key={`${order._id}-${i}`}>
                    <td>
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.price * item.quantity}</td>
                    <td>{date.toLocaleDateString("en-IN")}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PreviousOrders;
