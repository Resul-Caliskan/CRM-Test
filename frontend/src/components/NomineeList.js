import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import CircularBar from "./circularBar";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Pagination } from "antd";

const NomineeList = ({
  currentNominees,
  removeNominee,
  handleNomineeDetail,
  addNominee,
  isTarget = true,
  droppableId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const nomineesPerPage = 1;

  useEffect(() => {
    const totalPages = Math.ceil(currentNominees.length / nomineesPerPage);
    if (totalPages < currentPage) {
      setCurrentPage(totalPages || 1);
    }
  }, [currentNominees.length, currentPage, nomineesPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRemoveNominee = (nomineeId) => {
    removeNominee(nomineeId);
    // If removing the last nominee on a page, go back one page
    const totalPages = Math.ceil(
      (currentNominees.length - 1) / nomineesPerPage
    );
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  };

  const indexOfLastNominee = currentPage * nomineesPerPage;
  const indexOfFirstNominee = indexOfLastNominee - nomineesPerPage;
  const nomineesToShow = currentNominees.slice(
    indexOfFirstNominee,
    indexOfLastNominee
  );

  return (
    <div className="sm:w-full lg:w-[430px] xl:w-[400px] 2xl:w-[430px]">
      <div className="bg-white p-4 rounded border shadow rounded-2xl">
        <div className="flex flex-col justify-between items-start border-b border-gray-200 pb-2 mb-4 ">
          <h3 className="flex flex-row font-semibold text-lg text-center  text-left">
            {isTarget ? "Atanan Adaylar" : "CV Havuzu"}
          </h3>
          <div className="flex justify-center ">
            <Pagination
              disabled={false}
              onChange={(page, pageSize) => {
                handlePageChange(page);
              }}
              current={currentPage}
              total={currentNominees.length}
              pageSize={nomineesPerPage}
              showLessItems={true}
            />
          </div>
        </div>

        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {nomineesToShow.map((nominee, index) => (
                <Draggable
                  key={nominee.cv._id}
                  draggableId={nominee.cv._id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="flex flex-col bg-white rounded-2xl border shadow relative w-auto lg:w-[390px] xl:w-[370px] 2xl:w-[400px] mb-4"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="p-4">
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

                          <div className="flex items-end justify-end">
                            {isTarget ? (
                              <button
                                className="flex flex-row px-2 text-white py-1 rounded-lg text-base bg-[#FF4747] hover:bg-[#c84040] text-center justify-center items-center"
                                onClick={() =>
                                  handleRemoveNominee(nominee.cv._id)
                                }
                              >
                                <DeleteOutlined
                                  color="white"
                                  className="mr-1"
                                />
                                Çıkar
                              </button>
                            ) : (
                              <button
                                className="flex flex-row px-2 text-white py-1 rounded-lg text-base bg-[#0057D9] hover:bg-[#0019d9]  text-center justify-center items-center"
                                onClick={() => addNominee(nominee.cv._id)}
                              >
                                <PlusCircleOutlined size={2} className="mr-1" />
                                Ekle
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        className="w-full py-3 bg-[#99C2FF] hover:bg-[#63a1ff] rounded-b-2xl items-center justify-center text-sm text-[#0057D9] font-semibold"
                        onClick={() => handleNomineeDetail(nominee.cv, true)}
                      >
                        Detaylar
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

export default NomineeList;