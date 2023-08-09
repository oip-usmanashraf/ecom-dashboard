import * as React from 'react'

// ** MUI
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import StepLabel from '@mui/material/StepLabel'

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper'

// ** Custom Components Imports
import StepperCustomDot from 'src/@core/components/signup/StepperDot'

import {
  VideoCheck,
  VideoDetails,
  VideoElement,
  VideoVisibility
} from 'src/@core/components/apps/courses/components/Video'

// const steps = ['Details', 'Video elements', 'Checks', 'Visibility']
const steps = [
  {
    title: 'Details'
  },
  {
    title: 'Video elements'
  },
  {
    title: 'Checks'
  },
  {
    title: 'Visibility'
  }
]

export default function Steps() {
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const handleComplete = () => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()
  }

  const handleReset = () => {
    setActiveStep(0)
    setCompleted({})
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <VideoDetails step={step} />
      case 1:
        return <VideoElement step={step} />
      case 2:
        return <VideoCheck step={step} />
      case 3:
        return <VideoVisibility step={step} />
      default:
        return 'Unknown Step'
    }
  }

  return (
    <Box className='content-center' style={{ flexDirection: 'column', justifyContent: 'start' }}>
      <StepperWrapper style={{ width: '100%', textAlign: 'center' }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.title} completed={completed[index]}>
              <StepLabel StepIconComponent={StepperCustomDot}>
                <div className='step-label'>
                  <div>
                    <Typography className='step-title'>{step.title}</Typography>
                  </div>
                </div>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid container>
          <Grid item xs={12} sx={{ marginX: 20, marginTop: 20 }}>
            {getStepContent(activeStep)}
          </Grid>
          <Grid item xs={12} style={{ position: 'fixed', bottom: 0, right: 0 }} padding={10}>
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <Button variant='contained' disabled={activeStep === 3} onClick={handleNext} sx={{ marginLeft: 5 }}>
                Next
              </Button>
              <Button variant='text' disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
            </Box>
          </Grid>
        </Grid>
      </StepperWrapper>
    </Box>
  )
}
