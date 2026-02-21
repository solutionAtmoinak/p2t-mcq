import { ReactNode } from "react";
import { ModalSize } from "rsuite/esm/Modal";

export default interface ModalProps2 {
    title: string;
    open: boolean;
    onClose: () => void;
    headerJsx?: ReactNode;
    footerJsx?: ReactNode;
    children: ReactNode;
    size?: ModalSize;
    placement?: string;
    keyboard?: boolean;
}