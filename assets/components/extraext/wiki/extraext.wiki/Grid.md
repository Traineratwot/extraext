Особенности
 - встроенный поиск. включается установкой свойства `extraExtSearch`
 - встроенное окно редактирования. включается установкой свойства `extraExtUpdate`/`extraExtCreate`[подробнее](https://github.com/Traineratwot/extraext/wiki/editor)
 - запоминание скрытых пользователем столбцов 
 - может отправлять данные в процессор двумя способами `requestDataType`
 
requestDataType может принимать значения `json` и `form` по умолчанию `form`.
в режиме `form` данные отправляются так же как в обычной html форме.
в режиме `json` данные отправляются в параметре `data` в формате json

Пример:
```js
obj = {
	xtype: extraExt.grid.xtype,
	id: 'demo-table-1', // желательно устанавливать свой что бы работало запоминание скрытых столбцов
	name: 'demo - snippet',
	columns: [
		{
			dataIndex: 'id',
			header: 'id',
			sortable: true,
			extraExtEditor: {
				visible: false,// отключает видимость в редакторе
			},
			renderer: extraExt.grid.renderers.default
		},
		{
			dataIndex: 'name',
			header: 'name',
			sortable: true,
			editor: {xtype:'textfield'},
			extraExtEditor: {},
			renderer: extraExt.grid.renderers.default

		},
	],
	extraExtSearch: true,//Включает поиск
    searchKey:'query', // ключ для поиска
	extraExtUpdate: true,//Включает форму обновления
	extraExtCreate: true,//Включает кнопку создания
    extraEditor: extraExt.grid.editor.xtype,//xtype окна редактора
	extraExtDelete: true,//Включает удаление 
    requestDataType:'form',
	action: 'element/snippet/getlist', //стандартный action
	create_action: 'element/snippet/create', // путь к процессору создания нового элемента
	save_action: 'element/snippet/update', //стандартный save_action
	delete_action: 'element/snippet/remove', // путь к процессору удаления элемента
	nameField: 'name', //устанавливает столбец имени для сроки
	keyField: 'id',//устанавливает столбец id для сроки
	addMenu: function(m, grid, rowIndex) { //замена стандартного getMenu
		m.push({
			text: 'текст',
			grid: grid,
			rowIndex: rowIndex,
			handler: this.create
		})
		return m
	},
	autosave: true,
	sortBy: 'id',
	sortDir: 'desc',
	requestDataType: 'form',
	fields: ['id', 'name'],
	// url: MODx.config.connector_url, //по умолчанию
}
```