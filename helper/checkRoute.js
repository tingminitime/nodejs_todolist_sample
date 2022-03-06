// 檢查網址 path 是否正確
const isRouteError = (req, defaultPath) => {
  let result = true

  if (req.url.startsWith(defaultPath)) {
    switch (req.method) {
      case 'GET':
      case 'POST':
      case 'OPTIONS':
        if (req.url === defaultPath) result = false
        break

      case 'PATCH':
      case 'DELETE':
        result = false
        break

      default:
        break
    }
  }

  return result
}

module.exports = isRouteError