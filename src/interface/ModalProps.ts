import { ReactNode } from "react";

export default interface ModalProps {
  sizeClass: string;
  title: string;
  open: boolean;
  closeBtnView: boolean;
  onSave?: () => void;
  onClose?: () => void;
  isShow?: boolean;
  children: ReactNode;
  disabled?: boolean
}
