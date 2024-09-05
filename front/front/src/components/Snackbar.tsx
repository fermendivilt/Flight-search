import * as React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";

interface FastSnackbarProps {
  message: string;
  onDead: () => void;
}

export default function FastSnackbar({ message, onDead }: FastSnackbarProps) {
  const [open, setOpen] = React.useState(true);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason !== "timeout") return;

    setOpen(false);
    onDead();
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
      />
    </div>
  );
}
