import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Restaurants.css';
import { useNavigate } from 'react-router-dom';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:6001/fetch-restaurants')
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error("Error fetching restaurants:", err));
  }, []);

  return (
    <div className="restaurants-container">
      <div className="restaurants-filter">
        <h4>Filters</h4>
        <div className="restaurant-filters-body">

          <div className="filter-sort">
            <h6>Sort By</h6>
            <div className="filter-sort-body sub-filter-body">
              <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio1" />
                <label className="form-check-label" htmlFor="filter-sort-radio1">Popularity</label>
              </div>

              <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio2" />
                <label className="form-check-label" htmlFor="filter-sort-radio2">Rating</label>
              </div>
            </div>
          </div>

          <div className="filter-categories">
            <h6>Categories</h6>
            <div className="filter-categories-body sub-filter-body">
              {["South Indian", "North Indian", "Chinese", "Beverages", "Ice Cream", "Tiffins"].map((category, i) => (
                <div className="form-check" key={i}>
                  <input className="form-check-input" type="checkbox" id={`filter-category-check-${i}`} />
                  <label className="form-check-label" htmlFor={`filter-category-check-${i}`}>{category}</label>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="restaurants-body">
        <h3>All Restaurants</h3>
        <div className="restaurants">
          {restaurants.map((restaurant) => (
            <div className='restaurant-item' key={restaurant._id}>
              <div className="restaurant" onClick={() => navigate(`/restaurant/${restaurant._id}`)}>
                <img src={restaurant.mainImg} alt={restaurant.title} />
                <div className="restaurant-data">
                  <h6>{restaurant.title}</h6>
                  <p>{restaurant.address}</p>
                  <h5>Rating: <b>{restaurant.rating || "N/A"}/5</b></h5>
                </div>
              </div>
            </div>
          ))}

          {restaurants.length === 0 && <p style={{ marginTop: "2rem" }}>No restaurants available.</p>}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;
