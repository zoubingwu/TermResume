import README from './../files/README'
import resume from './../resume'

export default {
  name: '~',
  type: 'dir',
  files: [
    {
      name: 'README',
      content: README,
      type: 'file'
    },
    {
      name: 'resume',
      content: resume,
      type: 'file'
    },
    {
      name: 'projects',
      type: 'dir',
      files: [
        {
          name: '123',
          content: '123',
          type: 'file'
        },
        {
          name: '234',
          content: '234',
          type: 'file'
        },
        {
          name: '345',
          content: '345',
          type: 'file'
        },
      ]
    }
  ]
}