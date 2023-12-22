import { useState } from 'react';
import toast from "react-hot-toast";

const usePreviewImg = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImgUrl(reader.result);
            };

            reader.readAsDataURL(file);
        } else {
            toast.error("Invalid File Type, Please Select an image file");
            setImgUrl(null);
        }
    };
    return { handleImageChange, imgUrl, setImgUrl };
}

export default usePreviewImg;