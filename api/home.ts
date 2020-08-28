import { load } from 'cheerio'

import { NowRequest, NowResponse } from '@vercel/node'
import { fetchDocument, parseId, sendResponse } from './helpers'

// nightmare

const parseSection = ($: Cheerio) =>
  $.find('a.th-in')
    .toArray()
    .map((e) => {
      const i = load(e)
      const current = Number(i('.th-lastser span').text().trim())
      const overall = i('.th-lastser small').text().trim().replace('/', '')

      return {
        id: parseId(e.attribs.href),
        url: e.attribs.href,
        image: i('img').attr('data-src'),
        title: i('.th-subtitle').text().trim(),
        titleRu: i('.th-title').text().trim(),
        rating: Number(i('.th-rating').text().trim()),
        ongoing: current && {
          current,
          overall
        }
      }
    })

export default async (_: NowRequest, res: NowResponse) => {
  try {
    const $ = await fetchDocument('/')
    const sections = $('#dle-content .sect')

    const popular = $('.popular a.th-in')
      .toArray()
      .map((e) => {
        const i = load(e)

        return {
          id: parseId(e.attribs.href),
          url: e.attribs.href,
          image: i('img').attr('data-src'),
          title: i('.th-title').text().trim(),
          year: i('span a').text()
        }
      })

    const recent = parseSection(sections.eq(0))
    const filmsAndOva = parseSection(sections.eq(1))
    const trailers = sections
      .eq(2)
      .find('.sect-content .ftrailer-btn')
      .toArray()
      .map((e) => {
        const i = load(e)

        return {
          id: parseId(e.attribs.link),
          url: e.attribs.link,
          title: e.attribs.title.trim(),
          image: i('img').attr('data-src')
        }
      })

    const upcoming = sections
      .eq(3)
      .find('.upd-item a')
      .toArray()
      .map((e) => {
        const i = load(e)

        return {
          id: parseId(e.attribs.href),
          url: e.attribs.href,
          image: i('img').attr('data-src'),
          title: i('.upd-meta').text().trim(),
          titleRu: i('.upd-title').text().trim(),
          date: i('.upd-date').text().trim()
        }
      })

    const doramas = parseSection(sections.eq(4))
    const news = sections
      .eq(5)
      .find('a.collection-in')
      .toArray()
      .map((e) => {
        const i = load(e)

        return {
          id: parseId(e.attribs.href),
          url: e.attribs.href,
          image: i('img').attr('data-src'),
          title: i('.th-title').text().trim()
        }
      })

    sendResponse(res, 200, 'OK', {
      popular,
      recent,
      filmsAndOva,
      trailers,
      upcoming,
      doramas,
      news
    })
  } catch (e) {
    console.error("i can't parse main page:", e)
    sendResponse(res, 500, 'Internal Server Error')
  }
}
