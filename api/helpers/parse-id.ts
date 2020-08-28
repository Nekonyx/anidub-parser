export default (url: string) => Number(url.match(/\/[0-9]{1,6}/)[0].replace(/\D/g, ''))
