import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Button, Popconfirm,  } from "antd";
import Loading from "../components/loadingComponent";
import Notification from "../utils/notification";
const Parameters = () => {
  const [parameters, setParameters] = useState([]);
  const [editingParameter, setEditingParameter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editedValues, setEditedValues] = useState([]);
  const [newParameter, setNewParameter] = useState({ title: "", values: [] });
  const [selectedParameter, setSelectedParameter] = useState();
  const [loading, setLoading] = useState(true);
 
  const apiUrl = process.env.REACT_APP_API_URL;
 
  useEffect(() => {
    fetchParameters();
  }, []);
 
  const fetchParameters = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/parameters`);
      setParameters(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Parameter fetching failed:", error);
    }
  };
 
  const handleEditClick = (parameter) => {
    setSelectedParameter(parameter.title);
    setEditingParameter(parameter);
    setEditedValues(parameter.values);
    setModalOpen(true);
  };
 
  const handleSaveClick = async () => {
    if (
      editedValues.some((value) => value === "") ||
      editedValues.length === 0 ||
      editedValues[editedValues.length - 1] === ""
    ) {
      Notification("warning", "Boş Bir Değer Girilemez");
    } else {
      try {
        if (editingParameter) {
          await axios.put(`${apiUrl}/api/parameters/${editingParameter._id}`, {
            values: editedValues,
          });
 
          Notification("success", "Düzenleme Başarılı");
        } else {
          await axios.post(`${apiUrl}/api/parameters`, {
            title: newParameter.title,
            values: newParameter.values,
          });
        }
        await fetchParameters();
      } catch (error) {
        console.error("Parametre kaydetme hatası:", error);
      }
      setEditingParameter(null);
      setModalOpen(false);
    }
  };
 
  const handleDelete = async (index) => {
    try {
      const newValues = [...editedValues];
      newValues.splice(index, 1);
 
      if (newValues.length === 0) {
        await axios.delete(`${apiUrl}/api/parameters/${editingParameter._id}`);
 
        const updatedParameters = parameters.filter(
          (param) => param._id !== editingParameter._id
        );
        setParameters(updatedParameters);
        setEditingParameter(null);
        setModalOpen(false);
      } else {
        setEditedValues(newValues);
      }
    } catch (error) {
      console.error("Parametre silme hatası:", error);
    }
  };
 
  const handleDeleteValue = async (parameterId, valueId) => {
    try {
      await axios.delete(
        `${apiUrl}/api/parameters/${parameterId}/values/${valueId}`
      );
      await fetchParameters();
    } catch (error) {
      console.error("Parametre değeri silme hatası:", error);
    }
  };
 
  const handleAdd = () => {
    if (
      editedValues.some((value) => value === "") ||
      editedValues.length === 0 ||
      editedValues[editedValues.length - 1] === ""
    ) {
      alert("Lütfen boş bir değer eklemeyin.");
    } else {
      setEditedValues([...editedValues, ""]);
      setEdit(true);
      setTimeout(() => {
        const list = document.getElementById("editedValuesList");
        const lastItem = list.lastElementChild;
        lastItem.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  };
 
  const handleEdit = () => {
    setEdit(!isEdit);
  };
 
  const handleInputChange = (index, value) => {
    const newValues = [...editedValues];
    newValues[index] = value;
    setEditedValues(newValues);
  };
 
  const handleNewParameterChange = (e) => {
    const { name, value } = e.target;
    setNewParameter((prevParameter) => ({
      ...prevParameter,
      [name]: value,
    }));
  };
 
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <h1 className="text-center my-5 font-semibold">API Parametreleri</h1>
          <div>
            <div className="flex justify-between mb-4">
              {/* <div>
                <Input
                  name="title"
                  value={newParameter.title}
                  onChange={handleNewParameterChange}
                  placeholder="Parametre Adı"
                  className="mr-2"
                />
                <Input
                  name="values"
                  value={newParameter.values}
                  onChange={handleNewParameterChange}
                  placeholder="Parametre Değeri"
                  className="mr-2"
                />
                <Button onClick={handleSaveClick}>Ekle</Button>
              </div> */}
            </div>
            <ul className="grid grid-cols-4 gap-4">
              {parameters &&
                parameters.map((param) => (
                  <div
                    key={param._id}
                    className="bg-white p-4 rounded border shadow"
                  >
                    <div className="flex justify-between border-b border-gray-400 mb-2">
                      <h3 className="font-semibold text-lg text-center ">
                        {param.title}
                      </h3>
                      <button onClick={() => handleEditClick(param)}>
                        <FaEdit
                          style={{ color: "dodgerblue", marginBottom: 10 }}
                        />
                      </button>
                    </div>
                    <div className="flex flex-col">
                      <p>
                        <strong>Parametre Değerleri:</strong>
                      </p>
                      <ul
                        className={
                          param.values.length > 8
                            ? "list-disc pl-6 overflow-y-auto max-h-40"
                            : "list-disc pl-6"
                        }
                      >
                        {param.values.map((value, index) => (
                          <li key={`${param._id}-${index}`}>{value}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </ul>
          </div>
          {modalOpen && (
            <div className="z-30 fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center" id="kart">
              <div
                className=" relative bg-white shadow p-4 rounded-lg"
                style={{ width: 350 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">{selectedParameter}</h2>
                  <button
                    className="text-xl text-red-500"
                    onClick={() => setModalOpen(false)}
                  >
                    X
                  </button>
                </div>
 
                <div className="overflow-auto max-h-[300px] bg-gray-200 rounded-md p-2"  >
                  <ul id="editedValuesList">
                    {editedValues.map((value, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-around mb-2 "
                      >
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                          className="border rounded py-1 px-2 mr-2"
                        />
                        <Popconfirm
                          title="Değer Sil"
                          description="Değeri silmek istediğinize emin misiniz?"
                          onConfirm={() => handleDelete(index)}
                          okText="Evet"
                          okType="danger"
                          cancelText="Hayır"
                        >
                          <Button className="bg-red-400 text-white py-1 px-2 rounded ml-2">
                            Sil
                          </Button>
                        </Popconfirm>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5 ">
                  <Button
                    onClick={handleAdd}
                    className="bg-blue-500 text-white py-1 px-2 rounded ml-4"
                  >
                    Ekle
                  </Button>
                  <Button
                    onClick={handleSaveClick}
                    className="bg-green-500 text-white py-1 px-2 rounded ml-2"
                  >
                    Kaydet
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
 
export default Parameters;