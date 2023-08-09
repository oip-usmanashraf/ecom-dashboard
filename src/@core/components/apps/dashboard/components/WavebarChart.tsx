// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Line } from 'react-chartjs-2'

interface LineProps {
  white: string
  warning: string
  primary: string
  success: string
  labelColor: string
  borderColor: string
  gridLineColor: string
}

const WavebarChart = (props: LineProps) => {
  // ** Props
  const { white, primary, success, warning, labelColor, borderColor, gridLineColor } = props

  const options = {
    responsive: true,
    backgroundColor: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: labelColor },
        grid: {
          borderColor,
          color: gridLineColor
        }
      },
      y: {
        min: 0,
        max: 50,
        scaleLabel: { display: true },
        ticks: {
          stepSize: 20,
          color: labelColor
        },
        grid: {
          borderColor,
          color: gridLineColor
        }
      }
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 10,
          color: labelColor,
          usePointStyle: true
        }
      }
    }
  }

  const data = {
    labels: [0, 10, 20],
    datasets: [
      {
        fill: false,
        tension: 0.5,
        pointRadius: 1,
        // label: 'Europe',
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: primary,
        backgroundColor: primary,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: primary,
        data: [10, 20, 30]
      }
    ]
  }

  return (
    <CardContent>
      <Line data={data} options={options as any} />
    </CardContent>
  )
}

export default WavebarChart
