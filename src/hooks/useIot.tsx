import axios from "axios";
import { useState } from "react";
import { API_BASE_URL, useAuth } from "./useAuth";

interface Iot {
  id: string;
  occupancy: boolean;
}

const useIot = () => {
  const { token } = useAuth();

  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  const [loading, setLoading] = useState(true);
  const [iot, setIot] = useState<Iot[]>([]);

  const getIot = async () => {
    setLoading(true);
    const { data } = (
      await api.get("/iot", {
        headers: {
          Authorization: `${token}`,
        },
      })
    ).data;
    setIot(data);
    setLoading(false);
  };

  return { loading, iot, getIot };
};

export default useIot;
