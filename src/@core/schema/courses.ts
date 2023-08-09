// ** Third Party Imports
import * as yup from 'yup'

export default {
  add: yup.object().shape({
    title: yup.string().required().min(5).max(30),
    description: yup.string().required().min(5).max(200),
    thumbnail_url: yup.string().required(),
    subtitles: yup
      .array()
      .of(
        yup.object().shape({
          text: yup.string(),
          start: yup.string(),
          end: yup.string()
        })
      )
      .required()
  }),
}
