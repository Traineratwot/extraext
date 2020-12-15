# Renderer
Это функции которые можно подставить в `Grid` в поле `renderer` внутри `columns`
```js
columns = [
	{
		dataIndex: 'id',
		header: 'id',
		sortable: true,
		extraExtRenderer: {
			popup: false,// отключает просмотр
		},
		renderer: extraExt.grid.renderers.default
	},
]
```
#### Описание 
демонстрация рендереров
![demo image](https://i.imgur.com/DEgTWnI.jpeg)



0) extraExt.grid.renderers.default 
0) extraExt.grid.renderers.JSON
0) extraExt.grid.renderers.HTML
0) extraExt.grid.renderers.MD
0) extraExt.grid.renderers.BOOL
0) extraExt.grid.renderers.RADIO
0) extraExt.grid.renderers.HEX
0) extraExt.grid.renderers.IMAGE
0) extraExt.grid.renderers.CONTROL
0) кнопка для открытия `просмотра` этой ячейки

Демонстрация `просмотра`
![demo image](https://i.imgur.com/GKBN1eC.jpeg)
0) переключатель переноса строк
0) отформатированный и подсвеченный код
0) заголовок столбца