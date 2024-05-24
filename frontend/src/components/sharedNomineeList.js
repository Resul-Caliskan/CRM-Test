import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import CircularBar from "./circularBar";
import { DeleteOutlined, LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Pagination, Spin } from "antd";
import { useTranslation } from "react-i18next";

const SharedNomineeList = ({
  suggestedNominees,
  setSuggestedNominees,
  removeNominee,
  handleNomineeDetail,
  addNominee,
  droppableId,
  currentPage,
  setCurrentPage,
  totalPages
}) => {
  

  const [loading, setLoading] = useState(false);
  const nomineesPerPage = 1;
  const { t } = useTranslation();
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);

  };
  
  const handleRemoveNominee = (nomineeId) => {
    setLoading(true);
    const totalPages = Math.ceil(
      (suggestedNominees.length - 1) / nomineesPerPage
    );
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
    setLoading(false);
  };



  return (
    <div className="sm:w-full lg:w-full xl:w-[400px] 2xl:w-full md:w-full ">
      <div className="bg-white p-4 rounded border shadow rounded-2xl">
        <div className="flex flex-col justify-between items-start border-b border-gray-200 pb-2 mb-4 ">
          <h3 className="flex flex-row font-semibold text-lg text-center  text-left">   
              { t("nominee_list.cv_pool")}
          </h3>
          <div className="flex justify-center ">
            <Pagination
              disabled={false}
              onChange={(page, pageSize) => {
                handlePageChange(page);
              }}
              current={currentPage}
              total={totalPages}
              pageSize={nomineesPerPage}
              showLessItems={true}
            />
          </div>
        </div>

        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {suggestedNominees.map((nominee, index) => (
                <Draggable
                  key={nominee.cv._id}
                  draggableId={nominee.cv._id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="flex flex-col bg-white rounded-2xl border shadow relative w-auto lg:w-[390px] xl:w-[370px] 2xl:w-full md:w-full lg:w-full mb-4"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="p-4">
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

                          <div className="flex items-end justify-end">
                              <button
                                className="flex flex-row px-2 text-white py-1 rounded-lg text-base bg-[#0057D9] hover:bg-[#0019d9]  text-center justify-center items-center"
                                onClick={() => addNominee(nominee.cv._id)}
                              >
                                <PlusCircleOutlined size={2} className="mr-1" />
                                {loading ? (
                                  <Spin
                                    indicator={
                                      <LoadingOutlined
                                        style={{
                                          fontSize: 16,
                                          color: "white",
                                        }}
                                        spin
                                      />
                                    }
                                  />
                                ) : (
                                  t("nominee_list.add")
                                )}
                              </button>
                            
                          </div>
                        </div>
                      </div>

                      <button
                        className="w-full py-3 bg-[#99C2FF] hover:bg-[#63a1ff] rounded-b-2xl items-center justify-center text-sm text-[#0057D9] font-semibold"
                        onClick={() => handleNomineeDetail(nominee.cv, true)}
                      >
                        {t("nominee_list.details")}
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default SharedNomineeList;
