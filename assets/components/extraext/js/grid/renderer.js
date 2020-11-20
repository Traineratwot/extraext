extraExt.classes.grid.renderers = class extends extraExt.classes.util.renderers {
	entityMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#39;',
		'/': '&#x2F;',
		'`': '&#x60;',
		'=': '&#x3D;'
	}
	eventData = {}


	popUp(e) {
		var data = extraExt.grid.renderers.eventData[e.dataset.eventdata]
		var value = data.meta.rawValue

		value = this.bodyPrepare(data.meta.type, value, data.config.preRenderer, [data.th, data.rawValue, data.cell, data.row, data.x, data.y, data.table])

		e.setAttribute('data-active', true)
		this.Window(data.th.header, value, this.popUpCallback, {
			elem: e,
			config: data,
		})
	}


	popUpCallback(e) {
		this.elem.setAttribute('data-active', false)
	}


	jsonBeautify(val) {
		try {
			var jsObj = JSON.parse(val)
			return JSON.stringify(jsObj, null, '\t')
		} catch(e) {
			return val
		}

	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 * @param meta {object}
	 */
	default(val, cell, row, y, x, table, meta = {}) {
		var config = this.extraExtRenderer || {}
		config = Object.assign({
			height: window.innerHeight / 100 * 80,
			width: window.innerWidth,
			cellMaxHeight: 30,
			popup: false,
			preRenderer: (val, cell, row, y, x, table) => {
				return extraExt.empty(val) ? '<span class="false">' + _('ext_emptygroup') + '<span>' : val
			},
		}, config)
		meta = Object.assign({
			type: 'default',
			rawValue: val
		}, meta)
		if(meta.type === 'default') {
			var rawValue = val
		} else {
			var rawValue = meta.rawValue
		}
		var out = val
		if(config.preRenderer) {
			out = config.preRenderer.call(this, val, cell, row, y, x, table)
		}
		if(config.popup == true && val) {
			var id = Math.random().toString(36).slice(5)
			extraExt.grid.renderers.eventData[id] = {
				th: this,
				val: val,
				rawValue: rawValue,
				config: config,
				cell: cell,
				row: row,
				y: y,
				x: x,
				table: table,
				meta: meta,
			}
			out = `<div class="extraExt_renderers">
				<span class="extraExt_renderers_open" data-eventdata="${id}" onclick="extraExt.grid.renderers.popUp(this)">
					<svg class="extraExt_popup" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Popup" x="0px" y="0px" viewBox="0 0 20 20" xml:space="preserve">
						<path d="M16 2H7.979C6.88 2 6 2.88 6 3.98V12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 10H8V4h8v8zM4 10H2v6c0 1.1.9 2 2 2h6v-2H4v-6z"/>
					</svg>
				</span>
				<div class="extraExt_renderers_body" style="overflow: auto; max-height:${config.cellMaxHeight}px ;max-width: ${this.width}px">
					${out}
				</div>
			</div>`
		} else {
			out = `<div class="extraExt_renderers">
				<div class="extraExt_renderers_body">
					${out}
				</div>
			</div>`
		}
		return out
	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 */
	HTML(val, cell, row, y, x, table) {
		var rawValue = val
		if(val) {
			var out = null
			try {
				out = hljs.highlight('xml', val).value
			} catch(e) {
				out = val
			}
		}
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'HTML',
			rawValue: rawValue
		})
	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 */
	PHP(val, cell, row, y, x, table) {
		var rawValue = val
		if(val) {
			var out = null
			try {
				out = hljs.highlight('php', val).value
			} catch(e) {
				out = val
			}
		}
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'PHP',
			rawValue: rawValue
		})
	}


	MD(val, cell, row, y, x, table) {
		var rawValue = val
		if(val) {
			var out = null
			try {
				var id = Ext.id()
				out = `<div id="${id}">`
				out += extraExt.mdConverter.makeHtml(val)
				out += `</div>`
				setTimeout(function(id) {
					document.querySelectorAll(`#${id} pre code`).forEach((block) => {
						hljs.highlightBlock(block)
					})
				}, 500, id)
			} catch(e) {
				out = val
			}
		}
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'MD',
			rawValue: rawValue
		})
	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 */
	JS(val, cell, row, y, x, table) {
		var rawValue = val
		if(val) {
			var out = null
			try {
				out = hljs.highlight('javascript', val).value
			} catch(e) {
				out = val
			}
		}
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'JS',
			rawValue: rawValue
		})
	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 */
	SQL(val, cell, row, y, x, table) {
		var rawValue = val
		if(val) {
			var out = null
			try {
				out = hljs.highlight('sql', val).value
			} catch(e) {
				out = val
			}
		}
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'SQL',
			rawValue: rawValue
		})
	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 */
	CSS(val, cell, row, y, x, table) {
		var rawValue = val
		if(val) {
			var out = null
			try {
				out = hljs.highlight('css', val).value
			} catch(e) {
				out = val
			}
		}
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'CSS',
			rawValue: rawValue
		})
	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 */
	PYTHON(val, cell, row, y, x, table) {
		var rawValue = val
		if(val) {
			var out = null
			try {
				out = hljs.highlight('python', val).value
			} catch(e) {
				out = val
			}
		}
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'PYTHON',
			rawValue: rawValue
		})
	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 */
	JSON(val, cell, row, y, x, table) {
		var rawValue = val
		if(val) {
			var out = null
			try {
				out = hljs.highlight('json', val).value
			} catch(e) {
				out = `<pre><code class="language-json">${val}</code></pre>`
			}
		}
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'JSON',
			rawValue: rawValue
		})
	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 */
	BOOL(val, cell, row, y, x, table) {
		var rawValue = val
		var out = val
		if(val === null) {
			return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {type: 'BOOL'})
		}
		if(val === false || val === 'false' || val === 0 || val === '0') {
			out = `<span class="false">${_('no')}</span>`
		} else if(val === true || val === 'true' || val === 1 || val === '1') {
			out = `<span class="true">${_('yes')}</span>`
		}
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'BOOL',
			rawValue: rawValue
		})
	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 */
	CHECKBOX(val, cell, row, y, x, table) {
		var rawValue = val
		var out = val
		var id = Ext.id()
		if(val === null) {
			return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {type: 'BOOL'})
		}
		if(val === false || val === 'false' || val === 0 || val === '0') {
			out = `<div class="x-form-check-wrap" style="width: 100%; height: 18px;"><input type="checkbox" disabled autocomplete="off" id="${id}" name="" class=" x-form-checkbox x-form-field"><label for="${id}" class="x-form-cb-label">&nbsp;</label></div>`
		} else if(val === true || val === 'true' || val === 1 || val === '1') {
			out = `<div class="x-form-check-wrap" style="width: 100%; height: 18px;"><input type="checkbox" disabled autocomplete="off" id="${id}" name="" class=" x-form-checkbox x-form-field" checked="true"><label for="${id}" class="x-form-cb-label">&nbsp;</label></div>`
		}
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'CHECKBOX',
			rawValue: rawValue
		})
	}


	/**
	 * @author Traineratwot
	 * @param val {string}
	 * @param cell {object}
	 * @param row {object}
	 * @param y {int}
	 * @param x {int}
	 * @param table {object}
	 */
	RADIO(val, cell, row, y, x, table) {
		// console.debug(table)
		// console.debug(this)
		var values = []
		for(const itemsKey in table.data.items) {
			if(table?.data?.items.hasOwnProperty(itemsKey)) {
				if(table?.data?.items[itemsKey]?.data.hasOwnProperty(this.dataIndex)) {
					values.push(table?.data?.items[itemsKey]?.data[this.dataIndex])
				}
			}
		}
		var rawValue = val
		var out = val
		if(val === null) {
			return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {type: 'BOOL'})
		}
		out = `<div class="x-form-check-wrap" style="width: 100%; height: 18px;">`
		values = extraExt.uniqueArray(values)
		values.forEach((e) => {
			var id = Ext.id()
			if(val != e) {
				out += `<input type="radio" autocomplete="off" disabled id="${id}" name="" class=" x-form-radio x-form-field">
					<label for="${id}" class="x-form-cb-label">${e}&nbsp;</label>
					<br>`
			} else {
				out += `<input type="radio" autocomplete="off" disabled id="${id}" name="" class=" x-form-radio x-form-field" checked="true">
					<label for="${id}" class="x-form-cb-label">${e}&nbsp;</label>
					<br>`
			}
		})
		out += `</div>`
		return extraExt.grid.renderers.default.call(this, out || val, cell, row, y, x, table, {
			type: 'RADIO',
			rawValue: rawValue
		})
	}
}
/**
 * @author Traineratwot
 * @see default
 * @see HTML
 * @see PHP
 * @see JS
 * @see SQL
 * @see CSS
 * @see PYTHON
 * @see JSON
 * @see BOOL
 * @see CHECKBOX
 * @see RADIO
 */
extraExt.grid.renderers = new extraExt.classes.grid.renderers()

//# sourceMappingURL=renderer.js.map

//# sourceMappingURL=renderer.js.map
