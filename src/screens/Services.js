import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import CustomFileUpload from "../components/UI/CustomFileUpload";
import Loader from "../components/UI/Loader";
import Swal from 'sweetalert2';
import { BASE_URL } from "../config";

const API_URL = BASE_URL + "/services";

const Services = () => {
    const [services, setServices] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedService, setSelectedService] = useState({});
    const [loading, setLoading] = useState(false);
    const fileUploadRef = useRef(null);


    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get(API_URL);
            setServices(response.data);
        } catch (error) {
            console.error("Veriler alınırken hata oluştu:", error);
        }
    };

    const addService = async () => {
        try {
            const newService = {
                ...selectedService,
                link: convertToSlug(selectedService.title || "")
            };

            // Görseli backend'e yükle
            if (newService.image) {
                const imageUrl = await uploadImageToBackend(newService.image, newService.imageName);
                newService.image = BASE_URL + imageUrl;
            }

            if (!newService.title || !newService.description || !newService.content || !newService.image) {
                Swal.fire({
                    title: "Boş Alan Bırakmayınız!",
                    icon: "error",
                    confirmButtonText: "Tamam"
                });
                return;
            }

            setLoading(true);
            await axios.post(API_URL, newService);

            setServices([...services, newService]);
            setLoading(false);
            setDialogVisible(false);

        } catch (error) {
            console.error("Hizmet eklenirken hata oluştu:", error);
            Swal.fire({
                title: "Hizmet Eklenemedi!",
                icon: "error",
                confirmButtonText: "Tamam"
            });
        }
    };

    const updateService = async (id, updatedService) => {
        const result = await Swal.fire({
            title: "Güncellemek istediğinize emin misiniz?",
            text: "Bu işlem geri alınamaz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, güncelle!",
            cancelButtonText: "Hayır, iptal et"
        });

        if (result.isConfirmed) {

            if (updatedService.image && updatedService.image.startsWith("data:image")) {
                const imageUrl = await uploadImageToBackend(updatedService.image, updatedService.imageName);
                updatedService.image = BASE_URL + imageUrl; // Backend'den dönen görsel URL'sini kaydediyoruz
            }

            try {
                const response = await axios.put(`${BASE_URL}/services/${id}`, updatedService);
                if (response.status === 200) {
                    setServices(services.map(service =>
                        service.id === id ? { ...service, ...updatedService } : service
                    ));

                    Swal.fire({
                        title: "Başarılı!",
                        text: "Hizmet başarıyla güncellendi.",
                        icon: "success",
                        confirmButtonText: "Tamam"
                    });

                    setDialogVisible(false);
                }
            } catch (error) {
                console.error("Hizmet güncellenirken hata oluştu:", error);

                Swal.fire({
                    title: "Hata!",
                    text: "Bir hata oluştu, hizmet güncellenemedi.",
                    icon: "error",
                    confirmButtonText: "Tamam"
                });
            }
        }
    };

    const deleteService = async (id) => {
        const result = await Swal.fire({
            title: "Silmek istediğinize emin misiniz?",
            text: "Bu işlem geri alınamaz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, sil!",
            cancelButtonText: "Hayır, iptal et"
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${BASE_URL}/services/${id}`);

                if (response.status === 200) {
                    setServices(services.filter(service => service.id !== id));
                    Swal.fire({
                        title: "Başarılı!",
                        text: "Hizmet başarıyla silindi.",
                        icon: "success",
                        confirmButtonText: "Tamam"
                    });
                }
            } catch (error) {
                console.error("Hizmet silinirken hata oluştu:", error);

                Swal.fire({
                    title: "Hata!",
                    text: "Bir hata oluştu, hizmet silinemedi.",
                    icon: "error",
                    confirmButtonText: "Tamam"
                });
            }
        }
    };

    const uploadImageToBackend = async (base64Image, imageName) => {
        const formData = new FormData();
        const base64Parts = base64Image.split(',');
        const byteCharacters = atob(base64Parts[1]);
        const byteArrays = [];

        const fileExtension = base64Parts[0].split(';')[0].split('/')[1];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const file = new Blob(byteArrays, { type: 'image/' + fileExtension });

        formData.append("image", file, imageName);
        console.log(imageName);

        formData.append("type", "applications");

        try {
            const response = await fetch(BASE_URL + "/uploads", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (data.imageUrl) {
                return data.imageUrl;
            }
            throw new Error("Görsel yüklenemedi!");
        } catch (error) {
            console.error("Görsel yükleme hatası:", error);
            throw error;
        }
    };

    const editService = rowData => {
        setSelectedService(rowData);
        setEditMode(true);
        setDialogVisible(true);
    };

    const openNew = () => {
        setSelectedService({});
        setEditMode(false);
        setDialogVisible(true);
    };

    const saveService = () => {
        editMode ? updateService(selectedService.id, selectedService) : addService();
    };

    const actionTemplate = rowData => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-info"
                onClick={() => editService(rowData)}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteService(rowData.id)}
            />
        </div>
    );

    const convertToSlug = text => {
        return text
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const imageTemplate = (rowData) => {
        const imageSrc = rowData.image?.src || rowData.image;

        return imageSrc ? (
            <img
                src={imageSrc}
                alt="Hizmet Görseli"
                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
            />
        ) : (
            <span>Görsel Yok</span>
        );
    };


    return (
        <div className="pt-3">
            <div className="items-center mb-3">
                <Button
                    label="Ekle"
                    icon="pi pi-plus"
                    className="p-button-success p-button-rounded"
                    onClick={openNew}
                />
            </div>

            <DataTable value={services} paginator rows={5} className="p-datatable-striped">
                <Column field="title" header="Başlık" />
                <Column field="description" header="Açıklama" />
                <Column field="image" header="Görsel" body={imageTemplate} />
                <Column field="sorting" header="Sıralama" />
                <Column body={actionTemplate} header="İşlemler" />
            </DataTable>


            <Dialog
                visible={dialogVisible}
                header={editMode ? "Hizmet Düzenle" : "Yeni Hizmet"}
                modal
                className="p-fluid p-3 dialog-screen"

                draggable={false}
                onHide={() => setDialogVisible(false)}
            >
                {loading && <Loader />}
                <div className="field">
                    <label>Başlık</label>
                    <InputText
                        value={selectedService.title || ""}
                        onChange={e =>
                            setSelectedService({
                                ...selectedService,
                                title: e.target.value,
                                link: convertToSlug(e.target.value)
                            })
                        }
                    />
                </div>

                <div className="field">
                    <label>Açıklama</label>
                    <InputTextarea
                        value={selectedService.description || ""}
                        rows={2}
                        onChange={e =>
                            setSelectedService({
                                ...selectedService,
                                description: e.target.value
                            })
                        }
                    />
                </div>

                <div className="field">
                    <label>İçerik</label>
                    <Editor
                        value={selectedService.content || ""}
                        onTextChange={e =>
                            setSelectedService({
                                ...selectedService,
                                content: e.htmlValue
                            })
                        }
                        style={{ height: '200px' }}
                    />
                </div>

                <div className="field">
                    <label>Sıralama</label>
                    <InputText
                        value={selectedService.sorting || ""}
                        type="number"
                        onChange={e =>
                            setSelectedService({
                                ...selectedService,
                                sorting: e.target.value
                            })
                        }
                    />
                </div>


                <div className="field">
                    <label>Görsel</label>
                    <CustomFileUpload
                        image={selectedService.image}
                        fileUploadRef={fileUploadRef}
                        stateImage={setSelectedService}
                    />
                </div>

                <div className="btn-area field">
                    <Button
                        label="Kaydet"
                        icon="pi pi-check"
                        className="p-button-success p-button-rounded"
                        onClick={() => saveService()}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default Services;
