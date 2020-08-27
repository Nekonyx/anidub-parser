import { load } from 'cheerio'
import fetch from 'node-fetch'

export default async (path: string) => {
  const response = await fetch(`https://online.anidub.com${path}`)
  const content = await response.text()

  return load(content)
}
