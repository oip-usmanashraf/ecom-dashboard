import { Box, Skeleton, Typography } from '@mui/material'
import React from 'react'
import { AvatarWithImageLink, AvatarWithoutImageLink } from 'src/@core/components/mui/avatar'
import useAsync from 'src/@core/hooks/useAsync'
import { ChannelService } from 'src/services'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { IChannels } from 'src/types/apps/channels'
import { useChannels } from 'src/@core/hooks/apps/useChannels'
import { AuthContext } from 'src/context/AuthContext'
import { useAuth } from 'src/hooks/useAuth'
import Link from 'next/link'
import { textOverflow } from 'src/@core/helper/text'

interface CellType {
  row: IChannels
}

// ** renders client column
export const renderClient = (row: IChannels) => {
  if (row && row.thumnail_url) {
    return (
      <AvatarWithImageLink href={`/channels/${row.id}`}>
        <CustomAvatar src={row?.thumnail_url} sx={{ mr: 3, width: 34, height: 34 }} />
      </AvatarWithImageLink>
    )
  } else {
    return (
      <AvatarWithoutImageLink href={`/channels/${row.id}`}>
        <CustomAvatar
          skin='light'
          color={row.avatarColor || 'primary'}
          sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
        >
          {getInitials(row?.name || 'UnKnown')}
        </CustomAvatar>
      </AvatarWithoutImageLink>
    )
  }
}

const MyChannelList = () => {
  const auth = useAuth()

  const { status, data, error, execute } = useAsync(ChannelService.getByUser)

  const switchChannel = (id: number) => {
    auth.handleSwitchChannel(id)
  }

  return (
    <>
      {auth?.user?.role?.code === 'SUPER_ADMIN' ? null : (
        <Typography
          noWrap
          component='a'
          variant='subtitle2'
          sx={{ color: 'text.primary', textDecoration: 'none', margin: 'auto', marginTop: 2 }}
        >
          Switch Channel
        </Typography>
      )}
      {status === 'pending' ? (
        <Skeleton variant='rounded' width={'100%'} height={'5vh'} />
      ) : (
        data?.data?.entities?.map((item: any) => (
          <>
            {/* <Link href={`/channels/${item?.id}`}> */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                cursor: 'pointer',
                margin: 2,
                background: 'linear-gradient(140.58deg, #363636 -21.35%, #2D2D2D 101.65%)'
              }}
              onClick={() => switchChannel(item?.id)}
            >
              {renderClient(item)}
              <Typography
                noWrap
                component='a'
                variant='subtitle2'
                sx={{ color: 'text.primary', textDecoration: 'none' }}
              >
                {textOverflow(item?.name, 15)}
              </Typography>
            </Box>
          </>
        ))
      )}
    </>
  )
}

export default MyChannelList
