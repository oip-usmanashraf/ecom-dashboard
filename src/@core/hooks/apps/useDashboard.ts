import { useState } from 'react'

import { dashboardService } from 'src/services'

export const useDashboard = () => {
  // ** Hook

  const [weeksData, setWeeksData] = useState("")
  const [monthsData, setMonthsData] = useState('')
  const [topInstructors, setTopInstructors] = useState([])

  const getWeeks = async () => {
    const { data }: any = await dashboardService.getAllWeeks()
    setWeeksData(data?.data?.users)
  }

  const getMonths = async () => {
    const { data }: any = await dashboardService.getAllMonths()
    setMonthsData(data?.data?.users)
  }

  const getAllTopInstructors = async () => {
    const { data }: any = await dashboardService.getAllInstructors()
    const topInstructors = data?.data?.users?.slice(0, 10)
    setTopInstructors(topInstructors)
  }

  const addStudent = async () => {

  }

  const updateStudent = async () => {

  }

  const deleteStudent = async () => {

  }

  const exportStudents = async () => {
    // csvDownload('students', store.entities)
  }

  return {
    getWeeks,
    getMonths,
    getAllTopInstructors,
    weeksData,
    monthsData,
    topInstructors
  }
}
