import { Middleware } from "@reduxjs/toolkit";
import { apiSlice } from "../apis/api.slice";
import { notificationActions } from "../slices/notification.slice";

// Define the SSE event types
interface SSEEvent {
  domain: "iot" | "notification";
}
interface IotEvent extends SSEEvent {
  domain: "iot";
  data: {
    id: string;
    name: string;
    occupancy: boolean;
    location: string;
  };
}
interface NotificationEvent extends SSEEvent {
  domain: "notification";
  data: {
    message: string;
  };
}

type IEvent = IotEvent | NotificationEvent;

const createSSEMiddleware = (url: string): Middleware => {
  const eventSource = new EventSource(url, {
    withCredentials: true,
  });

  return (store) => (next) => (action) => {
    eventSource.onmessage = (event) => {
      const data: IEvent = JSON.parse(event.data);
      switch (data.domain) {
        case "iot":
          apiSlice.util.updateQueryData("getIot", data.data.id, (oldData) => {
            oldData.name = data.data.name;
            oldData.occupancy = data.data.occupancy;
          });
          apiSlice.util.updateQueryData("getIots", undefined, (oldData) => {
            const iotIndex = oldData.findIndex(
              (iot) => iot.id === data.data.id
            );
            console.log(iotIndex);
            if (iotIndex !== -1) {
              oldData[iotIndex].name = data.data.name;
              oldData[iotIndex].occupancy = data.data.occupancy;
            }
          });
          break;
        case "notification":
          store.dispatch(
            notificationActions.new({
              id: Math.random().toString(),
              message: data.data.message,
              viewed: false,
            })
          );
          break;
      }
    };

    return next(action);
  };
};

export default createSSEMiddleware;
