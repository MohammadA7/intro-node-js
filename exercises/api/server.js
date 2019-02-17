const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

/**
 * this function is blocking, fix that
 * @param {String} name full file name of asset in asset folder
 */
const findAsset = (name) => {
  const assetPath = path.join(__dirname, 'assets', name)
  return new Promise((resolve, reject) => {
    fs.readFile(assetPath, (error, data) => {
      if (data) {
        resolve(data)
      } else {
        reject(error)
      }
    })
  })

}

const hostname = '127.0.0.1'
const port = 3000

// log incoming request coming into the server. Helpful for debugging and tracking
const logRequest = (method, route, status) => console.log(method, route, status)

const server = http.createServer((req, res) => {
  const method = req.method
  const route = url.parse(req.url).pathname
  // this is sloppy, espcially with more assets, create a "router"
  if (route === '/') {
    findAsset('index.html')
      .then(asset => {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        })
        res.write(asset.toString())
        logRequest(method, route, 200)
        res.end()
      })
      .catch(error => console.log(error))
  } else {
    findAsset(route.substr(1))
      .then(asset => {
        res.writeHead(200, {
          'Content-Type': 'text/css'
        })
        res.write(asset.toString())
        logRequest(method, route, 200)
        res.end()
      })
      .catch(error => {
        res.writeHead(404)
        res.write(error.toString())
        logRequest(method, route, 404)
        res.end()
      })
  }
  // most important part, send down the asset
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})