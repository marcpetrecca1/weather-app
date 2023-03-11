import React, { useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { StartingLocation } from '../model';

interface LocationSearchProps {
  setLocation: (newLocation: StartingLocation) => any;
}

const LocationSearchInput: React.FC<LocationSearchProps> = ({
  setLocation,
}) => {
  const [address, setAddress] = useState('');

  const handleChange = (address: string) => {
    setAddress(address);
  };

  const handleSelect = (address: string) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) =>
        setLocation({
          latitude: latLng.lat.toString(),
          longitude: latLng.lng.toString(),
        })
      )
      .catch((error) => console.error('Error', error));
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input',
            })}
            value={address}
          />
          <div className='autocomplete-dropdown-container'>
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? 'suggestion-item--active'
                : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                  key={suggestion.description}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default LocationSearchInput;
