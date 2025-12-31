import { Drawer } from 'rsuite'
import DrawerCompProps from '../interface/DrawerProps'





const DrawerComp = (props: DrawerCompProps) => {

  

  return (

      <Drawer
        open={props.open} onClose={props.onClose}
        backdrop={props.backdrop !== undefined ? props.backdrop : 'static'}
        keyboard={props.closeOnEsc}
        size={props.size}
        placement={props.placement}
        style={props.style}
        className={props.className}
      >
        <Drawer.Header>
          <Drawer.Title className={props.headerClassName}>{props.title}</Drawer.Title>
          {props.action &&
            <Drawer.Actions>
              {props.action}
            </Drawer.Actions>
          }
        </Drawer.Header>
        <Drawer.Body className={props.bodyClassName}>
          {props.children}
        </Drawer.Body>
      </Drawer>

  )
}

export default DrawerComp