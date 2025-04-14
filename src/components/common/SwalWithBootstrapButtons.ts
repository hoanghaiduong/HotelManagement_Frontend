import Swal from "sweetalert2";
const SwalWithBootstrapButtons = Swal.mixin({
customClass: {
confirmButton: `flex items-center justify-center w-full px-4 py-3 text-sm
font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs
hover:bg-brand-600`,
cancelButton: "btn btn-danger",
},
buttonsStyling: false,
});
export default SwalWithBootstrapButtons;