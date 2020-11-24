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
		config.msg = `<div class="extraExt_renderers_window" data-wrap="${wrap ? 'true' : 'false'}" >
					<input id="${_tmp}" type="checkbox"${wrap ? 'checked' : ''}  onchange="document.querySelector('.extraExt_renderers_window').setAttribute('data-wrap',this.checked.toString());extraExt.settings.set('extraExt.popup.wrap',this.checked)">
					<label for="${_tmp}">${_('extraExt.enable.disable')} ${_('extraExt.wrap')}</label>
					<pre class="extraExt_renderers_window_body" >${config.msg}</pre>
			</div>`
		Ext.MessageBox.show(Ext.apply({
			title: '',
			msg: '',
			resize: true,
			width: window.innerWidth / 100 * 50,
			height: window.innerHeight / 100 * 50,
			buttons: {'yes': true},
			icon: ''
		}, config))
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
					value = `<div class="hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="language-json hljs">${value}</code></pre>`
				}
				break
			case 'HTML':
				try {
					value = html_beautify(value)
					value = hljs.highlight('xml', value).value
					value = `<div class="hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="language-xml hljs">${value}</code></pre>`
				}
				break
			case 'PHP':
				try {
					value = hljs.highlight('php', value).value
					value = `<div class="hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="language-php hljs">${value}</code></pre>`
				}
				break
			case 'JS':
				try {
					value = js_beautify(value)
					value = hljs.highlight('js', value).value
					value = `<div class="hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="language-js hljs">${value}</code></pre>`
				}
				break
			case 'SQL':
				try {
					value = hljs.highlight('sql', value).value
					value = `<div class="hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="language-sql hljs">${value}</code></pre>`
				}
				break
			case 'CSS':
				try {
					value = css_beautify(value)
					value = hljs.highlight('css', value).value
					value = `<div class="hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="language-css hljs">${value}</code></pre>`
				}
				break
			case 'PYTHON':
				try {
					value = hljs.highlight('python', value).value
					value = `<div class="hljs">${value}</div>`
				} catch(e) {
					value = `<pre><code class="language-python hljs">${value}</code></pre>`
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

			default:
				if(def) {
					value = def.call(...data)
				}
				break
		}
		return value
	}


	openPopup(config) {
		config.msg = this.bodyPrepare(config.type || '', config.msg)
		this.Window(config)
	}
}
extraExt.util.renderer = new extraExt.classes.util.renderers



