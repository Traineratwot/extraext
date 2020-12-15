extraExt.util.Exception = function(message, code) {
	this.message = message
	this.code = code
	this.getCode = () => {
		return this.code
	}
	this.getMessage = () => {
		return this.message
	}
}
extraExt.util.in_array = function($k, $a) {
	for(const $aKey in $a) {
		if($k == $a[$aKey]) {return true}
	}
	return false
}
extraExt.util.array_keys = function($a) {
	var arr = []
	for(const $aKey in $a) {
		arr.push($aKey)
	}
	return arr
}
extraExt.classes.util.renderers = class {
	/**
	 * @param {string} title
	 * @param {string} body
	 * @param {extraExt.classes.grid.renderers.popUpCallback} Callback
	 * @param {{elem: *}} data
	 */
	Window(config) {
		var _tmp = Ext.id()
		var wrap = extraExt.settings.get('extraExt.popup.wrap')
		config = Object.assign({
			scope: {
				meta: {
					type: '',
				}
			}
		}, config)
		var width = window.innerWidth / 100 * 50,
			height = window.innerHeight / 100 * 50

		config.msg =
			`<div class="extraExt extraExt_renderers_window" style="width: ${width}px;height: ${height}px;" data-wrap="${wrap ? 'true' : 'false'}" >
					<div class="tbar">
						<input id="${_tmp}" type="checkbox"${wrap ? 'checked' : ''}  onchange="document.querySelector('.extraExt_renderers_window').setAttribute('data-wrap',this.checked.toString());extraExt.settings.set('extraExt.popup.wrap',this.checked)">
						<label for="${_tmp}">${_('extraExt.enable')} ${_('extraExt.wrap')}</label>
					</div>
					<div class="content">
						<pre class="extraExt extraExt_renderers_window_body" data-type="${config.scope.meta.type}">${config.msg}</pre>
					</div>
					<div class="bbar">
						
					</div>
			</div>`
		var id = Ext.id()
		Ext.MessageBox.show(Ext.apply({
			id: id,
			title: '',
			msg: '',
			minWidth: width,
			resize: true,
			buttons: {'cancel': true},
			icon: ''
		}, config))
		return id
	}


	/**
	 * @param {string} type
	 * @param {*} value
	 * @param {function(*=, *, *, *, *, *): string|*} def
	 * @param {(*|string|Object|[*, *])[]} data
	 */
	bodyPrepare(type, value, def = false, data = []) {
		type = type.toUpperCase()
		switch( type ) {
			case 'JSON':
				value = this.jsonBeautify(value)
				try {
					value = hljs.highlight('json', value).value
					value = `<div class="extraExt hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="extraExt language-json hljs">${value}</code></pre>`
				}
				break
			case 'HTML':
				try {
					value = html_beautify(value)
					value = hljs.highlight('xml', value).value
					value = `<div class="extraExt hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="extraExt language-xml hljs">${value}</code></pre>`
				}
				break
			case 'PHP':
				try {
					value = hljs.highlight('php', value).value
					value = `<div class="extraExt hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="extraExt language-php hljs">${value}</code></pre>`
				}
				break
			case 'JS':
				try {
					value = js_beautify(value)
					value = hljs.highlight('js', value).value
					value = `<div class="extraExt hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="extraExt language-js hljs">${value}</code></pre>`
				}
				break
			case 'SQL':
				try {
					value = hljs.highlight('sql', value).value
					value = `<div class="extraExt hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="extraExt language-sql hljs">${value}</code></pre>`
				}
				break
			case 'CSS':
				try {
					value = css_beautify(value)
					value = hljs.highlight('css', value).value
					value = `<div class="extraExt hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="extraExt language-css hljs">${value}</code></pre>`
				}
				break
			case 'PYTHON':
				try {
					value = hljs.highlight('python', value).value
					value = `<div class="extraExt hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="extraExt language-python hljs">${value}</code></pre>`
				}
				break
			case 'MD':
				var id = Ext.id()
				var value_ = `<div id="${id}">`
				value_ += extraExt.mdConverter.makeHtml(value)
				value_ += `</div>`
				value = value_
				setTimeout(function(id) {
					document.querySelectorAll(`#${id} pre code`).forEach((block) => {
						hljs.highlightBlock(block)
					})
				}, 500, id)
				break
			case 'IMAGE':
				value = `<img style="max-width: 100%;max-height: 50vh;" src="${value}" alt="нет фото"/>`
				break
			case 'HREF':
			case 'LINK':
			case 'URL':
				value = `<iframe src="${value}"  class="extraExt extraExt-embed" frameborder="0" alt="" id="{id}" style="width: 100%; height: 98%;"></iframe>`
				break

			default:
				if(def) {
					value = def.call(...data)
				}
				break
		}
		return value
	}


	jsonBeautify(val) {
		try {
			if(typeof val == 'string') {
				var jsObj = JSON.parse(val)
			} else {
				var jsObj = val
			}
			return JSON.stringify(jsObj, null, '\t')
		} catch(e) {
			return val
		}

	}


	jsonMinify(val) {
		try {
			if(typeof val == 'string') {
				var jsObj = JSON.parse(val)
			} else {
				var jsObj = val
			}
			return JSON.stringify(jsObj, null)
		} catch(e) {
			return val
		}

	}


	openPopup(config) {
		config.msg = this.bodyPrepare(config.type || '', config.msg)
		return this.Window(config)
	}
}
extraExt.classes.util.icon = class {
	constructor(node = '') {
		if(node) {
			this.node = new DOMParser().parseFromString(node, 'text/html')
			this.cls = false
			if(this.node.body.innerHTML == this.node.body.innerText) {
				this.cls = this.node.body.innerText
			}
		}
	}


	render(attrs = []) {
		if(this.node) {
			if(this.cls) {
				this.node = new DOMParser().parseFromString(`<i class="extraExt extraExt-icon ${this.cls}"></i>`, 'text/html')
			}
			if(attrs.length > 0) {
				this.node.body.querySelectorAll('*').forEach(function(item) {
					for(const attrsKey in attrs) {
						if(attrs.hasOwnProperty(attrsKey)) {
							var attr = attrs[attrsKey]
							var name = ''
							var value = ''
							if(typeof attr == 'string') {
								attr = attr.split('=')
								name = attr[0]
								value = attr[1]
							} else if(attr instanceof Array) {
								name = attr[0]
								value = attr[1]
							} else if(attr instanceof Object) {
								name = attr['name']
								value = attr['value']
							} else {
								continue
							}
							if(name && value) {
								item.setAttribute(name, value)
							}
						}
					}
				})
			}
			return this.node.body.innerHTML || ''
		}
		return ''
	}


	raw() {
		if(this.node) {
			return this.node.innerHTML
		}
		return ''
	}

}
extraExt.classes.util.clipboard = class {
	timeLimit = 100
	mode = 'navigator'
	response = undefined
	permission = false


	constructor() {
		if(window.hasOwnProperty('navigator') && navigator.clipboard) {
			this.mode = 'navigator'
		} else if(document.queryCommandSupported) {
			this.mode = 'fallback'
		} else {
			this.mode = 'notSupport'
		}
	}


	__fallback_write(data = '') {
		var textArea = document.createElement('textarea')
		textArea.value = data

		// Avoid scrolling to bottom
		textArea.style.top = '0'
		textArea.style.left = '0'
		textArea.style.position = 'fixed'
		textArea.style.opacity = '1'

		document.body.appendChild(textArea)
		textArea.focus()
		textArea.select()

		try {
			var successful = document.execCommand('copy')
			this.response = successful ? true : false
		} catch(err) {
			this.response = false
		}

		document.body.removeChild(textArea)
	}


	__fallback_read() {
		var textArea = document.createElement('textarea')
		// Avoid scrolling to bottom
		textArea.style.top = '0'
		textArea.style.left = '0'
		textArea.style.position = 'fixed'
		textArea.style.opacity = '1'

		document.body.appendChild(textArea)
		textArea.focus()
		textArea.select()

		try {
			var successful = document.execCommand('paste')
			if(successful) {
				this.response = textArea.value
			} else {
				this.response = false
			}
		} catch(err) {
			this.response = false
		}

		document.body.removeChild(textArea)
	}


	__navigator_write(data = '') {
		this.response = undefined
		document.body.focus()
		navigator.clipboard.writeText(data).then((data) => {
			this.response = data
		}, (e) => {
			console.warn(e)
			this.response = false
		})

	}


	__navigator_read() {
		this.response = undefined
		document.body.focus()
		navigator.clipboard.readText().then((data) => {
			this.response = data
		}, (e) => {
			console.warn(e)
			this.response = false
		})
	}


	__notSupport_write(data = '') {
		return false
	}


	__notSupport_read() {
		return false
	}


	write(data = '') {
		if(!this.permission) {
			this.permissions()
		}
		try {
			if(this['__' + this.mode + '_write'] instanceof Function) {
				this['__' + this.mode + '_write'](data)
			}
			return this.response
		} catch(e) {
			return false
		}
	}


	read() {
		if(!this.permission) {
			this.permissions()
		}
		try {
			if(this['__' + this.mode + '_read'] instanceof Function) {
				this['__' + this.mode + '_read']()
			}
			return this.response
		} catch(e) {
			return false
		}
	}


	permissions() {
		try {
			navigator.permissions.query({name: 'clipboard-write'}).then(result => {
				if(result.state == 'granted' || result.state == 'prompt') {
					this.permission = true
				} else {
					this.permission = false
				}
			})
			navigator.permissions.query({name: 'clipboard-read'}).then(result => {
				if(result.state == 'granted' || result.state == 'prompt') {
					this.permission = true
				} else {
					this.permission = false
				}
			})
			return true
		} catch(e) {
			return false
		}
	}

}
extraExt.classes.util.ConverterUnits = class {
	static converterRule = {
		'byte': {
			'0': {'bit': [0.125, 'b']},
			'1': {'kb': [1024, 'b'], 'mb': [1024, 'kb'], 'gb': [1024, 'mb'], 'tb': [1024, 'gb']},
			'SI': [1, 'b']
		},
		'mass': {'0': {'g': [0.001, 'kg'], 'mg': [0.001, 'g']}, '1': {'T': [1000, 'kg']}, 'SI': [1, 'kg']},
		'length': {
			'0': {'mm': [0.001, 'm'], 'cm': [10, 'mm'], 'dm': [10, 'dm']},
			'1': {'km': [1000, 'm']},
			'SI': [1, 'm']
		},
		'time': {'0': {'ms': [0.001, 's']}, '1': {'min': [60, 's'], 'h': [60, 'min'], 'day': [24, 'h']}, 'SI': [1, 's']}
	}


	convert(n, type, from, to) {
		if(typeof n == 'undefined') n = 0
		if(typeof type == 'undefined') type = 'byte'
		if(typeof from == 'undefined') from = 'SI'
		if(typeof to == 'undefined') to = 'best'
		try {
			//validate input start
			var out = false
			var size = []
			var i = 1
			n = parseFloat(n)
			if(isNaN(n)) {
				throw new extraExt.util.Exception('invalid number', 0)
			}
			if(typeof extraExt.classes.util.ConverterUnits.converterRule[type] != 'undefined') {
				var converterRule = extraExt.classes.util.ConverterUnits.converterRule[type]
				var SI = converterRule['SI'][1]
			} else {
				throw new extraExt.util.Exception('invalid type', 0)
			}
			if(to != 'best' && to != 'SI') {
				if(!extraExt.util.in_array(to, extraExt.util.array_keys(converterRule[0])) && !extraExt.util.in_array(to, extraExt.util.array_keys(converterRule[1])) && to != SI) {
					to = 'best'
				}
			}
			//validate input end
			if(to == from && to != 'SI') {
				throw new extraExt.util.Exception('easy )', 1)
			}
			n = extraExt.classes.util.ConverterUnits.ToSi(n, type, from)
			if(isNaN(n)) {
				throw new extraExt.util.Exception('invalid "from" unit', 2)
			}
			if(to == 'SI' || to == SI) {
				throw new extraExt.util.Exception('easy )', 2)
			}
			if(to != 'best') {
				if(extraExt.util.in_array(to, extraExt.util.array_keys(converterRule[0]))) {
					var g
					g = 0
				} else if(extraExt.util.in_array(to, extraExt.util.array_keys(converterRule[1]))) {
					g = 1
				} else {
					throw new extraExt.util.Exception('invalid "to" unit', 2)
				}
			} else {
				var g
				if(n >= converterRule['SI'][0]) {
					g = 1
				} else {
					g = 0
				}
			}
			var key
			__loop1:
				for(key in converterRule[g]) {
					var rule
					rule = converterRule[g][key]
					if(n >= rule[0]) {
						n /= rule[0]
						size = [
							n.toFixed(i),
							key
						]
					} else {
						if(to == 'best') {
							break
						}
					}
					if(to != 'best' && to == key) {
						break
					}
					i++
				}
			if(!out && size instanceof Array && size.hasOwnProperty(0) && size.hasOwnProperty(1)) {
				out = size
			} else {
				out = [
					n,
					SI
				]
			}
		} catch(__e__) {
			var e
			if(__e__ instanceof extraExt.util.Exception) {
				e = __e__
				__loop1:
					switch( e.getCode() ) {
						case 1:
							return {
								0: n.toFixed(i),
								1: from
							}
						case 2:
							return {
								0: n.toFixed(i),
								1: SI
							}
						default:
							return e.getMessage()
					}
			} else {
				throw __e__
			}
		}
		return out
	}


	static ToSi(n, type, from) {
		if(typeof type == 'undefined') type = 'byte'
		if(typeof from == 'undefined') from = 'SI'
		if(typeof extraExt.classes.util.ConverterUnits.converterRule[type] != 'undefined') {
			var converterRule
			converterRule = extraExt.classes.util.ConverterUnits.converterRule[type]
			var SI
			SI = converterRule['SI'][1]
		} else {
			return false
		}
		if(from == 'SI' || from == SI) {
			return n
		}
		var g

		if(extraExt.util.in_array(from, extraExt.util.array_keys(converterRule[0]))) {
			g = 0
		} else if(extraExt.util.in_array(from, extraExt.util.array_keys(converterRule[1]))) {
			g = 1
		} else {
			return false
		}
		__loop1:
			while(from != SI && typeof converterRule[g][from] != 'undefined') {
				var f_
				f_ = converterRule[g][from]
				n *= f_[0]
				from = f_[1]
			}
		return n
	}

}
extraExt.util.renderer = new extraExt.classes.util.renderers
extraExt.util.clipboard = new extraExt.classes.util.clipboard()
extraExt.util.ConverterUnits = new extraExt.classes.util.ConverterUnits
extraExt.util.convert = extraExt.util.ConverterUnits.convert