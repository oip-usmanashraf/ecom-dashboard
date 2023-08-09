// ** Third Party Imports
import * as yup from 'yup'

export default {
  add: yup.object().shape({
    name: yup.string().min(3).max(50, 'Name must be at most 50 characters').required(),
    thumbnail: yup.string().required('Thumbnail Is Required')
    // videos: yup.array().of(yup.string().required("Video must be selected")),
    // type: yup.string().required(),
    // uploadOpenAt: yup.string().required(),
    // uploadCloseAt: yup.string().required(),
    // uploadTime: yup.string().required(),
    // votingCloseAt: yup.string().required(),
    // votingOpenAt: yup.string().required(),
    // votingTime: yup.string().required()
  })
}
