import React, { useEffect, useState } from "react";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

export default function CircularBar({ nominee, isKnown = true }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="relative">
        <div className="text-m  text-cente text-black pb-2 mr-4 w-full rounded-2xl">
          <h4 className="font-bold text-xl mb-2 text-left  ">
            {isKnown ?nominee.cv.name : "Bilinmiyor"}
          </h4>
          <h3 className="text-sm text-[#6D6D6D]">{nominee.cv.title}</h3>
          {/* <div className="text-left font-semibold text-sm underline">
            <button
              className="items-center justify-center grid grid-cols-2"
              onClick={toggleDropdown}
            >
              <div className="underline">
                {nominee.commonSkills.length} Yetenek Eşleşiyor
              </div>
              <CaretDownOutlined className="mx-1" />
            </button>
          </div> */}
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

      <div className="w-[48px] mb-2 h-[48px] sm:w-[60px] h-[60px] mb-4 lg:w-[48px] mb-2 h-[48px]">
        <CircularProgressbar
          value={nominee.score}
          strokeWidth={5}
          text={`%${nominee.score}`}
          styles={buildStyles({
            rotation: 90,

            textSize: "20px",
            textColor: "black",

            pathTransitionDuration: 0.5,

            pathColor: "#0057D9",
            // nominee.score >= 90
            //   ? "#4bfc04"
            //   : nominee.score >= 80
            //   ? "#63ff00"
            //   : nominee.score >= 70
            //   ? "#d6ff00"
            //   : nominee.score >= 60
            //   ? "#ffff00"
            //   : nominee.score >= 50
            //   ? "#ffc100"
            //   : "#ff0000",

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
            trailColor: "#E0E0E0",
            backgroundColor: "#3e98c7",
          })}
        />
      </div>
    </div>
  );
}
