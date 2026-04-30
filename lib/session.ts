export const getSessionId = () => {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("upi_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("upi_session_id", id);
  }
  return id;
};
