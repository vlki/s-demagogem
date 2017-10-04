import padStart from 'lodash/padStart'

export const formatTime = seconds => {
  const wholes = Math.floor(seconds)
  const h = Math.floor(wholes / 3600)
  const m = Math.floor((wholes % 3600) / 60)
  const s = wholes % 60

  let time = m + ':' + padStart(s + '', 2, '0')

  if (h > 0) {
    time = h + ':' + padStart(time, 5, '0')
  }

  return time
}

export const parseTime = time => {
  if (typeof time === 'number') {
    return time
  }

  const parts = time.split(':')

  let seconds = 0
  if (parts.length > 0) {
    // Float, because seconds can be '1.3'
    seconds += parseFloat(parts.pop(), 10)
  }
  if (parts.length > 0) {
    seconds += parseInt(parts.pop(), 10) * 60
  }
  if (parts.length > 0) {
    seconds += parseInt(parts.pop(), 10) * 3600
  }

  return seconds
}

export const convertNewlinesToBr = text =>
  text.replace(/(?:\r\n|\r|\n)/g, '<br />')
