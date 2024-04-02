import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Button } from "antd";

const DropdownFilter = React.memo(({ title, keyValue, options, onSelect, isClear, setIsClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const dropdownRef = useRef(null);
  const isHovered = useRef(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !isHovered.current) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onSelect(keyValue, checkedItems);
  }, [checkedItems]);

  useEffect(() => {
    if (isClear) {
      setIsClear(false);
      setCheckedItems([]); 
    }
  }, [isClear]);
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

  const selectedCount = checkedItems.length > 0 ? `(${checkedItems.length})` : '';

  return (
    <div
      ref={dropdownRef}
      className="dropdown"
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
    >
      <button className="buttonDropdown" onClick={toggleDropdown}>
        {title} {selectedCount}
        {isOpen ? <CaretUpOutlined className="ml-1" /> : <CaretDownOutlined className="ml-1" />}
      </button>
      

      {isOpen && (
        <div className="dropdown-content overflow-auto max-h-64">
          <ul className="">
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
});

const FilterComponent = ({ parameterOptions, setFilters }) => {
  const [isClear,setIsClear] = useState(false);
  const handleSelect = (key, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[key] = value;
      return updatedFilters;
    });
  };

  const handleClearAll = () => {
    setIsClear(true);
    parameterOptions.forEach((parameter) => {
      const key = parameter.key;
      setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: []
      }));
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
          isClear={isClear}
          setIsClear={setIsClear}
        />
      ))}
      <Button type="link" className="clearFilter" block onClick={handleClearAll}>
        Tümünü Temizle
      </Button>
    </div>
  );
};

export default FilterComponent;
