import axios from "axios";
import { useState } from "react";
import { useAppSelector } from "../redux/store";
import { API_BASE_URL } from "../redux/const";

interface Iot {
  id: string;
  occupancy: boolean;
}

const useIot = () => {
  const { token } = useAppSelector((state) => state.auth);

  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  const [loading, setLoading] = useState(true);
  const [iot, setIot] = useState<Iot[]>([]);

  const getIots = async () => {
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

  return { loading, iot, getIots };
};

export default useIot;
