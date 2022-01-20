import React, { Component } from "react";
import axios from "axios";
import ArraySort from "array-sort";
import "./Countries.css";
import HeadingNames from "../../components/HeadingNames/HeadingNames";
import CountryDetails from "../../components/CountryDetails/CountryDetails";
import arraySort from "array-sort";

export default class Countries extends Component {
  state = {
    countryDetails: [],
    searchCountries: [],
  };
  async componentDidMount() {
    var data = await axios.get("https://api.covid19api.com/summary");
    var countryDetails = data.data.Countries;
    countryDetails = ArraySort(countryDetails, "TotalConfirmed", {
      reverse: true,
    });

    this.setState({
      countryDetails: countryDetails,
      status: true,
      selectedData: countryDetails,
    });
  }
  ChangeSortValue = (e) => {
    const value = e.target.value;
    let sortByReverse = true;
    if (value === "Highest") {
      sortByReverse = true;
    } else {
      sortByReverse = false;
    }

    let countryDetails = ArraySort(
      this.state.countryDetails,
      "TotalConfirmed",
      { reverse: sortByReverse }
    );

    this.setState({ countryDetails: countryDetails, status: true });
  };

  searchCountry = (e) => {
    const value = e.target.value;
    const countryDetails = this.state.countryDetails;
    var FindSpecificCountry = [];

    if (value) {
      countryDetails.map(function (cur, index) {
        const finder = cur.Country.toLowerCase().search(value.toLowerCase());
        if (finder !== -1) {
          FindSpecificCountry.push(countryDetails[index]);
        }
      });

      FindSpecificCountry = ArraySort(FindSpecificCountry, "TotalConfirmed", {
        reverse: true,
      });
      this.setState({ searchCountries: FindSpecificCountry });
    } else {
      this.setState({ countryDetails: countryDetails });
    }
    if (value.length === 0) {
      this.setState({ selectedData: this.state.countryDetails });
    } else {
      this.setState({ selectedData: this.state.searchCountries });
    }
  };
  render() {
    var countriesList =
      this.state.countryDetails.length > 0
        ? this.state.selectedData.map(function (cur, index) {
            return (
              <CountryDetails
                key={index}
                countryCode={cur.CountryCode}
                totalCases={cur.TotalConfirmed}
                newCases={cur.NewConfirmed}
                totalDeaths={cur.TotalDeaths}
                newDeaths={cur.NewDeaths}
                totalRecovered={cur.TotalRecovered}
                newRecovered={cur.NewRecovered}
              />
            );
          })
        : null;

    return (
      <div className="countries-stats">
        <h2 className="countries-stats-heading">Countries Stats</h2>

        <div className="Filtering">
          <input
            type="text"
            placeholder="Enter Country Name"
            onChange={this.searchCountry}
          />
          <select className="sort-by" onChange={this.ChangeSortValue}>
            <option>Highest</option>
            <option>Lowest</option>
          </select>
        </div>

        <HeadingNames />
        {countriesList}
      </div>
    );
  }
}
