const { v4: uuidv4 } = require('uuid')

module.exports = {
  data: [
    {
      id: uuidv4(),
      title: '預設資料1',
    }
  ]
}