import Swal, { SweetAlertPosition, SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface Toast {
  timerMs?: number;
}

interface Confirmation {
  buttonText?: string;
  onConfirm: CallableFunction;
}

interface SweetAlertProps {
  title: string;
  text?: string;
  icon?: "warning" | "error" | "success" | "info" | "question";
  position?: SweetAlertPosition;
  toast?: Toast;
  confirm?: Confirmation;
}

const MySwal = withReactContent(Swal);

function SweetMessage({
  title,
  text,
  icon,
  position,
  toast,
  confirm,
}: SweetAlertProps) {
  MySwal.fire({
    titleText: title,
    text: text,
    icon: icon,
    toast: toast !== undefined,
    position: position ?? "center",
    timer: toast?.timerMs,
    showConfirmButton: confirm !== undefined,
    confirmButtonText: confirm?.buttonText
  }).then((result: SweetAlertResult) => {
    if (confirm !== undefined && result.isConfirmed) confirm.onConfirm();
  });
}

export { SweetMessage };
