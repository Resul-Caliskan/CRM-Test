import React, { useState } from "react";
import { FaTimes, FaSearch } from "react-icons/fa";
import Highlighter from "react-highlight-words"; 

const SearchInput = ({ searchTerm, onSearch }) => {
    const [inputValue, setInputValue] = useState(searchTerm);

    const handleChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        onSearch(value);
    };

    const handleClearInput = () => {
        setInputValue("");
        onSearch("");
    };

    return (
        <div className="relative flex justify-center items-center py-5 ">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Arama yapın..."
                    value={inputValue}
                    onChange={handleChange}
                    className="p-2 border border-gray-500 rounded-md w-80 pr-10"
                />
                {inputValue && (
                    <FaTimes
                        className="text-red-500 cursor-pointer absolute right-3 top-3"
                        onClick={handleClearInput}
                    />
                )}
                {!inputValue && (
                    <FaSearch className="text-gray-500 absolute right-3 top-3 pointer-events-none" />
                )}
            </div>

            
        </div>
    );
};

export default SearchInput;
