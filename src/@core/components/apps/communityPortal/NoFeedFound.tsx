import * as React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Skeleton from '@mui/material/Skeleton'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { ModalType } from 'src/types'
import { DeleteOutline, DotsVertical, ImageEdit, Share, ThumbUp, Comment } from 'mdi-material-ui'
import { Box, Button, Grid, Menu, MenuItem } from '@mui/material'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import { useCommunityFeed } from 'src/@core/hooks/apps/useCommunityFeed'
import LoadingButton from '@mui/lab/LoadingButton'
import { ICommunityFeed } from 'src/types/apps/community-feed'
import { format, compareAsc, formatDistanceToNow } from 'date-fns'
import { AvatarWithImageLink, AvatarWithoutImageLink } from '../../mui/avatar'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { useAuth } from 'src/hooks/useAuth'

const NoFeedFound = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 800, m: 2, minWidth: 800 }}>
        <CardContent>
          {
            <Typography variant='h5' textAlign={'center'} color='text.secondary' component='p'>
              {'Data Not Found'}
            </Typography>
          }
        </CardContent>
        {
          <CardMedia
            component='img'
            height='300'
            image='https://cdn.dribbble.com/userupload/2905383/file/original-4ea237e94e803ddd575a66eb32198899.png?compress=1&resize=400x300&vertical=top'
            alt='Data Not Found'
          />
        }
      </Card>
    </Box>
  )
}

export default NoFeedFound
