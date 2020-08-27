import { NowResponse } from '@vercel/node'

export default (
  res: NowResponse,
  code: number,
  message: string,
  payload?: any
) => {
  res.writeHead(code, message).end(
    JSON.stringify({
      code,
      message,
      payload: payload ?? null
    })
  )
}
