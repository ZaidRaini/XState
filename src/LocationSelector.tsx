import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function LocationSelector() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const fetchCountries = async () => {
    try {
      const res = await axios.get(
        "https://crio-location-selector.onrender.com/countries"
      );
      return res.data;
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      throw error; // Re-throw the error to trigger the `error` state in useQuery
    }
  };

  const fetchStates = async () => {
    if (!selectedCountry) return [];
    try {
      const res = await axios.get(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
      );
      return res.data;
    } catch (error) {
      console.error("Failed to fetch states:", error);
      throw error; // Re-throw the error to trigger the `error` state in useQuery
    }
  };

  const fetchCities = async () => {
    if (!selectedCountry || !selectedState) return [];
    try {
      const res = await axios.get(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
      );
      return res.data;
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      throw error; // Re-throw the error to trigger the `error` state in useQuery
    }
  };

  const {
    data: countries = [],
    isLoading: loadingCountries,
    error: countriesError,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const {
    data: states = [],
    isLoading: loadingStates,
    error: statesError,
  } = useQuery({
    queryKey: ["states", selectedCountry],
    queryFn: fetchStates,
    enabled: !!selectedCountry, // Only fetch when a country is selected
  });

  const {
    data: cities = [],
    isLoading: loadingCities,
    error: citiesError,
  } = useQuery({
    queryKey: ["cities", selectedCountry, selectedState],
    queryFn: fetchCities,
    enabled: !!selectedCountry && !!selectedState, // Fetch when country & state are selected
  });

  return (
    <>
      <div className="flex gap-10 justify-center w-full mt-10">
        {/* Country Dropdown */}
        <select
          className="p-2 border rounded w-80"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedState(""); // Reset state when country changes
          }}
        >
          <option value="" disabled selected>
            Select Country
          </option>
          {!loadingCountries &&
            !countriesError &&
            countries.map((country: string) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
        </select>

        {/* State Dropdown */}
        <select
          className="p-2 border rounded"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          disabled={!selectedCountry || loadingStates}
        >
          <option value="" disabled selected>
            Select State
          </option>
          {!loadingStates &&
            !statesError &&
            states.map((state: string) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
        </select>

        {/* City Dropdown */}
        <select
          className="p-2 border rounded"
          disabled={!selectedState || loadingCities}
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="" disabled selected>
            Select City
          </option>
          {!loadingCities &&
            !citiesError &&
            cities.map((city: string) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
        </select>
      </div>
      {selectedCity && selectedState && selectedCountry && (
        <p className="mt-5 text-center font-semibold">
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </p>
      )}
    </>
  );
}
