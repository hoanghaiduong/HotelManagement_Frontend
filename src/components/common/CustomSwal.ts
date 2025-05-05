// SwalCustom.ts
import Swal, { SweetAlertOptions } from "sweetalert2";
const ShowCustomSwal = (options: SweetAlertOptions) => {
  return Swal.fire({
    ...options,
    customClass: {
      container: "swal-container",
      // ...options.customClass, // allow overriding if needed
    },
  });
};
export default ShowCustomSwal;
