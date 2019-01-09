import fs from 'fs'
import ytdl from 'ytdl-core'
import path from 'path'
import shortid from 'shortid'

export default function (body, query, next) {
  let info
  let format
  let counter = 0
  const uploadTemp = path.join(__dirname, shortid.generate())
  console.log(uploadTemp)
  const stream = fs.createWriteStream(uploadTemp)
  const downloadStream = ytdl(`http://www.youtube.com/watch?v=${query.id}`, {
    quality: 'highestaudio',
    filter: 'audioonly',
  })

  downloadStream.on('info', (eventInfo, eventFormat) => {
    info = eventInfo
    format = eventFormat
    counter += 1
    console.log('info counter', counter)
    if (counter === 2) {
      callNext()
    }
  }).pipe(stream)

  stream.on('close', () => {
    counter += 1
    console.log('close counter', counter)
    if (counter === 2) {
      callNext()
    }
  })

  function callNext () {
    const finalPath = path.join(
      __dirname,
      `${info.player_response.videoDetails.title}.${format.container}`
    )
    fs.rename(
      uploadTemp,
      finalPath,
      (err) => {
        if (err) console.log('ERROR: ' + err)
      }
    )
    next(finalPath)
  }
}
