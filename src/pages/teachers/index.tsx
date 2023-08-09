// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Drawer from 'src/@core/components/apps/teachers/components/Drawer'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
//**import custom hooks */

import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { useTeacher } from 'src/@core/hooks/apps/useteacher'
import TeacherTable from 'src/@core/components/apps/teachers/components/Table'
import TableHeader from 'src/@core/components/apps/teachers/components/TableHeader'
import { Card } from '@mui/material'
const Page = () => {
  // ** Hooks

  const { serviceId, isDrawerOpen, handleDrawer } = useToggleDrawer()
  const { deleteTeacher, getAllTeachers, getTeacher } = useTeacher(null)

  useEffect(() => {
    getAllTeachers({ query: '' })
    return () => {}
  }, [])

  const handleDelete = () => {
    serviceId && deleteTeacher(serviceId)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card style={{ marginBottom: 10 }}>
          <TableHeader value={''} handleFilter={() => {}} toggle={() => handleDrawer(null)} />
        </Card>
        <TeacherTable />
      </Grid>
      <Drawer open={isDrawerOpen} serviceId={serviceId} toggle={() => handleDrawer(null)} />
      <DeleteAlert title='teachers' onAgree={handleDelete} />
    </Grid>
  )
}
Page.acl = {
  action: 'itsHaveAccess',
  subject: 'teachers-page'
}

export default Page
