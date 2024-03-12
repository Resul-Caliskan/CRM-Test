import React, { useState } from "react";
import filterFunction from "./filterFunction";

const SideFilterComponent = ({ data, filterFields, onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (field, value) => {
    const newSelectedFilters = { ...selectedFilters, [field]: value };
    setSelectedFilters(newSelectedFilters);

    const filteredData = data.filter((item) =>
      filterFunction(filterFields, item, newSelectedFilters[field])
    );

    onFilterChange(filteredData);
  };

  return (
    <div>
      {filterFields.map((field) => (
        <div key={field}>
          <label>{field}</label>
          <select
            value={selectedFilters[field] || ""}
            onChange={(e) => handleFilterChange(field, e.target.value)}
          >
            <option value="">Hepsi</option>
            {data
              .map((item) => item[field])
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default SideFilterComponent;
