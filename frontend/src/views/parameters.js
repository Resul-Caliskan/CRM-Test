import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Button, Popconfirm, Input } from "antd";

const Parameters = () => {
  const [parameters, setParameters] = useState([]);
  const [editingParameter, setEditingParameter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editedValues, setEditedValues] = useState([]);
  const [newParameter, setNewParameter] = useState({ title: "", value: "" });
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/parameters`);
      setParameters(response.data);
    } catch (error) {
      console.error("Parameter fetching failed:", error);
    }
  };

  const handleEditClick = (parameter) => {
    setEditingParameter(parameter);
    setModalOpen(true);
    setEditedValues(parameter.values);
  };

  const handleSaveClick = async () => {
    try {
      await axios.post(`${apiUrl}/api/parameters`, { editedValues });
      await fetchPositions();
      console.log("Parametre kaydedildi:", editedValues);
    } catch (error) {
      console.error("Parametre kaydetme hatası:", error);
    }
    setEditingParameter(null);
    setModalOpen(false);
  };

  const handleDelete = (index) => {
    const newValues = [...editedValues];
    newValues.splice(index, 1);
    setEditedValues(newValues);
  };

  const handleAdd = () => {
    setEditedValues([...editedValues, ""]);
    setEdit(true);
    setTimeout(() => {
      const list = document.getElementById("editedValuesList");
      const lastItem = list.lastElementChild;
      lastItem.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
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

  const handleAddNewParameter = () => {
    setParameters([...parameters, newParameter]);
    setNewParameter({ title: "", value: "" });
  };

  return (
    <div>
      <h1 className="text-center my-5 font-semibold">API Parametreleri</h1>
      <div>
        <div className="flex justify-between mb-4">
          <div>
            <Input
              name="title"
              value={newParameter.title}
              onChange={handleNewParameterChange}
              placeholder="Parametre Adı"
              className="mr-2"
            />
            <Input
              name="value"
              value={newParameter.value}
              onChange={handleNewParameterChange}
              placeholder="Parametre Değeri"
              className="mr-2"
            />
            <Button onClick={handleAddNewParameter}>Ekle</Button>
          </div>
        </div>
        <ul className="grid grid-cols-4 gap-4">
          {parameters && parameters.map((param) => (
            <div
              key={param.title}
              className="bg-white p-4 rounded border shadow"
            >
              <div className="flex justify-between border-b border-gray-400 mb-2">
                <h3 className="font-semibold text-lg text-center ">
                  {param.title}
                </h3>
                <button onClick={() => handleEditClick(param)}>
                  <FaEdit style={{ color: "dodgerblue", marginBottom: 10 }} />
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center ">
          <div className="bg-white p-8 rounded shadow" style={{ width: 350 }}>
            <div className="flex justify-around">
              <h2 className="text-lg font-semibold mb-4">Edit Parameters</h2>
              <button
                className="relative bottom-6 left-10 p-2 text-xl font-bold text-red-500"
                onClick={() => setModalOpen(false)}
              >
                X
              </button>
            </div>
            <div className="overflow-auto max-h-[300px] bg-gray-200 rounded-md p-2">
              <ul id="editedValuesList">
                {editedValues.map((value, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-around mb-2 "
                  >
                    <input
                      type="text"
                      value={value}
                      disabled={!isEdit}
                      onChange={(e) =>
                        handleInputChange(index, e.target.value)
                      }
                      className="border rounded py-1 px-2 mr-2"
                      style={
                        isEdit
                          ? { borderColor: "limegreen", borderWidth: 1.5 }
                          : { borderColor: "gray" }
                      }
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
                disabled={isEdit}
                className="bg-blue-500 text-white py-1 px-2 rounded ml-4"
              >
                Ekle
              </Button>
              <Button
                onClick={handleEdit}
                className="bg-blue-400 text-white py-1 px-2 rounded ml-2"
              >
                {isEdit ? "Düzenleniyor..." : "Düzenle"}
              </Button>
              <Button
                onClick={handleSaveClick}
                disabled={!isEdit}
                className="bg-green-500 text-white py-1 px-2 rounded ml-2"
              >
                Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parameters;
