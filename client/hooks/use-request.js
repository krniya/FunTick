import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);
    const doRequest = async () => {
        try {
            const response = await axios[method](url, body, { withCredentials: true });
            if (onSuccess) onSuccess(response.data);
            return response.data;
        } catch (err) {
            setErrors(err.response.data.errors);
            err.response.data.errors.map((error) => {
                toast.error(error.message);
            });
        }
    };
    return { doRequest, errors };
};
