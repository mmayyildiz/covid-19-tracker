import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import useDropdown from './useDropdown';
import axios from 'axios';

function App() {
  const rerenderRef = useRef(false);
  const [total, setTotal] = useState({});
  const [affectedCountries, setAffectedCountries] = useState({});
  const [country, CountryDropdown] = useDropdown(
    '',
    'Global',
    Object.keys(affectedCountries)
  );

  useEffect(() => {
    let affectedCountries = {};

    async function fetcTotal() {
      try {
        const res = await axios.get(
          'https://covid2019-api.herokuapp.com/v2/total'
        );
        affectedCountries = { Global: res.data.data };
        setTotal(res.data.data);
      } catch (e) {
        console.log('error : ' + e);
      }
    }

    async function fetchAffectedCountries() {
      try {
        const res = await axios.get(
          'https://covid2019-api.herokuapp.com/current_list'
        );
        affectedCountries = { ...affectedCountries, ...res.data.countries[0] };
      } catch (e) {
        console.log('error : ' + e);
      }
      setAffectedCountries(affectedCountries);
    }
    fetcTotal();
    fetchAffectedCountries();
  }, []);

  useEffect(() => {
    if (rerenderRef.current) {
      setTotal(affectedCountries[country]);
    } else {
      rerenderRef.current = true;
    }
  }, [country]);

  return (
    <>
      <div className="main-nav">
        <div className="nav-header">
          <div>
            <img className="logo" src="images/logo.png"></img>
          </div>
          <div className="title">
            <span>COVID19 TRACKER</span>
          </div>
        </div>
        <div className="nav-links">
          <div className="link">
            <a href="#">HOME</a>
          </div>
          <div className="link">
            <a href="#">WHAT IS COVID-19</a>
          </div>
          <div className="link">
            <a href="#">PREVENTION</a>
          </div>
        </div>
      </div>
      <div className="body-content">
        <div className="stat-header">
          <div className="py-1">
            <span className="text-red blink">LIVE</span>
          </div>
          <div className="py-1">
            <label className="font-bold">Stats Overview</label>
          </div>
          <div className="py-1">
            <CountryDropdown />
          </div>
        </div>
        <div className="stat-box text-red">
          <div className="flex-auto pt-2 bg-red-100">
            <span className="lg-text">
              {total.confirmed
                ? new Intl.NumberFormat('en-IN').format(total.confirmed)
                : '-'}
            </span>
          </div>
          <div className="py-1 bg-red-200">
            <span>Confirmed</span>
          </div>
        </div>
        <div className="stat-box text-green">
          <div className="flex-auto pt-2 bg-green-100">
            <span className="lg-text">
              {total.recovered
                ? new Intl.NumberFormat('en-IN').format(total.recovered)
                : '-'}
            </span>
          </div>
          <div className="py-1 bg-green-200">
            <span>Recovered</span>
          </div>
        </div>
        <div className="stat-box text-gray">
          <div className="flex-auto pt-2 bg-gray-100">
            <span className="lg-text">
              {total.deaths
                ? new Intl.NumberFormat('en-IN').format(total.deaths)
                : '-'}
            </span>
          </div>
          <div className="py-1 bg-gray-200">
            <span>Deaths</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
