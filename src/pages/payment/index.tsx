// ** React Imports
import { MouseEvent, useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'

// ** Custom Components Imports
import TableHeader from 'src/@core/components/apps/subscription/components/TableHeader'
import Drawer from 'src/@core/components/apps/subscription/components/Drawer'
import DeleteAlert from 'src/@core/components/common/deleteAlert'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { useSubscription } from 'src/@core/hooks/apps/useSubscription'
import { Box, Button, Divider, Menu, MenuItem, Skeleton, Typography } from '@mui/material'
import { DeleteOutline, DotsVertical, ImageEdit } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import DataNotFound from 'src/@core/components/apps/channels/components/DataNotFound'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

const RowOptions = ({ id }: { id: string }) => {
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
    handleModal(id)
    handleRowOptionsClose()
  }

  const handleUpdate = () => handleDrawer(id)

  return (
    <>
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
    </>
  )
}

const Page = () => {
  const ability = useContext(AbilityContext)

  // ** Hooks

  const { serviceId, isDrawerOpen, handleDrawer } = useToggleDrawer()
  const router = useRouter()
  const { store, getAllSubscriptions, deleteSubscription } = useSubscription(null)

  const handleDelete = () => {
    serviceId && deleteSubscription(serviceId)
  }

  useEffect(() => {
    getAllSubscriptions({ query: '' })
  }, [])

  return (
    <>
      <Typography variant='h3'>Payment</Typography>
      <TableHeader value={''} handleFilter={() => {}} toggle={() => handleDrawer(null)} />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {store?.status === 'success' ? (
            !store?.entities?.length ? (
              <DataNotFound />
            ) : (
              store?.entities?.map(item => {
                return (
                  <>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <Item style={{ margin: '2.5rem' }}>
                        <Box display={'flex'} justifyContent={'flex-end'}>
                          {ability.can('itsHaveAccess', 'edit-subscription-details') && <RowOptions id={item?.id} />}
                        </Box>
                        <Typography variant='h6' fontSize={'18px'} fontWeight={'600'} lineHeight={'140%'} m={'2.5rem'}>
                          {item.title}
                        </Typography>
                        <Typography
                          variant='h6'
                          fontSize={'13px'}
                          fontWeight={'400'}
                          lineHeight={'161%'}
                          margin={'2.5rem'}
                        >
                          {item?.description}
                        </Typography>
                        <Divider sx={{ margin: '2.5rem' }} />
                        <Typography variant='h6' fontSize={'18px'} fontWeight={'600'} lineHeight={'140%'} m={'2.5rem'}>
                          <Box component={'span'} color={'#B4782D'} fontSize={'72.132px'}>
                            ${item?.price}
                          </Box>
                          /
                          {item.expireYears >= 1
                            ? 'Year'
                            : item.expireMonths >= 1 && item.expireYears <= 1
                            ? 'Month'
                            : 'Days'}
                        </Typography>
                        <Typography
                          variant='h6'
                          fontSize={'13px'}
                          fontWeight={'400'}
                          lineHeight={'161%'}
                          margin={'2.5rem'}
                        >
                          {item?.subTitle}
                        </Typography>
                        {ability.can('itsHaveAccess', 'subscribe-button') && (
                          <Button
                            sx={{
                              marginTop: '10px',
                              marginBottom: '20px',
                              width: '248px',
                              color: '#fff',
                              background: 'linear-gradient(135deg, #2862AD 0%, #3D1D91 46.88%, #AE20CA 100%)'
                            }}
                            onClick={() =>
                              router.push(
                                {
                                  pathname: `/payment/check-out`,
                                  query: item
                                },
                                '/payment/check-out'
                              )
                            }
                          >
                            Subscribe
                          </Button>
                        )}
                        <Divider sx={{ margin: '2.5rem' }} />
                        <Typography textAlign={'start'} margin={'2.5rem'} fontSize={'12px'}>
                          <Box component={'span'} color={'#B4782D'}>
                            DISCLAIMER
                          </Box>
                          {` Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                    into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s.`}
                        </Typography>
                      </Item>
                    </Grid>
                  </>
                )
              })
            )
          ) : (
            <Skeleton variant='rectangular' sx={{ height: '60vh', widows: '75vw' }} />
          )}
          {/* <Grid item xs={5}>
            <Item style={{ margin: '2.5rem' }}>
              <Typography
                variant='h6'
                fontSize={'18px'}
                fontWeight={'600'}
                lineHeight={'140%'}
                m={'2.5rem'}
                textAlign={'start'}
              >
                Included In This Package
              </Typography>
              <List
                sx={{
                  listStyleType: 'disc',
                  margin: '2.5rem',
                  '& .MuiListItem-root': {
                    display: 'list-item'
                  }
                }}
              >
                <ListItem>Lorem Ipsum is simply dummy text. </ListItem>
                <ListItem>Lorem Ipsum is simply dummy text. </ListItem>
                <ListItem>Lorem Ipsum is simply dummy text. </ListItem>
                <ListItem>Lorem Ipsum is simply dummy text. </ListItem>
                <ListItem>Lorem Ipsum is simply dummy text. </ListItem>
                <ListItem>Lorem Ipsum is simply dummy text. </ListItem>
                <ListItem>Lorem Ipsum is simply dummy text. </ListItem>
                <ListItem>Lorem Ipsum is simply dummy text. </ListItem>
                <ListItem>Lorem Ipsum is simply dummy text. </ListItem>
                <ListItem>Lorem Ipsum is simply dummy text. </ListItem>
              </List>
            </Item>
            <Item style={{ margin: '2.5rem' }}>
              <Box display={'flex'}>
                <Box>
                  <Typography
                    variant='h6'
                    fontSize={'18px'}
                    fontWeight={'600'}
                    lineHeight={'140%'}
                    textAlign={'start'}
                    padding={5}
                  >
                    Payment Method
                  </Typography>
                  <Typography component={'p'} textAlign={'start'} paddingLeft={5}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. text of the printing and
                    typesetting industry.
                  </Typography>
                </Box>
                <Box margin={'2.5rem'} width={'500px'}>
                  <Image src='/images/icons/project-icons/payment.png' width='100%' height='150px' />
                </Box>
              </Box>
            </Item>
          </Grid> */}
        </Grid>
      </Box>
      <Drawer open={isDrawerOpen} serviceId={serviceId} toggle={() => handleDrawer(null)} />
      <DeleteAlert title='students' onAgree={handleDelete} />
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'payment-page'
}

export default Page
