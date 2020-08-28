import { NowResponse } from '@vercel/node'

export default (
  res: NowResponse,
  code: number,
  message: string,
  payload?: any
) => {
  const json = JSON.stringify({
    code,
    message,
    payload: payload ?? null
  })

  res
    .writeHead(code, message, {
      'content-type': 'application/json; charset=utf-8'
    })
    .end(json)
}
