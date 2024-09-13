import Swal, { SweetAlertPosition, SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface Toast {
  position?: SweetAlertPosition;
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
  toast?: Toast;
  confirm?: Confirmation;
}

const MySwal = withReactContent(Swal);

function SweetMessage({
  title,
  text,
  icon,
  toast,
  confirm,
}: SweetAlertProps) {
  MySwal.fire({
    titleText: title,
    text: text,
    icon: icon,
    toast: toast !== undefined,
    position: toast?.position,
    timer: toast?.timerMs,
    showConfirmButton: confirm !== undefined,
    confirmButtonText: confirm?.buttonText
  }).then((result: SweetAlertResult) => {
    if (confirm !== undefined && result.isConfirmed) confirm.onConfirm();
  });
}

export { SweetMessage };
