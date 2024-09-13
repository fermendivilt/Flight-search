import Swal, { SweetAlertPosition, SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface toast {
  position?: SweetAlertPosition;
  timerMs?: number;
}

interface SweetAlertProps {
  title: string;
  text?: string;
  icon?: "warning" | "error" | "success" | "info" | "question";
  toast?: toast;
  onConfirm?: CallableFunction;
}

const MySwal = withReactContent(Swal);

function SweetMessage({
  title,
  text,
  icon,
  toast,
  onConfirm,
}: SweetAlertProps) {
  MySwal.fire({
    titleText: title,
    text: text,
    icon: icon,
    toast: toast !== undefined,
    position: toast?.position ?? undefined,
    timer: toast?.timerMs ?? undefined,
  }).then((result: SweetAlertResult) => {
    if (onConfirm !== undefined && result.isConfirmed) onConfirm();
  });
}

export { SweetMessage };
