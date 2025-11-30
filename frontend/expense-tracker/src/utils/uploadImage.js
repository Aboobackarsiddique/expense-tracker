import { API_PATH } from "./apiPath";
import axiosInstance from "./axiosInstance";

export const UploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
        const response = await axiosInstance.post(API_PATH.IMAGE.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

}