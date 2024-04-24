import { ThunkMiddleware } from "@reduxjs/toolkit";
import { apiSlice } from "../apis/api.slice";
import { notificationActions } from "../slices/notification.slice";

// Define the SSE event types
interface SSEEvent {
  domain: "iot" | "notification";
}
interface IotEvent extends SSEEvent {
  domain: "iot";
  action: "update" | "delete" | "create";
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

const createSSEMiddleware = (url: string): ThunkMiddleware => {
  const eventSource = new EventSource(url, {
    withCredentials: true,
  });

  return (store) => (next) => (action) => {
    eventSource.onmessage = (event) => {
      const data: IEvent = JSON.parse(event.data);
      switch (data.domain) {
        case "iot":
          // refetch the iot list
          apiSlice.util.invalidateTags(["Iots"]);

          if (data.action === "delete") {
            // Remove the iot from the list
            store.dispatch(
              apiSlice.util.updateQueryData("getIots", undefined, (draft) => {
                const index = draft.findIndex((iot) => iot.id === data.data.id);
                if (index !== -1) {
                  draft.splice(index, 1);
                }
              })
            );
            return;
          }

          // Replace the iot with the new data
          store.dispatch(
            apiSlice.util.updateQueryData("getIots", undefined, (draft) => {
              const index = draft.findIndex((iot) => iot.id === data.data.id);
              if (index !== -1) {
                draft[index] = data.data;
              } else {
                draft.push(data.data);
              }
            })
          );

          // Singular update
          store.dispatch(
            apiSlice.util.updateQueryData("getIot", data.data.id, (draft) => {
              Object.assign(draft, data.data);
            })
          );
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
