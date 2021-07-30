export function addZero(data){
  return data < 10 ? "0" + data : data
}
export default function formatTime(timestamp, type = 'autoFullYear') {
  let time = new Date(timestamp)
  switch(type){
    case 'autoFullYear':
      return `${time.getFullYear() == new Date().getFullYear() ? '' : (time.getFullYear() + '.')}${addZero(time.getMonth() + 1)}.${addZero(time.getDate())} ${addZero(time.getHours())}:${addZero(time.getMinutes())}`
    case 'fullDateTime':
      return `${time.getFullYear()}.${addZero(time.getMonth() + 1)}.${addZero(time.getDate())} ${addZero(time.getHours())}:${addZero(time.getMinutes())}`
    case 'ignoreTime':
      return `${time.getFullYear()}.${addZero(time.getMonth() + 1)}.${addZero(time.getDate())}`
  }
};