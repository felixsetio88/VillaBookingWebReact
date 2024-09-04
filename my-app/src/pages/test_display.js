
import { useEffect, useState, useContext } from 'react'
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';

const Test_display = () => {
  const [hotels, sethotels] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const {user} = useContext(AuthContext);

  const [order, setOrder] = useState({
    user: undefined,
    hotel: undefined,
    startDate: undefined,
    endDate: undefined, 
    orderDate: undefined,
    confirmed: false,
    total: undefined,
  })

  useEffect(() => {
    axios.get('/hotels/') // Adjust the API endpoint as needed
      .then(response => {
        sethotels(response.data);
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
      });
  }, []);

  const handleBuy = (hotelId, availableStock) => {
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
      <h1>Available hotels</h1>
      {hotels.map(hotel => (
        <div key={hotel._id}>
          <h2>{hotel.title}</h2>
          <p>{hotel.description}</p>
          <p>Price: ${hotel.price}</p>
          <p>Available Stock: {hotel.stock}</p>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            min="1"
            
          />
          <button onClick={() => handleBuy(hotel._id)}>Buy</button>
        </div>
      ))}
    </div>
  );
};

export default Test_display;
