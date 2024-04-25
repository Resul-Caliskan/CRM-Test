import React, { useState, useEffect } from "react";
import { Button, Checkbox, Input } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
const VerticalFilterContainer = ({
  parameterOptions,
  isHorizontal,
  setFilters,
}) => {
  const [searchTerms, setSearchTerms] = useState({});
  const [checkedItems, setCheckedItems] = useState([]);
  const [openParameters, setOpenParameters] = useState({});
  const [isClear, setIsClear] = useState(false);
  useEffect(() => {
    const initialOpenParameters = {};
    parameterOptions.forEach((parameter) => {
      initialOpenParameters[parameter.title] = true;
    });
    setOpenParameters(initialOpenParameters);
  }, [parameterOptions]);
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
  const handleSearchChange = (title, value) => {
    setSearchTerms((prevSearchTerms) => ({
      ...prevSearchTerms,
      [title]: value,
    }));
  };

  const toggleParameter = (title) => {
    setOpenParameters((prevOpenParameters) => ({
      ...prevOpenParameters,
      [title]: !prevOpenParameters[title],
    }));
  };

  const handleCheckboxChange = (options, value) => {
    let newCheckedItems = [];
    if (value === "__TUMU__") {
      newCheckedItems =
        checkedItems.length === options.length ? [] : options;
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

  const filterOptions = (options, searchTerm) => {
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSelect = (key, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      const currentFilter = updatedFilters[key] || [];

      let newFilter;
      if (value === "__TUMU__") {
        newFilter =
          currentFilter.length ===
          parameterOptions.find((param) => param.key === key).values.length
            ? []
            : parameterOptions.find((param) => param.key === key).values;
      } else {
        const currentIndex = currentFilter.indexOf(value);
        newFilter = [...currentFilter];
        if (currentIndex === -1) {
          newFilter.push(value);
        } else {
          newFilter.splice(currentIndex, 1);
        }
      }

      updatedFilters[key] = newFilter;
      return updatedFilters;
    });
  };

  return (
    <div className={`filter-container ${isHorizontal ? "horizontal" : "vertical"}`}>
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
      <ul className="filter-list">
        {parameterOptions.map((parameter) => (
          <li key={parameter.title}>
            <span
              className="filterTitle"
              onClick={() => toggleParameter(parameter.title)}
            >
              {parameter.title} {openParameters[parameter.title] ? (
                <CaretUpOutlined className="ml-1" />
              ) : (
                <CaretDownOutlined className="ml-1" />
              )}
            </span>
            {openParameters[parameter.title] && (
              <div>
                <Input
                  allowClear={true}
                  placeholder="Ara..."
                  value={searchTerms[parameter.title] || ""}
                  onChange={(e) =>
                    handleSearchChange(parameter.title, e.target.value)
                  }
                  className="mb-2 mt-2 h-8"
                />
                <ul className="filter-values">
                  {filterOptions(parameter.values, searchTerms[parameter.title] || "").map((value) => (
                    <li
                      key={value}
                      onChange={() => handleSelect(parameter.key, value)}
                    >
                      <label>
                        <Checkbox
                          type="checkbox"
                          className="pr-2"
                          onChange={() =>
                            handleCheckboxChange(parameter.values, value)
                          }
                        />
                        {value}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerticalFilterContainer;
