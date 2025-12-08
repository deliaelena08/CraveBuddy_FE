import { toast } from "react-hot-toast";
import { useCreateNotificationMutation } from "../apis/notificationQueryApi";

type NotificationType = "success" | "error" | "info";

export const useNotificationSystem = () => {
  const [saveNotification] = useCreateNotificationMutation();

  const userStr = localStorage.getItem("user");
  const storedUser = userStr ? JSON.parse(userStr) : null;
  const userId = storedUser?.id;

  const notify = async (message: string, type: NotificationType = "info") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast(message);
    }

    if (userId) {
      try {
        await saveNotification({ userId, message, type }).unwrap();
      } catch (err) {
        console.error("Failed to save notification to DB history", err);
      }
    }
  };

  return { notify };
};
