import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default function ServerDialog({
  open, message, onClose,
}: { open: boolean; message: string | null; onClose: () => void; }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Server notification</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
