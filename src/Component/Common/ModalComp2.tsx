import { Modal } from 'rsuite'
import ModalProps2 from '../../interface/props/ModalProps2'

const ModalComp2 = (props: ModalProps2) => {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            size={props.size ?? 'md'}
            keyboard={props.keyboard ?? false}
            backdrop={props.backdrop ?? false}
            className={props.className}
            overflow={props.overflow}
        >
            <Modal.Header className='flex justify-between w-full'>
                <Modal.Title className='font-bold text-secondary-active'>{props.title}</Modal.Title>
                {props.headerJsx}
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            {props.footerJsx && <Modal.Footer>{props.footerJsx}</Modal.Footer>}
        </Modal>
    )
}

export default ModalComp2
