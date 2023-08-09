import { useState, MouseEvent } from 'react'
// ** Next Import
import Link from 'next/link'
/**Mui components */

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Image from 'next/image'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import Menu from '@mui/material/Menu'
import { styled } from '@mui/material/styles'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import MenuItem from '@mui/material/MenuItem'
import { useTeacher } from 'src/@core/hooks/apps/useteacher'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
// ** Types Imports
import { ITeacher } from 'src/types/apps/teacher'
import { ImageEdit } from 'mdi-material-ui'

// ** Styled component for the link for the avatar with image
const AvatarWithImageLink = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(3)
}))

// ** Styled component for the link for the avatar without image
const AvatarWithoutImageLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  marginRight: theme.spacing(3)
}))
export const renderClient = (row: ITeacher) => {
  if (row.company && row.company.logo) {
    return (
      <AvatarWithImageLink href={`/teacher/view/${row.id}`}>
        <CustomAvatar src={row?.company?.logo} sx={{ mr: 3, width: 34, height: 34 }} />
      </AvatarWithImageLink>
    )
  } else {
    return (
      <AvatarWithoutImageLink href={`/teacher/view/${row.id}`}>
        <CustomAvatar
          skin='light'
          color={row.avatarColor || 'primary'}
          sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
        >
          {getInitials(row?.company?.name)}
        </CustomAvatar>
      </AvatarWithoutImageLink>
    )
  }
}

const TeacherList = () => {
  // ** Hooks
  const { handleDrawer, handleModal } = useToggleDrawer()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    handleModal(null)
    handleRowOptionsClose()
  }

  const handleUpdate = () => handleDrawer(null)
  const {
    store: { entities }
  } = useTeacher(null)

  return (
    <>
      <Card>
        {/* <Img width="49px" height="49px" alt='Upload img' src={ '/images/misc/upload.png'}  /> */}
        {entities.map(teacher => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', justifyContent: 'space-between' }}>
              <Box sx={{ flex: '0 0 15%' }}>
                <Image
                  src={teacher.image ? teacher.image : '/images/misc/upload.png'}
                  alt='teacher image'
                  width='49px'
                  height='49px'
                />
              </Box>
              <Box sx={{ paddingLeft: '10px', textAlign: 'left', flex: '0 0 65%' }}>
                <Typography variant='h6'>{teacher.first_name + ' ' + teacher.last_name}</Typography>
                <Typography component='p' sx={{ color: '#7C7C7C' }}>
                  {teacher.description}
                </Typography>
              </Box>
              <Box sx={{ alignItems: 'end' }}>
                <IconButton size='small' onClick={handleRowOptionsClick}>
                  <DotsVertical />
                </IconButton>
                <Menu
                  keepMounted
                  anchorEl={anchorEl}
                  open={rowOptionsOpen}
                  onClose={handleRowOptionsClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  PaperProps={{ style: { minWidth: '8rem' } }}
                >
                  <MenuItem onClick={handleDelete}>
                    <DeleteOutline fontSize='small' sx={{ mr: 2 }} />
                    Delete
                  </MenuItem>
                  <MenuItem onClick={handleUpdate}>
                    <ImageEdit fontSize='small' sx={{ mr: 2 }} />
                    Edit
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          )
        })}
      </Card>
    </>
  )
}
export default TeacherList
