import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import VerticalFilterContainer from "./filterMenu"; 
 
const DropdownFilter = React.memo(
  ({
    title,
    keyValue,
    options,
    onSelect,
    isClear,
    setIsClear,
    isOpenInitially,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const isHovered = useRef(false);
 
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
 
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          !isHovered.current
        ) {
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
        setSearchTerm("");
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
 
    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
 
    const selectedCount =
      checkedItems.length > 0 ? `(${checkedItems.length})` : "";
 
    return (
      <div
        ref={dropdownRef}
        className="dropdown"
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
      >
        <button className="buttonDropdown" onClick={toggleDropdown}>
          {title} {selectedCount}
          {isOpen ? (
            <CaretUpOutlined className="ml-1" />
          ) : (
            <CaretDownOutlined className="ml-1" />
          )}
        </button>
 
        {isOpen && (
          <div className="dropdown-content overflow-auto max-h-64">
            <Input
              allowClear={true}
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2 mt-2 h-8"
            />
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
              {filteredOptions.map((option) => (
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
  }
);
 
const FilterComponent = ({
  parameterOptions,
  setFilters,
  isHorizontal = true,
}) => {
  const [isClear, setIsClear] = useState(false);
  const [openParameters, setOpenParameters] = useState({});
 
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
        [key]: [],
      }));
    });
    setOpenParameters({});
  };
 
  const toggleParameter = (title) => {
    setOpenParameters((prevOpenParameters) => ({
      ...prevOpenParameters,
      [title]: !prevOpenParameters[title],
    }));
  };
 
  return (
    <>
      {isHorizontal ? (
        <div
          className={`flex ${
            isHorizontal ? "flex-row" : "flex-col"
          } gap-10 items-center justify-center mt-3`}
        >
          {!isHorizontal && (
            <Button
              type="link"
              className="clearFilter"
              block={!isHorizontal}
              onClick={handleClearAll}
            >
              Tümünü Temizle
            </Button>
          )}
          {parameterOptions.map((parameter) => (
            <DropdownFilter
              key={parameter.title}
              keyValue={parameter.key}
              title={parameter.title}
              options={parameter.values}
              onSelect={handleSelect}
              isClear={isClear}
              setIsClear={setIsClear}
              isOpenInitially={!isHorizontal}
            />
          ))}
          {isHorizontal && (
            <Button
              type="link"
              className="clearFilter"
              block={!isHorizontal}
              onClick={handleClearAll}
            >
              Tümünü Temizle
            </Button>
          )}
        </div>
      ) : (
        <VerticalFilterContainer
          parameterOptions={parameterOptions}
          handleSelect={handleSelect}
          isHorizontal={isHorizontal}
          setFilters={setFilters}
        />
      )}
    </>
  );
};
 
export default FilterComponent;