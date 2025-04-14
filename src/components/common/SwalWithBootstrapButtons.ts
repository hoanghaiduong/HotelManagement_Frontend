import Swal from "sweetalert2";

const SwalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: false,
});
export default SwalWithBootstrapButtons;
