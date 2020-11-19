extraExt.classes.util = {}
extraExt.util = {}
extraExt.util.renderer = {}
extraExt.classes.util.renderers = class {
	/**
	 * @param {string} title
	 * @param {string} body
	 * @param {extraExt.classes.grid.renderers.popUpCallback} Callback
	 * @param {{elem: *}} data
	 */
	Window(title, body, Callback = () => {}, data) {
		data = Object.assign({
			config: {
				config: {}
			}
		}, data)
		var _tmp = Ext.id()
		var msg = `<div class="extraExt_renderers_window_body" data-wrap="true">
					<input id="${_tmp}" type="checkbox" checked onchange="document.querySelector('.extraExt_renderers_window_body').setAttribute('data-wrap',this.checked.toString())">
					<label for="${_tmp}">${_('extraExt.enable.disable')} ${_('extraExt.wrap')}</label>
					<pre>${body}</pre>
			</div>`
		Ext.MessageBox.show(Ext.apply({
			title: title,
			resize: true,
			msg: msg,
			buttons: {yes: true},
			fn: Callback,
			scope: data,
			icon: ''
		}, data.config.config))
	}


	bodyPrepare(type, value, def = false, data = []) {
		switch( type ) {
			case 'JSON':
				value = this.jsonBeautify(value)
				try {
					value = hljs.highlight('json', value).value
				} catch(e) {
					value = `<pre><code class="language-json">${value}</code></pre>`
				}
				break
			case 'HTML':
				try {
					value = html_beautify(value)
					value = hljs.highlight('xml', value).value
				} catch(e) {
					value = `<pre><code class="language-xml">${value}</code></pre>`
				}
				break
			case 'PHP':
				try {
					value = hljs.highlight('php', value).value
				} catch(e) {
					value = `<pre><code class="language-php">${value}</code></pre>`
				}
				break
			case 'JS':
				try {
					value = js_beautify(value)
					value = hljs.highlight('js', value).value
				} catch(e) {
					value = `<pre><code class="language-js">${value}</code></pre>`
				}
				break
			case 'SQL':
				try {
					value = hljs.highlight('sql', value).value
				} catch(e) {
					value = `<pre><code class="language-sql">${value}</code></pre>`
				}
				break
			case 'CSS':
				try {
					value = css_beautify(value)
					value = hljs.highlight('css', value).value
				} catch(e) {
					value = `<pre><code class="language-css">${value}</code></pre>`
				}
				break
			case 'PYTHON':
				try {
					value = hljs.highlight('python', value).value
				} catch(e) {
					value = `<pre><code class="language-python">${value}</code></pre>`
				}
				break
			default:
				if(def) {
					value = def.call(...data)
				}
				break
		}
		return value
	}


	openPopup(title, value, type = false) {
		value = this.bodyPrepare(type, value)
		this.Window(title, value)
	}
}
extraExt.util.renderer = new extraExt.classes.util.renderers
//# sourceMappingURL=util.js.map

//# sourceMappingURL=util.js.map
