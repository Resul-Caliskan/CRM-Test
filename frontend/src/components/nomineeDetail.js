import {
  LaptopOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import logo from "../assets/link.png";
import phoneIcon from "../assets/phone.png";
import mailIcon from "../assets/email.png";
import degreeIcon from "../assets/school.png";
 
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
 
export default function NomineeDetail({ nominee, onClose, isKnown }) {
  const [activeTab, setActiveTab] = useState("experience");
  const { t } = useTranslation();
  if (!nominee) {
    return null;
  }
 
  const censorMail = (text) => {
    const parts = text.split("@");
    const censoredUsername = parts[0].charAt(0) + "*****"; // Sadece ilk harf ve beş yıldız göster
    const censoredEmail = censoredUsername + "@" + parts[1];
    return censoredEmail;
  };
 
  const censorText = (text) => {
    const words = text.split(" ");
 
    let censoredText = "";
 
    words.forEach((word) => {
      const wordLength = word.length;
 
      const censoredWord = word.charAt(0) + "*".repeat(wordLength - 1);
 
      censoredText += censoredWord + " ";
    });
 
    return censoredText.trim();
  };
 
  const censorPhoneNumber = (phoneNumber) => {
    const censored = phoneNumber.replace(
      /(\d{3})-(\d{3})-(\d{4})/,
      "***-***-$3"
    );
    return censored;
  };
 
  const censorLinkedInUrl = (url) => {
    const parts = url.split("/");
    const username = parts[parts.length - 1];
    const censoredUrl = url.replace(username, "*****");
    return censoredUrl;
  };
 
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-gray-400 bg-opacity-90"
      onClick={onClose}
    >
      <div
        className="flex flex-col  w-3/5 h-[670px] overflow-auto p-4 rounded-lg border shadow bg-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center h-[100px] border-b-2 border-gray-200 pb-2 bg-white p-[16px 24px] gap-16 border-t-0 border-l-0 border-b-0 rounded-md">
          <div className="w-full mb-4">
            <div className="mt-5">
              <div
                className={
                  isKnown
                    ? "text-2xl text-[#383838] font-sans font-medium ml-6"
                    : "text-lg text-gray-700 ml-6"
                }
              >
                {isKnown ? nominee.name : t("nomineeDetail.unknown")}
              </div>
              <div className="text-sm text-[#ADADAD] ml-6 bg-white">
                {nominee.title}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-md p-2 mt-2">
          <div className="grid grid-cols-2 w-auto">
            <div className=" w-full min-w-[265px]">
              <div className="flex flex-wrap">
                <div className="text-xs font-sans">
                  {t("nomineeDetail.tags")}
                  <div className="mb-4 mt-2 flex flex-wrap inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-[#2B4D55]">
                    Junior
                  </div>
                </div>
              </div>
 
            </div>
            <div className="w-[100px]">
              <div className="text-xs font-sans w-auto">
                {t("nomineeDetail.source")}
                <div className="mb-4 mt-2 flex flex-wrap inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-[#2B4D55]">
                  Referans
                </div>
              </div>
            </div>
 
          </div>
 
          <div className="flex flex-col md:flex-row w-full">
            <div className="grid grid-rows-4-4 py-1 bg-white rounded-lg ring-1 ring-[#C7C7C7] w-full h-auto  xl:h-[145px]">
              {isKnown && (
                <div className="flex flex-row bg-white border-b-2 border-gray-200">
                  <div className="flex items-center px-1 py-1 rounded-t-sm ml-2">
                    <img src={mailIcon} alt="Mail Icon" className="" />{" "}
                    <strong className="text-[#494949] ml-2">
                      {t("nomineeDetail.mail")}
                    </strong>
                    <span className="ml-2 px-1 text-[#5E5E5E]">
                      {nominee.contact?.email}
                    </span>{" "}
                  </div>
                </div>
              )}
 
              {isKnown && (
                <div className="flex flex-row bg-white border-b-2 border-gray-200 ml-2">
                  <div className="flex items-center">
                    <img
                      src={phoneIcon}
                      alt="Phone Icon"
                      className="h-6 w-6 ml-1"
                    />
                    <strong className="text-[#494949] ml-1">
                      {t("nomineeDetail.phone")}
                    </strong>
                  </div>
                  <div className="flex items-center ml-2 px-2 py-1 text-[#5E5E5E]">
                    <span>{nominee.contact.phone}</span>
                  </div>
                </div>
              )}
 
              {isKnown && (
                <div className="flex flex-row bg-white border-b-2 border-gray-200 ml-2">
                  <div className="flex items-center">
                    <img
                      src={degreeIcon}
                      alt="School Icon"
                      className="h-6 w-6 ml-1"
                    />
                    <strong className="text-[#494949] ml-1">
                      {t("nomineeDetail.education")}
                    </strong>
                  </div>
                  <div className="flex items-center ml-2 px-2 py-1 text-[#5E5E5E]">
                    <span>{nominee.education[0].degree}</span>
                  </div>
                </div>
              )}
              {isKnown && (
                <div className="flex flex-row bg-white ml-2">
                  <div className="flex items-center">
                    <img
                      src={logo}
                      alt="LinkedIn Logo"
                      className="h-6 w-6 ml-1"
                    />
                    <strong className="text-[#494949] ml-1">Linked In</strong>
                  </div>
                  <div className="flex items-center ml-2 px-2 py-1 text-[#5E5E5E]">
                    <span>{nominee.contact.linkedin}</span>
                  </div>
                </div>
              )}
 
              {!isKnown && (
                <div className="flex flex-row bg-white border-b-2 border-gray-200">
                  <div className="flex items-center px-1 py-1 rounded-t-sm ml-2">
                    <img src={mailIcon} alt="Mail Icon" className="" />{" "}
                    <strong className="text-[#494949] ml-2">
                      {t("nomineeDetail.mail")}
                    </strong>
                    <span className="ml-2 px-1 text-[#5E5E5E] blur-[4px]">
                      {censorMail("yusuf@gmail.com")}
                    </span>{" "}
                  </div>
                </div>
              )}
 
              {!isKnown && (
                <div className="flex flex-row bg-white border-b-2 border-gray-200 ml-2">
                  <div className="flex items-center">
                    <img
                      src={phoneIcon}
                      alt="Phone Icon"
                      className="h-6 w-6 ml-1"
                    />
                    <strong className="text-[#494949] ml-1">
                      {t("nomineeDetail.phone")}
                    </strong>
                  </div>
                  <div className="flex items-center ml-2 px-2 py-1 text-[#5E5E5E] blur-[4px]">
                    <span>{censorPhoneNumber("123-456-7890")}</span>
                  </div>
                </div>
              )}
 
              {!isKnown && (
                <div className="flex flex-row bg-white border-b-2 border-gray-200 ml-2">
                  <div className="flex items-center">
                    <img
                      src={degreeIcon}
                      alt="School Icon"
                      className="h-6 w-6 ml-1"
                    />
                    <strong className="text-[#494949] ml-1">
                      {t("nomineeDetail.education")}
                    </strong>
                  </div>
                  <div className="flex items-center ml-2 px-2 py-1 text-[#5E5E5E] blur-[4px]">
                    <span>{censorText("Asiye Ağaoğlu Lisesi")}</span>
                  </div>
                </div>
              )}
              {!isKnown && (
                <div className="flex flex-row bg-white ml-2">
                  <div className="flex items-center">
                    <img
                      src={logo}
                      alt="LinkedIn Logo"
                      className="h-6 w-6 ml-1"
                    />
                    <strong className="text-[#494949] ml-1">Linked In</strong>
                  </div>
                  <div className="flex items-center ml-2 px-2 py-1 text-[#5E5E5E] blur-[4px]">
                    <span>{censorLinkedInUrl("linkedin.com/in/emilydoe")}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg p-1 ring-1 ring-[#C7C7C7] mt-5 md:mt-0 md:ml-2 w-full h-auto  xl:h-[145px] overflow-auto">
              <strong className="text-[#494949] ml-2">
                {t("nomineeDetail.skills")}
              </strong>
              <div className="flex flex-wrap">
                {nominee.skills.map((skill, index) => (
                  <div key={index} className="m-1">
                    <span className=" inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-[#2B4D55] mr-1">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
 
          <div className="bg-gray-100 my-2">
            <div className="bg-white rounded-lg border-b-2 ">
              <div className="mt-4 mr-16 border-b-2 border-gray-200 w-full">
                <button
                  className={`ml-2 flex-1 text-center py-2 focus:outline-none border-b-2 border-transparent hover:border-gray-500 ${activeTab === "experience"
                    ? "border-blue-500 tab text-[#383838]"
                    : "tab text-[#ADADAD]"
                    }`}
                  onClick={() => setActiveTab("experience")}
                >
                  {t("nomineeDetail.experience")}
                </button>
                <button
                  className={`ml-4 flex-1 text-center py-2 focus:outline-none border-b-2 border-transparent hover:border-gray-500 ${activeTab === "cv"
                    ? "border-blue-500 tab text-[#383838]"
                    : "tab text-[#ADADAD]"
                    }`}
                  onClick={() => setActiveTab("cv")}
                >
                  {t("nomineeDetail.resume")}
                </button>
              </div>
 
              {activeTab === "experience" && (
                <div className="ml-2 mt-3 h-[200px] overflow-y-auto">
                  <ul className="list-disc ml-4">
                    {nominee.experience.map((exp, index) => (
                      <li key={index}>
                        <div>
                          <strong>{t("nomineeDetail.position")}</strong>{" "}
                          {exp.position}
                        </div>
                        <div>
                          <strong>{t("nomineeDetail.company")}</strong>{" "}
                          {exp.company}
                        </div>
                        <div>
                          <strong>{t("nomineeDetail.duration")}</strong>{" "}
                          {exp.duration}
                        </div>
                        <div>
                          <strong>{t("nomineeDetail.description")}</strong>{" "}
                          {exp.description}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
 
            {activeTab === "cv" && (
              <div className="">
                <strong className="text-center">
                  {t("nomineeDetail.resume_page")}
                </strong>
              </div>
            )}
 
            {/* {!isKnown && activeTab === "cv" && (
              <div className="text-center mt-4">
                <strong>{t("nomineeDetail.resume_page")}</strong>
              </div>
            )} */}
          </div>
        </div>
      </div>
      <div className="h-full mt-20 rounded-lg">
        <button
          onClick={onClose}
          className="bg-[#F3F3F3] text-[#000000] hover:text-gray-800 focus:outline-none rounded-md ml-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 16L16 8M8 8l8 8"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}