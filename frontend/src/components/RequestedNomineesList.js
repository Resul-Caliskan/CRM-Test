import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import CircularBar from "./circularBar";
import { Pagination, Spin } from "antd";
import { useTranslation } from "react-i18next";

const RequestedNomineeList = ({
  requestedNominees,
  removeNomineeFromDemanded,
  acceptNomineeFromDemanded,
  handleNomineeDetail,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const nomineesPerPage = 2;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const totalPages = Math.ceil(requestedNominees.length / nomineesPerPage);
    if (totalPages < currentPage) {
      setCurrentPage(totalPages || 1);
    }
  }, [requestedNominees.length, currentPage, nomineesPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const onClick_Time = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleRemoveNominee = (nomineeId) => {
    removeNomineeFromDemanded(nomineeId);
    // If removing the last nominee on a page, go back one page
    const totalPages = Math.ceil(
      (requestedNominees.length - 1) / nomineesPerPage
    );
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  };

  const indexOfLastNominee = currentPage * nomineesPerPage;
  const indexOfFirstNominee = indexOfLastNominee - nomineesPerPage;
  const nomineesToShow = requestedNominees.slice(
    indexOfFirstNominee,
    indexOfLastNominee
  );

  return (
    <div className="w-auto lg:w-full xl:w-[400px] 2xl:w-full">
      <div className="bg-white  p-4 rounded border shadow rounded-2xl">
        <div className="flex flex-col justify-between items-start border-b border-gray-200 pb-2 mb-4 ">
          <h3 className="flex flex-row font-semibold text-lg text-center  text-left">
            {t("nominee_list.requested_nominees")}
          </h3>
          <div className="flex justify-center ">
            <Pagination
              disabled={false}
              onChange={(page, pageSize) => {
                handlePageChange(page);
              }}
              current={currentPage}
              total={requestedNominees.length}
              pageSize={nomineesPerPage}
              showLessItems={true}
            />
          </div>
        </div>
        <div className="justify-center items-center">
          {nomineesToShow.map((nominee, index) => (
            <div
              key={nominee.cv._id}
              className="flex flex-col bg-white  rounded-2xl border shadow relative  w-auto lg:w-full xl:w-[370px] 2xl:w-full mb-4"
            >
              <div className=" p-4">
                <CircularBar nominee={nominee}></CircularBar>

                <strong className="text-sm font-semibold font-sans">
                  {t("nominee_list.matched_skills")}
                </strong>
                <div className="mb-2 flex flex-row justify-around gap-2">
                  <ul className="w-full h-[88px]">
                    {nominee.commonSkills.map((skill, index) => {
                      if (index > 3) {
                        return null;
                      } else if (index === 3) {
                        return (
                          <li className="text-[#6D6D6D]" key={index}>
                            ....
                          </li>
                        );
                      } else {
                        return (
                          <li className="text-[#6D6D6D]" key={index}>
                            {skill}
                          </li>
                        );
                      }
                    })}
                  </ul>

                  <div className="flex items-end justify-end ">
                    <button
                      disabled={loading}
                      className="flex flex-row px-2 text-white py-1 rounded-lg text-base bg-[#FF4747] hover:bg-[#c84040] text-center justify-center items-center mr-2"
                      onClick={() => {
                        onClick_Time();
                        handleRemoveNominee(nominee.cv._id);
                      }}
                    >
                      {loading ? (
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{
                                fontSize: 20,
                                color: "white",
                              }}
                              spin
                            />
                          }
                        />
                      ) : (
                        <>
                          <DeleteOutlined color="white" className="mr-1" />
                          {t("nominee_list.reject")}
                        </>
                      )}
                    </button>
                    <button
                      disabled={loading}
                      className="flex flex-row px-2 text-white py-1 rounded-lg text-base  bg-[#0057D9] hover:bg-[#0019d9]   text-center justify-center items-center"
                      onClick={() => {
                        onClick_Time();
                        acceptNomineeFromDemanded(nominee.cv._id);
                      }}
                    >
                      {loading ? (
                        <Spin
                          indicator={
                            <LoadingOutlined
                              style={{
                                fontSize: 20,
                                color: "white",
                              }}
                              spin
                            />
                          }
                        />
                      ) : (
                        <>
                          <CheckOutlined className="mr-1" />
                          {t("nominee_list.approve")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="w-full py-3 bg-[#99C2FF]  hover:bg-[#63a1ff] rounded-b-2xl items-center justify-center text-sm text-[#0057D9] font-semibold"
                onClick={() => handleNomineeDetail(nominee.cv, false)}
              >
                {t("nominee_list.details")}{" "}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestedNomineeList;
