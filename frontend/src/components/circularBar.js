import React, { useEffect, useState } from "react";
 
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
 
export default function CircularBar({ nominee }) {
 
    const [isOpen, setIsOpen] = useState(false);
 
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
 
  return (
    <div className="flex flex-row justify-between items-center mb-2 rounded-2xl py-2 px-2 bg-white">
      <div className="relative">
        <div className="text-m  text-center bg-gray-100 text-black p-2 mr-4 w-full rounded-2xl">
          <h4 className="font-bold text-2xl mb-2 text-left  ">
            {nominee.cv.name}
          </h4>
          <div className="text-left font-semibold text-sm underline">
            <button
              className="items-center justify-center grid grid-cols-2"
              onClick={toggleDropdown}
            >
              <div className="underline">
                {nominee.commonSkills.length} Yetenek Eşleşiyor
              </div>
              <CaretDownOutlined className="mx-1" />
            </button>
          </div>
        </div>
 
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 py-2 px-4 bg-white border rounded shadow-lg">
            <p className="font-semibold mb-1">Eşleşen Yetenekler:</p>
            <ul>
              {nominee.commonSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
 
      <div
        style={{
          width: 70,
          height: 70,
        }}
        className="progress"
      >
        <CircularProgressbar
          value={nominee.score}
          text={`${nominee.score}%`}
          styles={buildStyles({
            rotation: 0,
 
            textSize: "20px",
            textColor: "black",
 
            pathTransitionDuration: 0.5,
 
            pathColor:
              nominee.score >= 90
                ? "#4bfc04"
                : nominee.score >= 80
                ? "#63ff00"
                : nominee.score >= 70
                ? "#d6ff00"
                : nominee.score >= 60
                ? "#ffff00"
                : nominee.score >= 50
                ? "#ffc100"
                : "#ff0000",
 
            // textColor:
            //   nominee.score >= 90
            //     ? "#4bfc04"
            //     : nominee.score >= 80
            //     ? "#63ff00"
            //     : nominee.score >= 70
            //     ? "#d6ff00"
            //     : nominee.score >= 60
            //     ? "#ffff00"
            //     : nominee.score >= 50
            //     ? "#ffc100"
            //     : "#ff0000",
            trailColor: "#d6d6d6",
            backgroundColor: "#3e98c7",
          })}
        />
      </div>
    </div>
  );
}