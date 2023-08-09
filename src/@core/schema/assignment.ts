
// ** Third Party Imports
import * as yup from 'yup'

const showErrors = (field: string, valueLen: number, min: number) => {
    if (valueLen === 0) {
        return `${field} field is required`
    } else if (valueLen > 0 && valueLen < min) {
        return `${field} must be at least ${min} characters`
    } else {
        return ''
    }
}

export default {
    add: yup.object().shape({
        name: yup.string().required(),
        description: yup.string().required(),
        projectId: yup.string().required(),
        assignmentTypeId: yup.string().required(),
        managers: yup.array().required(),
    })
}
