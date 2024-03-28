import React, { useState, useEffect } from "react";
import "./style.css";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

const DropdownFilter = ({ title, keyValue, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    onSelect(keyValue, checkedItems);
  }, [checkedItems]);

  const handleCheckboxChange = (value) => {
    let newCheckedItems = [];
    if (value === "__TUMU__") {
      newCheckedItems = checkedItems.length === options.length ? [] : options;
    } else {
      const currentIndex = checkedItems.indexOf(value);
      newCheckedItems = [...checkedItems];
      if (currentIndex === -1) {
        newCheckedItems.push(value);
      } else {
        newCheckedItems.splice(currentIndex, 1);
      }
    }
    setCheckedItems(newCheckedItems);
  };

  return (
    <div className="dropdown">
      <button className="buttonDropdown" onClick={toggleDropdown}>
        {title }
        {isOpen ? <CaretUpOutlined className="ml-1" /> : <CaretDownOutlined className="ml-1" />}
      </button>

      {isOpen && (
        <div className="dropdown-content overflow-auto max-h-64">
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={checkedItems.length === options.length}
                  onChange={() => handleCheckboxChange("__TUMU__")}
                />
                Tümü
              </label>
            </li>
            {options.map((option) => (
              <li key={option}>
                <label>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const FilterComponent = ({ parameterOptions, setFilters }) => {
  const handleSelect = (key, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[key] = value;
      return updatedFilters;
    });
  };

  return (
    
      <div className="flex flex-row gap-10 items-center justify-center ">
        {parameterOptions.map((parameter) => (
          <DropdownFilter
            key={parameter.title}
            keyValue={parameter.key}
            title={parameter.title}
            options={parameter.values}
            onSelect={handleSelect}
          />
        ))}
      </div>
    
  );
};

export default FilterComponent;
