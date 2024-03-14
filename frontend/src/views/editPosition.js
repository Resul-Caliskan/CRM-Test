import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';
import axios from 'axios';
import {  useNavigate, useParams } from 'react-router-dom';
import Notification from '../utils/notification';

const { Option } = Select;

const EditPosition = () => {
    const navigate = useNavigate();
    const {id} =useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [positionData, setPositionData] = useState(null);
    const [parameters, setParameters] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchPosition = async () => {
            try {
                const data = await fetchPositionDetails(id);
                setPositionData(data);
                console.log("usestatede gelen data:" + positionData.department);
            } catch (error) {
                console.error('Müşteri bilgileri alınırken bir hata oluştu:', error);
            }
        };
        fetchPosition();
        fetchParameters();
    }, [id]);

    const fetchPositionDetails = async (id) => {
        try {
            const response = await axios.get(`${apiUrl}/api/positions/${id}`);
            const position = response.data;
            console.log("gelen pozisyon" + position.worktype);
            return response.data;
        } catch (error) {
            console.error('Pozisyonlar getirilirken bir hata oluştu:', error);
            return null;
        }
    };

    const fetchParameters = async () => {
        await axios.get(`${apiUrl}/api/parameters`)
            .then(response => {
                console.log(response);
                console.log("DATAA PARAMETER: " + response.data);
                setParameters(response.data);

            })
            .catch(error => {
                console.error('Roles fetching failed:', error);
            });
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`${apiUrl}/api/positions/${id}`, {
                department: values.department,
                jobtitle: values.jobtitle,
                experienceperiod: values.experienceperiod,
                modeofoperation: values.modeofoperation,
                description: values.description,
                worktype: values.worktingType,
            });
            console.log('Form gönderildi:', values);
            setLoading(false);
            Notification(true, "Başarıyla güncellendi.");

            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } catch (error) {
            console.error('Form gönderilirken bir hata oluştu:', error);
            Notification(false, "Bir hata oluştu.");
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-lg mt-12">
                <h2 className="text-center text-2xl mb-6">Pozisyonu Düzenle</h2>
                {positionData && (
                    <Form form={form} initialValues={positionData} onFinish={handleSubmit} layout="vertical" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <Form.Item label="İş Unvanı" name="jobtitle" rules={[{ required: true, message: 'İş Unvanını Giriniz!' }]}>
                            <Select showSearch optionFilterProp="children" placeholder="İş Unvanı Seç">
                                {parameters.map((parameter, index) => {
                                    if (parameter.title === "İş Unvanı") {
                                        return parameter.values.map((value, idx) => (
                                            <Option key={`${parameter._id}-${idx}`} value={value}>{value}</Option>
                                        ));
                                    }
                                    return null;
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Departman" name="department" rules={[{ required: true, message: 'Departmanı Giriniz!' }]}>
                            <Select showSearch optionFilterProp="children" placeholder="Departman Seç">
                                {parameters.map((parameter, index) => {
                                    if (parameter.title === "Departman") {
                                        return parameter.values.map((value, idx) => (
                                            <Option key={`${parameter._id}-${idx}`} value={value}>{value}</Option>
                                        ));
                                    }
                                    return null;
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Deneyim Süresi" name="experienceperiod" rules={[{ required: true, message: 'Deneyim Süresini Giriniz!' }]}>
                            <Select showSearch optionFilterProp="children" placeholder="Deneyim Süresi Seç">
                                {parameters.map((parameter, index) => {
                                    if (parameter.title === "Deneyim Süresi") {
                                        return parameter.values.map((value, idx) => (
                                            <Option key={`${parameter._id}-${idx}`} value={value}>{value}</Option>
                                        ));
                                    }
                                    return null;
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="İşyeri Politikası" name="modeofoperation" rules={[{ required: true, message: 'İşyeri Politikasını Giriniz!' }]}>
                            <Select showSearch optionFilterProp="children" placeholder="İşyeri Politikası Seç">
                                {parameters.map((parameter, index) => {
                                    if (parameter.title === "İşyeri Politikası") {
                                        return parameter.values.map((value, idx) => (
                                            <Option key={`${parameter._id}-${idx}`} value={value}>{value}</Option>
                                        ));
                                    }
                                    return null;
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="İş Türü" name="worktype" rules={[{ required: true, message: 'İş Türünü Giriniz!' }]}>
                            <Select showSearch  optionFilterProp="children" placeholder="İş Türü Seç">
                                {parameters.map((parameter, index) => {
                                    if (parameter.title === "İş Türü") {
                                        return parameter.values.map((value, idx) => (
                                            <Option key={`${parameter._id}-${idx}`} value={value}>{value}</Option>
                                        ));
                                    }
                                    return null;
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="İş Tanımı" name="description" rules={[{ required: true, message: 'İş Tanımını Giriniz!' }]}>
                            <Input.TextArea placeholder="İş Tanımı" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline">
                                {loading ? <Spin /> : 'Güncelle'} {/* loading state true ise Spin bileşenini, değilse 'Güncelle' metnini göster */}
                            </Button>
                        </Form.Item>
                    </Form>)}
            </div>
        </div>
    );
};

export default EditPosition;
