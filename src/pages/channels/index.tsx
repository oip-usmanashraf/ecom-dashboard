import Cards from 'src/@core/components/apps/channels/components/Cards'
import TableHeader from 'src/@core/components/apps/channels/components/TableHeader'
import ChannelDrawer from 'src/@core/components/apps/channels/components/ChannelDrawer'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import { ModalType } from 'src/types'
import { useChannels } from 'src/@core/hooks/apps/useChannels'


const Page = () => {
  const { serviceId, isDrawerOpen, handleDrawer } = useToggleDrawer()

  const { deleteChannels } = useChannels(serviceId)

  const handleDeleteChannel = () => {
    serviceId && deleteChannels(serviceId)
  }

  return (
    <>
      <TableHeader value={''} handleFilter={() => { }} toggle={() => handleDrawer(null)} />
      <Cards />
      <ChannelDrawer open={isDrawerOpen} serviceId={serviceId} toggle={() => handleDrawer(null)} />
      <DeleteAlert title='Channel' type={ModalType.CHANNEL} onAgree={() => handleDeleteChannel()} />
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'channels-page'
}

export default Page
