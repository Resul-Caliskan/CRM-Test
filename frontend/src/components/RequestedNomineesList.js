import React, { useEffect, useState } from "react";
import { DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import CircularBar from "./circularBar";
import { Pagination } from "antd";

const RequestedNomineeList = ({
  requestedNominees,
  removeNomineeFromDemanded,
  acceptNomineeFromDemanded,
  handleNomineeDetail,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const nomineesPerPage = 1;

  useEffect(() => {
    const totalPages = Math.ceil(requestedNominees.length / nomineesPerPage);
    if (totalPages < currentPage) {
      setCurrentPage(totalPages || 1);
    }
  }, [requestedNominees.length, currentPage, nomineesPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
    <div className="w-auto lg:w-[430px] xl:w-[400px] 2xl:w-[430px]">
      <div className="bg-white  p-4 rounded border shadow rounded-2xl">
        <div className="flex flex-col justify-between items-start border-b border-gray-200 pb-2 mb-4 ">
          <h3 className="flex flex-row font-semibold text-lg text-center  text-left">
            Talep Edilen Adaylar
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
              className="flex flex-col bg-white  rounded-2xl border shadow relative  w-auto lg:w-[390px] xl:w-[370px] 2xl:w-[400px] mb-4"
            >
              <div className=" p-4">
                <CircularBar nominee={nominee}></CircularBar>

                <strong className="text-sm font-semibold font-sans">
                  Eşleşen Yetenekler
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
                      className="flex flex-row px-2 text-white py-1 rounded-lg text-base bg-[#FF4747] hover:bg-[#c84040] text-center justify-center items-center mr-2"
                      onClick={() => handleRemoveNominee(nominee.cv._id)}
                    >
                      <DeleteOutlined color="white" className="mr-1" />
                      Reddet
                    </button>
                    <button
                      className="flex flex-row px-2 text-white py-1 rounded-lg text-base  bg-[#0057D9] hover:bg-[#0019d9]   text-center justify-center items-center"
                      onClick={() => acceptNomineeFromDemanded(nominee.cv._id)}
                    >
                      <CheckOutlined className="mr-1" />
                      Onayla
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="w-full py-3 bg-[#99C2FF]  hover:bg-[#63a1ff] rounded-b-2xl items-center justify-center text-sm text-[#0057D9] font-semibold"
                onClick={() => handleNomineeDetail(nominee.cv, false)}
              >
                Detaylar{" "}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestedNomineeList;