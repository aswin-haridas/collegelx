export const useAdminCheck = () => sessionStorage.getItem("role") !== "admin";
