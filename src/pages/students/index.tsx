// ** React Imports
import { useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import TableHeader from 'src/@core/components/apps/students/components/TableHeader'
import Table from 'src/@core/components/apps/students/components/Table'
import Drawer from 'src/@core/components/apps/students/components/Drawer'
import DeleteAlert from 'src/@core/components/common/deleteAlert'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { useStudents } from 'src/@core/hooks/apps/useStudents'

const Page = () => {
  // ** Hooks

  const { serviceId, isDrawerOpen, handleDrawer } = useToggleDrawer()
  const { deleteStudent, getAllStudents } = useStudents(null)

  useEffect(() => {
    getAllStudents({ query: '' })
    return () => {}
  }, [])

  const handleDelete = () => {
    serviceId && deleteStudent(serviceId)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card style={{ marginBottom: 10 }}>
          <TableHeader value={''} handleFilter={() => {}} toggle={() => handleDrawer(null)} />
        </Card>
        <Table />
      </Grid>
      <Drawer open={isDrawerOpen} serviceId={serviceId} toggle={() => handleDrawer(null)} />
      <DeleteAlert title='students' onAgree={handleDelete} />
    </Grid>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'students-page'
}

export default Page
