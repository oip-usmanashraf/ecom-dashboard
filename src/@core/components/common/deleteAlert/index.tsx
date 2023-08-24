
// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** Import Custom hooks
import useToggleDrawer from "src/@core/hooks/useToggleDrawer"

import { ModalType } from 'src/types'

const DeleteAlert = ({
    title = 'records',
    type = ModalType.DEFAULT,
    onAgree,
}: { title?: string, onAgree: () => void, type?: ModalType }) => {

    // ** hooks
    const { isModalOpen, handleModal, modalType } = useToggleDrawer();
    const handleClose = () => handleModal(null)

    return (
        <Dialog
            open={(isModalOpen && modalType === type)}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            PaperProps={{
                sx:{
                  borderRadius: '15px',
                  background: 'linear-gradient(314deg, #101010 3.30%, rgba(20, 20, 20, 0.26) 100%) !important',
                  boxShadow: '0px 4px 104px 0px rgba(158, 0, 255, 0.15) inset',
                  backdropFilter: 'blur(100px)', 
                }
              }}
        >
            <DialogTitle id='alert-dialog-title'>Are you sure want to delete this {title}?</DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    Do you really want to delete these {title}?
                    this process cannot be undo.
                </DialogContentText>
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={onAgree}>Agree</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteAlert
