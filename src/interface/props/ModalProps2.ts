import { ReactNode } from "react";
import { ModalProps as RsuiteModalProps } from "rsuite";
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
    className?: string;
    overflow?: boolean;
    backdrop?: RsuiteModalProps["backdrop"];
}
