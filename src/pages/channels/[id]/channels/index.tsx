import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'

// ** Component Imports
import ChannelLayout from 'src/@core/layouts/ChannelLayout'
import UserLayout from 'src/layouts/UserLayout'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { IChannels } from 'src/types/apps/channels'
import Link from 'next/link'
import CheckIcon from '@mui/icons-material/Check'
import { useChannels } from 'src/@core/hooks/apps/useChannels'
import LoadingButton from '@mui/lab/LoadingButton'
import { textOverflow } from 'src/@core/helper/text'
import DataNotFound from 'src/@core/components/apps/channels/components/DataNotFound'

const Page = () => {
  const { store, getMyChannels, subscribeChannelByUserId, getChannelById } = useChannels(null)

  const {
    query: { id: paramId }
  } = useRouter()

  useEffect(() => {
    getMyChannels(store?.entity?.userId)
  }, [])

  const subscribeChannel = async (id: string) => {
    const { statusCode } = await subscribeChannelByUserId(id)
    if (statusCode === '10000') {
      getMyChannels(store?.entity?.userId)
      if (paramId === id) {
        getChannelById(paramId)
      }
    }
  }

  return (
    <>
      <Box display={'flex'} flexWrap={'wrap'}>
        {store?.status === 'success' ? (
          !store?.entities?.length ? (
            <DataNotFound />
          ) : (
            store?.entities?.map((item: IChannels) => {
              return (
                <Stack
                  key={item.id}
                  direction='column'
                  margin={5}
                  spacing={5}
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  width={'240px'}
                >
                  <Link href={`/channels/${item?.id}`}>
                    <Box width={100} sx={{ cursor: 'pointer' }}>
                      <Image
                        src={item?.thumnail_url || '/images/avatars/avatar.png'}
                        width='100px'
                        height='100px'
                        alt='Remy sharp'
                        style={{ borderRadius: '50px' }}
                      />
                    </Box>
                  </Link>
                  <Stack direction='column' spacing={0}>
                    <Typography component={'p'} margin={0} textAlign={'center'} fontSize={'1.4rem'} fontWeight={'500'}>
                      {textOverflow(item?.name, 20)}
                    </Typography>
                    <Typography component={'p'} margin={0} mt='0' textAlign={'center'}>
                      {item?.subscriber?.length > 1
                        ? item?.subscriber?.length + ' Subscribers'
                        : item?.subscriber?.length + ' Subscriber'}
                    </Typography>
                    <LoadingButton
                      loading={store.status === 'pending'}
                      disabled={store.status === 'pending'}
                      loadingPosition='end'
                      style={
                        item?.isSubscribed
                          ? { background: 'white', color: 'black' }
                          : { color: '#fff', background: 'linear-gradient(360deg, #EFD9AE -73.58%, #B4772C 97.53%)' }
                      }
                      sx={{
                        display: 'flex',
                        margin: 'auto',
                        width: '180px',
                        color: '#fff',
                        background: 'linear-gradient(360deg, #EFD9AE -73.58%, #B4772C 97.53%)',
                        mt: 5
                      }}
                      type='submit'
                      endIcon={item?.isSubscribed ? <CheckIcon color='success' /> : null}
                      onClick={() => subscribeChannel(item?.id)}
                    >
                      {item?.isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </LoadingButton>
                  </Stack>
                </Stack>
              )
            })
          )
        ) : (
          <Skeleton variant='rectangular' width={'100%'} height={'60vh'} />
        )}
      </Box>
    </>
  )
}

Page.getLayout = (page: ReactNode) => (
  <UserLayout>
    <ChannelLayout>{page}</ChannelLayout>
  </UserLayout>
)

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'channels-page'
}

export async function getServerSideProps() {
  // Return the fetched data as props
  return {
    props: {}
  };
}

export default Page
