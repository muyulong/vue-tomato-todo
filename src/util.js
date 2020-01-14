export default {
  dateFormatter (date, format) {
    // 时间格式化辅助函数 date:毫秒数 format:'yyyy-MM-dd hh:mm:ss'
    if (!date || date === '') {
      return ''
    }

    let cdate = date

    if (typeof cdate === 'string') {
      const mts = cdate.match(/(\/Date\((\d+)\)\/)/)
      if (mts && mts.length >= 3) {
        cdate = parseInt(mts[2])
      }
    }

    cdate = new Date(cdate)
    if (!cdate || cdate.toUTCString() === 'Invalid Date') {
      return ''
    }

    const map = {
      M: cdate.getMonth() + 1, // 月份
      d: cdate.getDate(), // 日
      h: cdate.getHours(), // 小时
      m: cdate.getMinutes(), // 分
      s: cdate.getSeconds(), // 秒
      q: Math.floor((cdate.getMonth() + 3) / 3), // 季度
      S: cdate.getMilliseconds() // 毫秒
    }

    const formatTime = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      let v = map[t]
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v
          v = v.substr(v.length - 2)
        }
        return v
      }
      if (t === 'y') {
        return (cdate.getFullYear() + '').substr(4 - all.length)
      }
      return all
    })

    return formatTime
  },
  formatTime: function (date, config) {
    if (!(date instanceof Date)) {
      return ''
    }
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let time = ''
    if (config.hide) {
      const { year, month, day } = config.hide
      if (year) {
        y = ''
      }
      if (month) {
        m = ''
      }
      if (day) {
        d = ''
      }
    }
    if (config.cut) {
      time = (y
        ? y + config.cut
        : '') + (m
        ? this.addZero(m, 10)
        : '') + (d
        ? config.cut
        : '') + (d
        ? this.addZero(d, 10)
        : '')
    }
    if (config.unit) {
      time = (y
        ? y + '年'
        : '') + (m
        ? this.addZero(m, 10) + '月'
        : '') + (d
        ? this.addZero(d, 10) + '日'
        : '')
    }
    return time
  },
  getTimeView (totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds - minutes * 60
    return `${this.addZero(minutes, 10)}:${this.addZero(seconds, 10)}`
  },
  addZero (num, limit) {
    return num < limit ? '0' + num : num
  },
  checkLess ({ value, max }) {
    return value - max <= 0
  },
  boolLeapYear (year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
  },
  boolBigMonth (month) {
    const bigMonths = [0, 2, 4, 6, 7, 9, 11]
    return bigMonths.includes(month)
  },
  getMonthDays (date) {
    const month = date.getMonth()
    const year = date.getFullYear()
    if (this.boolBigMonth(month)) {
      return 31
    } if (month === 1) {
      if (this.boolLeapYear(year)) {
        return 29
      }
      return 28
    }
    return 30
  },
  isEqualDate (cur, tag) {
    if (!cur.getTime || !tag.getTime) {
      return false
    }
    return cur.getTime() === tag.getTime()
  },
  isEqualDateFuzzy (cur, tag, ignore) {
    if (!cur.getTime || !tag.getTime) {
      return
    }
    const [curYear, curMonth, curDate] = [
      cur.getFullYear(),
      cur.getMonth(),
      cur.getDate()
    ]
    const [tagYear, tagMonth, tagDate] = [
      tag.getFullYear(),
      tag.getMonth(),
      tag.getDate()
    ]
    if (ignore === 'hour') {
      return this.isEqualDate(
        new Date(curYear, curMonth, curDate),
        new Date(tagYear, tagMonth, tagDate)
      )
    }

    if (ignore === 'date') {
      return this.isEqualDate(
        new Date(curYear, curMonth),
        new Date(tagYear, tagMonth)
      )
    }
    return this.isEqualDate(cur, tag)
  },
  getTimeDif (time1, time2, unit) {
    // let
  },
  assginLeafNode (target, source) {
    if (typeof source !== 'object' || typeof target !== 'object') {
      return
    }
    for (const [key, value] of Object.entries(source)) {
      if (typeof target[key] === 'undefined') {
        target[key] = Array.isArray(value) ? [] : {}
      }
      if (typeof value !== 'object' || _.isEmpty(value)) {
        target[key] = value
      } else {
        this.assginLeafNode(target[key], value)
      }
    }
  },
  getMaxDuplicateCount (array) {
    if (!array.length) {
      return 0
    }
    const sortedAry = array.sort((a, b) => {
      return a - b
    })
    let count = 1
    let curCount = 1
    for (let i = 1; i < sortedAry.length; i++) {
      if (sortedAry[i - 1] === sortedAry[i]) {
        curCount++
      } else {
        curCount = 1
        if (curCount > count) {
          count = curCount
        }
      }
    }
    return count
  }
}
