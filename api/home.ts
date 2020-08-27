import { load } from 'cheerio'

import { NowRequest, NowResponse } from '@vercel/node'
import { fetchDocument, parseId, sendResponse } from './helpers'

export default async (_: NowRequest, res: NowResponse) => {
  try {
    const $ = await fetchDocument('/')

    const popular = $('.popular a.th-in')
      .toArray()
      .map((e) => {
        const i = load(e)

        return {
          id: parseId(e.attribs.href),
          url: e.attribs.href,
          poster: i('img').attr('data-src'),
          title: i('.th-title').text(),
          year: i('span a').text()
        }
      })

    sendResponse(res, 200, 'OK', {
      popular
    })
  } catch (e) {
    console.error("i can't parse main page:", e)
    sendResponse(res, 500, 'Internal Server Error')
  }
}
