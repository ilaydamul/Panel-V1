import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import React from "react";

function CustomFileUpload({ image, stateImage, fileUploadRef }) {
    
    const handleFileUpload = (event) => {
        const file = event.files[0]; 
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                stateImage((prev) => ({
                    ...prev,
                    image: e.target.result,
                    imageName: file.name
                }));
             
            };
            reader.readAsDataURL(file); 
        }
    };
    
    const handleRemoveImage = () => {
        stateImage((prev) => ({
            ...prev,
            image: null,
        }));

        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };

    
    return (
        <div className="">
            {image && (
                <div className="relative w-200 h-200 mb-2">
                    <img
                        src={image}
                        alt="Yüklenen Görsel"
                        className="w-200 h-200 object-contain rounded-md"
                    />
                </div>
            )}

            <div className="flex gap-2">
                {/* Görsel yükleme butonu */}
                <FileUpload
                    mode="basic"
                    accept="image/*"
                    customUpload
                    onSelect={handleFileUpload}
                    className="p-button-outlined p-button-secondary"
                    chooseLabel={image ? "Görsel Değiştir" : "Görsel Yükle"}
                    ref={fileUploadRef}
                />

                {image && (
                    <Button
                        icon="pi pi-trash"
                        className="p-button-danger p-button-outlined"
                        onClick={handleRemoveImage}
                        tooltip="Görseli Sil"
                    />
                )}
            </div>
        </div>
    );
}

export default CustomFileUpload;
