/**
 *  以下为 uni-stat 的工具方法
 */

// 获取指定日期当天或 n 天前零点的时间戳，丢弃时分秒
function getTimeOfSomeDayAgo(days = 0, date = Date.now()) {
	const d = new Date(date)
	const oneDayTime = 24 * 60 * 60 * 1000
	let ymd = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
	ymd = ymd + ' 00:00:00'
	const someDaysAgoTime = new Date(ymd).getTime() - oneDayTime * days
	return someDaysAgoTime
}

// 将查询条件拼接为字符串
function stringifyQuery(query, customQuery) {
	const queryArr = []
	if (customQuery && typeof customQuery === 'string') {
		queryArr.push(customQuery)
	}
	const keys = Object.keys(query)
	keys.forEach(key => {
		if (key === 'time_range') return
		let val = query[key]
		if (val) {
			if (typeof val === 'string') {
				val = `"${val}"`
			}
			if (key === 'start_time') {
				const time = query.start_time
				if (Array.isArray(time) && time.length === 2) {
					queryArr.push(`start_time >= ${time[0]} && start_time <= ${time[1]}`)
				} else {
					queryArr.push(`start_time == ${time}`)
				}
			} else {
				queryArr.push(`${key} == ${val}`)
			}
		}
	})
	const queryStr = queryArr.join(' && ')

	return queryStr || {}
}


function division(dividend, divisor) {
	if (divisor) {
		return dividend / divisor
	} else {
		return 0
	}
}

function format(num, type=',') {
	if (!type) return num
	if (typeof num !== 'number') return num
	if (type === '%') {
		// 注意浮点数精度
		num = Number.parseFloat(num).toPrecision(4)
		return num * 100 + type
	} else if (type === ':') {
		num = Math.ceil(num)
		let h, m, s
		h = m = s = 0
		const wunH = 60 * 60,
			wunM = 60 // 单位秒, wun 通 one
		if (num >= wunH) {
			h = Math.floor(num / wunH)
			const remainder = num % wunH
			if (remainder >= wunM) {
				m = Math.floor(remainder / wunM)
				s = remainder % wunM
			} else {
				s = remainder
			}
		} else if (wunH >= num && num >= wunM) {
			m = Math.floor(num / wunM)
			s = num % wunM
		} else {
			s = num
		}
		const hms = [h, m, s].map(i => i < 10 ? '0' + i : i)
		return hms.join(type)
	} else if (type === ',') {
		return num.toLocaleString()
	} else {
		return num
	}
}

function mapfields(map, data, goal, prefix = '', prop = 'value') {
	const goals = [], argsGoal = goal
	map = JSON.parse(JSON.stringify(map))
	for (const mapper of map) {
		let {
			field,
			computed,
			formatter
		} = mapper
		// if (!field) return // stat index
		goal = argsGoal || mapper
		const hasValue = goal.hasOwnProperty(prop)
		const preField = prefix + field
		if (data) {
			if (data[preField]) {
				const val = format(data[preField], formatter)
				if (hasValue) {
					if (goal.field === field) {
						goal[prop] = val
					}
				} else {
					goal[field] = val
				}
			} else {
				if (computed) {
					const computedFields = computed.split('/')
					let [dividend, divisor] = computedFields
					dividend = Number(data[prefix + dividend])
					divisor = Number(data[prefix + divisor])
					if (dividend && divisor) {
						const val = format(division(dividend, divisor), formatter)
						// const val = division(dividend, divisor)
						if (hasValue) {
							goal[prop] = val
						} else {
							goal[field] = val
						}
					}
				}
			}
		}
		if (hasValue) {
			goals.push(goal)
		}
	}
	return goals
}


export {
	mapfields,
	stringifyQuery,
	getTimeOfSomeDayAgo,
	division,
	format
}
