import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
// import { Editor } from "primereact/editor";
// import { InputText } from "primereact/inputtext";
import CustomFileUpload from "../components/UI/CustomFileUpload";
import Loader from "../components/UI/Loader";
import Swal from 'sweetalert2';
import { BASE_URL } from "../config";

const API_URL = BASE_URL + "/applications";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedApp, setSelectedApp] = useState({});
    const [loading, setLoading] = useState(false);
    const fileUploadRef = useRef(null);


    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axios.get(API_URL);
            setApplications(response.data);
        } catch (error) {
            console.error("Veriler alınırken hata oluştu:", error);
        }
    };

    const addApplication = async () => {
        try {

            // Görseli backend'e yükle
            if (selectedApp.image) {
                const imageUrl = await uploadImageToBackend(selectedApp.image);
                selectedApp.image = BASE_URL + imageUrl;
            }

            if (!selectedApp.description || !selectedApp.image) {
                Swal.fire({
                    title: "Boş Alan Bırakmayınız!",
                    icon: "error",
                    confirmButtonText: "Tamam"
                });
                return;
            }

            setLoading(true);
            await axios.post(API_URL, selectedApp);

            setApplications([...applications, selectedApp]);
            setDialogVisible(false);

        } catch (error) {
            console.error("Uygulama eklenirken hata oluştu:", error);
            Swal.fire({
                title: "Uygulama Eklenemedi!",
                icon: "error",
                confirmButtonText: "Tamam"
            });
        } finally {
            setLoading(false);
        }
    };

    const updateApp = async (id, updatedApp) => {
        const result = await Swal.fire({
            title: "Güncellemek istediğinize emin misiniz?",
            text: "Bu işlem geri alınamaz!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Evet, güncelle!",
            cancelButtonText: "Hayır, iptal et"
        });

        if (result.isConfirmed) {

            if (updatedApp.image && updatedApp.image.startsWith("data:image")) {
                const imageUrl = await uploadImageToBackend(updatedApp.image);
                updatedApp.image = BASE_URL + imageUrl; // Backend'den dönen görsel URL'sini kaydediyoruz
            }

            try {
                const response = await axios.put(`${BASE_URL}/applications/${id}`, updatedApp);
                if (response.status === 200) {
                    setApplications(applications.map(app =>
                        app.id === id ? { ...app, ...updatedApp } : app
                    ));

                    Swal.fire({
                        title: "Başarılı!",
                        text: "Uygulama başarıyla güncellendi.",
                        icon: "success",
                        confirmButtonText: "Tamam"
                    });

                }
            } catch (error) {
                console.error("Uygulama güncellenirken hata oluştu:", error);

                Swal.fire({
                    title: "Hata!",
                    text: "Bir hata oluştu, uygulama güncellenemedi.",
                    icon: "error",
                    confirmButtonText: "Tamam"
                });
            }
        }
    };

    const deleteApp = async (id) => {
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
                const response = await axios.delete(`${BASE_URL}/applications/${id}`);

                if (response.status === 200) {
                    setApplications(applications.filter(app => app.id !== id));
                    Swal.fire({
                        title: "Başarılı!",
                        text: "Uygulama başarıyla silindi.",
                        icon: "success",
                        confirmButtonText: "Tamam"
                    });
                }
            } catch (error) {
                console.error("Uygulama silinirken hata oluştu:", error);

                Swal.fire({
                    title: "Hata!",
                    text: "Bir hata oluştu, uygulama silinemedi.",
                    icon: "error",
                    confirmButtonText: "Tamam"
                });
            }
        }
    };

    const uploadImageToBackend = async (base64Image) => {
        const formData = new FormData();
        // Base64 verisini dosya formatında backend'e gönderemeyiz. Bunun yerine dosya göndereceğiz.
        const byteCharacters = atob(base64Image.split(',')[1]); // Base64 verisini çözüyoruz
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const file = new Blob(byteArrays, { type: 'image/jpeg' }); // Dosya türünü doğru belirleyin
        formData.append("image", file, "image.jpg"); // "image" anahtarıyla dosyayı gönderiyoruz
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

    const editApp = rowData => {
        setSelectedApp(rowData);
        setEditMode(true);
        setDialogVisible(true);
    };

    const openNew = () => {
        setSelectedApp({});
        setEditMode(false);
        setDialogVisible(true);
    };

    const saveApp = () => {
        editMode ? updateApp(selectedApp.id, selectedApp) : addApplication();
    };

    const actionTemplate = rowData => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-info"
                onClick={() => editApp(rowData)}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => deleteApp(rowData.id)}
            />
        </div>
    );

    const imageTemplate = (rowData) => {
        const imageSrc = rowData.image?.src || rowData.image;

        return imageSrc ? (
            <img
                src={imageSrc}
                alt="Uygulama Görseli"
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

            <DataTable value={applications} paginator rows={5} className="p-datatable-striped">
                <Column field="description" header="Açıklama" />
                <Column field="image" header="Görsel" body={imageTemplate} />
                 <Column body={actionTemplate} header="İşlemler" />
            </DataTable>


            <Dialog
                visible={dialogVisible}
                header={editMode ? "Uygulama Düzenle" : "Yeni Uygulama"}
                modal
                className="p-fluid p-3"
                draggable={false}
                onHide={() => setDialogVisible(false)}
            >
                {loading && <Loader />}

                <div className="field">
                    <label>Açıklama</label>
                    <InputTextarea
                        value={selectedApp.description || ""}
                        rows={2}
                        onChange={e =>
                            setSelectedApp({
                                ...selectedApp,
                                description: e.target.value
                            })
                        }
                    />
                </div>

                <div className="field">
                    <label>Görsel</label>
                    <CustomFileUpload
                        image={selectedApp.image}
                        fileUploadRef={fileUploadRef}
                        stateImage={setSelectedApp}
                    />
                </div>

                <div className="btn-area field">
                    <Button
                        label="Kaydet"
                        icon="pi pi-check"
                        className="p-button-success p-button-rounded"
                        onClick={() => saveApp()}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default Applications;
