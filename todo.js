const { v4: uuidv4 } = require('uuid')
const { PATH, httpStatusCodes: statusCodes } = require('./config')
const { data: todoData } = require('./data/default')
const isRouteError = require('./helper/checkRoute')
const { errorHandler, successHandler } = require('./helper/responseHandler')

const todoRoute = (req, res) => {
  const splitUrl = req.url.split('/').filter(e => e)

  // 檢查網址 path 是否正確
  if (isRouteError(req, PATH)) {
    errorHandler(res, statusCodes.NOT_FOUND, '404 Not Found!')
    return
  }

  let body = ''
  req.on('data', chunk => {
    body += chunk
  })

  if (req.method === 'GET') {
    successHandler(res, todoData)
  }
  else if (req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        if (title) {
          todoData.push({
            id: uuidv4(),
            title,
          })

          successHandler(res, todoData)
        } else {
          errorHandler(res, statusCodes.BAD_REQUEST, '請填寫正確的 title 內容!')
        }
      } catch {
        errorHandler(res, statusCodes.BAD_REQUEST, '欄位未填寫正確!')
      }
    })
  }
  else if (req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        const index = todoData.findIndex(todo => todo.id === splitUrl[1])

        if (title && index !== -1) {
          todoData[index].title = title
        } else {
          errorHandler(res, statusCodes.BAD_REQUEST, '請修改正確 id 或填寫正確 title 內容!')
          return
        }

        successHandler(res, todoData, '修改成功!')
      } catch {
        errorHandler(res, statusCodes.BAD_REQUEST, '格式錯誤!')
      }
    })
  }
  else if (req.method === 'DELETE') {
    const isDeleteAll = splitUrl.length === 1
    if (isDeleteAll) {
      todoData.length = 0
      successHandler(res, todoData, '已刪除全部待辦事項!')
    } else {
      const index = todoData.findIndex(todo => todo.id === splitUrl[1])
      if (index !== -1) {
        todoData.splice(index, 1)
        successHandler(res, todoData, '刪除一筆成功!')
      } else {
        errorHandler(res, statusCodes.BAD_REQUEST, '刪除失敗，找不到此待辦事項!')
      }
    }
  }
  else if (req.method === 'OPTIONS') {
    successHandler(res)
  }
  else {
    errorHandler(res, statusCodes.NOT_FOUND, '404 Not Found!')
  }
}

module.exports = todoRoute