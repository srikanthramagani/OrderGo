import React, { useContext, useEffect, useState } from 'react';
import '../../styles/IndividualRestaurant.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { GeneralContext } from '../../context/GeneralContext';

const IndividualRestaurant = () => {
  const { fetchCartCount } = useContext(GeneralContext);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [AvailableCategories, setAvailableCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState([]);
  const [sortFilter, setSortFilter] = useState('popularity');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [cartItem, setCartItem] = useState('');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    fetchCategories();
    fetchItems();
    fetchRestaurant();
  }, []);

  useEffect(() => {
    if (!restaurant) return;
    filterAndSortItems();
  }, [items, categoryFilter, typeFilter, sortFilter, restaurant]);

  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(`http://localhost:6001/fetch-restaurant/${id}`);
      setRestaurant(res.data);
    } catch (err) {
      console.error("Failed to fetch restaurant:", err);
    }
  };

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:6001/fetch-categories');
    setAvailableCategories(res.data);
  };

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:6001/fetch-items');
    setItems(res.data);
    setVisibleItems(res.data);
  };

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    setCategoryFilter(prev =>
      e.target.checked ? [...prev, value] : prev.filter(c => c !== value)
    );
  };

  const handleTypeCheckBox = (e) => {
    const value = e.target.value;
    setTypeFilter(prev =>
      e.target.checked ? [...prev, value] : prev.filter(t => t !== value)
    );
  };

  const handleSortFilterChange = (e) => {
    setSortFilter(e.target.value);
  };

  const filterAndSortItems = () => {
    let filtered = items.filter(item =>
      String(item.restaurantId) === String(restaurant._id)
    );

    if (categoryFilter.length > 0) {
      filtered = filtered.filter(item => categoryFilter.includes(item.menuCategory));
    }

    if (typeFilter.length > 0) {
      filtered = filtered.filter(item => typeFilter.includes(item.category));
    }

    if (sortFilter === 'low-price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortFilter === 'high-price') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortFilter === 'discount') {
      filtered.sort((a, b) => b.discount - a.discount);
    } else if (sortFilter === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setVisibleItems(filtered);
  };

  const handleAddToCart = async (foodItemId, foodItemName, restaurantId, foodItemImg, price, discount) => {
    try {
      await axios.post('http://localhost:6001/add-to-cart', {
        userId, foodItemId, foodItemName, restaurantId, foodItemImg, price, discount, quantity
      });
      alert("Product added to cart!");
      setCartItem('');
      setQuantity(0);
      fetchCartCount();
    } catch (error) {
      alert("Failed to add product to cart!");
    }
  };

  return (
    <div className="IndividualRestaurant-page">
      {
        restaurant ?
          <>
            <h2>{restaurant.title}</h2>
            <p>{restaurant.address}</p>

            <div className="IndividualRestaurant-body">
              <div className="restaurants-filter">
                <h4>Filters</h4>

                <div className="restaurant-filters-body">
                  <div className="filter-sort">
                    <h6>Sort By</h6>
                    <div className="filter-sort-body sub-filter-body">
                      {['popularity', 'low-price', 'high-price', 'discount', 'rating'].map((filter, index) => (
                        <div className="form-check" key={filter}>
                          <input className="form-check-input" type="radio" name="sortFilter" value={filter} onChange={handleSortFilterChange} />
                          <label className="form-check-label">
                            {filter.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="filter-categories">
                    <h6>Food Type</h6>
                    <div className="filter-categories-body sub-filter-body">
                      {['Veg', 'Non Veg', 'Beverages'].map((type, index) => (
                        <div className="form-check" key={type}>
                          <input className="form-check-input" type="checkbox" value={type} checked={typeFilter.includes(type)} onChange={handleTypeCheckBox} />
                          <label className="form-check-label">{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="filter-categories">
                    <h6>Categories</h6>
                    <div className="filter-categories-body sub-filter-body">
                      {AvailableCategories.map((category, index) => (
                        <div className="form-check" key={category}>
                          <input className="form-check-input" type="checkbox" value={category} checked={categoryFilter.includes(category)} onChange={handleCategoryCheckBox} />
                          <label className="form-check-label">{category}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="restaurants-body">
                <h3>All Items</h3>
                <div className="restaurants">
                  {
                    visibleItems.length > 0 ? (
                      visibleItems.map((item) => (
                        <div className='restaurant-item' key={item._id}>
                          <div className="restaurant">
                            <img src={item.itemImg} alt={item.title} />
                            <div className="restaurant-data">
                              <h6>{item.title}</h6>
                              <p>{item.description.slice(0, 25)}...</p>
                              <h6>&#8377; {parseInt(item.price - (item.price * item.discount / 100))} <s>{item.price}</s></h6>

                              {cartItem === item._id ?
                                <>
                                  <input
                                    type="number"
                                    style={{ width: '60px', margin: '10px 0', fontSize: '0.7rem' }}
                                    placeholder='count'
                                    onChange={(e) => setQuantity(e.target.value)}
                                  /><br />
                                  <button className='btn btn-outline-primary' onClick={() =>
                                    handleAddToCart(item._id, item.title, item.restaurantId, item.itemImg, item.price, item.discount)}>
                                    Add to cart
                                  </button>
                                </>
                                :
                                <button className='btn btn-outline-primary' onClick={() => setCartItem(item._id)}>
                                  Add item
                                </button>
                              }
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No items available for this restaurant.</p>
                    )
                  }
                </div>
              </div>
            </div>
          </>
          :
          <p>Loading restaurant...</p>
      }
    </div>
  );
};

export default IndividualRestaurant;
