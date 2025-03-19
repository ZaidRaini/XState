import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function LocationSelector() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const fetchCountries = async () => {
    const res = await axios.get(
      "https://crio-location-selector.onrender.com/countries"
    );
    return res.data;
  };

  const fetchStates = async () => {
    if (!selectedCountry) return [];
    const res = await axios.get(
      `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
    );
    return res.data;
  };

  const fetchCities = async () => {
    if (!selectedCountry || !selectedState) return [];
    const res = await axios.get(
      `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
    );
    return res.data;
  };

  const { data: countries = [], isLoading: loadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const { data: states = [], isLoading: loadingStates } = useQuery({
    queryKey: ["states", selectedCountry],
    queryFn: fetchStates,
    enabled: !!selectedCountry, // Only fetch when a country is selected
  });

  const { data: cities = [], isLoading: loadingCities } = useQuery({
    queryKey: ["cities", selectedCountry, selectedState],
    queryFn: fetchCities,
    enabled: !!selectedCountry && !!selectedState, // Fetch when country & state are selected
  });

  return (
    <div className="flex  gap-4  justify-evenly  w-full mt-10  ">
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
        {loadingCountries ? (
          <option>Loading...</option>
        ) : (
          countries.map((country: string) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))
        )}
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
        {loadingStates ? (
          <option>Loading...</option>
        ) : (
          states.map((state: string) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))
        )}
      </select>

      {/* City Dropdown */}
      <select
        className="p-2 border rounded"
        disabled={!selectedState || loadingCities}
      >
        <option value="" disabled selected>
          Select City
        </option>
        {loadingCities ? (
          <option>Loading...</option>
        ) : (
          cities.map((city: string) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
