
import { useEffect, useState, useContext } from 'react'
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Test_display = () => {
  const [villas, setvillas] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const {user} = useContext(AuthContext);

  const [order, setOrder] = useState({
    user: undefined,
    villa: undefined,
    startDate: undefined,
    endDate: undefined, 
    orderDate: undefined,
    confirmed: false,
    total: undefined,
  })

  useEffect(() => {
    axios.get('/villas/') // Adjust the API endpoint as needed
      .then(response => {
        setvillas(response.data);
      })
      .catch(error => {
        console.error('Error fetching villas:', error);
      });
  }, []);

  const handleBuy = (villaId, availableStock) => {
    if (quantity <= 0 || quantity > availableStock) {
      alert('Invalid quantity');
      return;
    }

    axios.post('/order/create-order', order
      )
      .then(response => {
        alert('Order created successfully'); 
      })
      .catch(error => {
        console.error('Error creating order:', error);
      });
  };

  return (
    <div>
      <h1>Available villas</h1>
      {villas.map(villa => (
        <div key={villa._id}>
          <h2>{villa.title}</h2>
          <p>{villa.description}</p>
          <p>Price: ${villa.price}</p>
          <p>Available Stock: {villa.stock}</p>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            min="1"
            
          />
          <button onClick={() => handleBuy(villa._id)}>Buy</button>
        </div>
      ))}
    </div>
  );
};

export default Test_display;
