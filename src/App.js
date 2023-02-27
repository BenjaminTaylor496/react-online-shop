import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Drawer from './components/Drawer';
import Header from './components/Header/Header';
import axios from 'axios';
import AppContext from './context';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';

/**Для создания react приложения необходимо написать в консоль:
 * npx create-react-app react-sneakers <= Где говорю, npx скачай программу create-react-app временно,
 * Когда скачаешь, запусти ее
 * Затем создай react проект в папке, которую я указал тебе.
 * И назови этот проект: "react-sneakers" */

//export без default == называется единичный экспорт, с помощью которого можно вытаскивать конкретные элементы кода
/**Благодаря функции "createContext()" cоздам объект, в которой будет выполняться сложная логика 'React-a' 
Он будет ре-рендерить те компоненты, которые мне нужны. Т.е оповещать каждый компонент, который мне нужен, что объект AppContext изменился
Если бы написали просто '{}', то React не понял бы, что он изменился. Контекст оповестит каждый компонент который зависит от него. 'Context' не будет обновлять всё приложение, а только то что зависит от 'AppContext'*/

/**Помимо npm есть еще yarn. Отличие в том, что 'yarn' быстрее устанавливает npm пакеты нежели 'npm install'
 * В любом проекте нужно выбрать 1 менеджер пакетов: Или npm, или yarn
 */

function App() {
	//Когда мы что-то меняем что-то из useState любой наш компонент(функция)
	// В котором есть useState если мы заставим useState обновиться наш компонент(функция) перевызывается
	const [items, setItems] = React.useState([]);
	const [searchValue, setSearchValue] = React.useState('');
	const [onFavorite, setOnFavorite] = React.useState([]);
	const [cartItems, setCartItems] = React.useState([]);
	const [cartOpened, setCartOpened] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);
	/**Если приложение впервые открылось 'isLoading' будет 'true'. Это значит, что приложение открылось и идет получение новых данных*/

	React.useEffect(() => {
		async function fetchData() {
			/**setIsLoading(true).Если функция fetchData будет выполняться больше чем 1 раз, лучше предварительно перед отправкой запросов написать "setIsLoading(true)"
			Если у нас есть состояние загрузки перед выполнением каких-либо запросов, лучше сделать 'setIsLoading(true)'
			В нащем случае у нас запрос идет 1 раз, поэтому можно обойтись и без написания 'setIsLoading(true)'*/

			try {
				const [cartResponse, favoriteResponse, itemsResponse] = await Promise.all([
					axios.get('https://63d2bc1b06556a0fdd436605.mockapi.io/cart'),
					axios.get('https://63d2bc1b06556a0fdd436605.mockapi.io/favorites'),
					axios.get('https://63d2bc1b06556a0fdd436605.mockapi.io/items'),
				]);
				/**Promise это промис который будет выполнять массив промисов. axios.get является промисом
				 * Promise.all будет выполнять каждый из представленных ему промисов и их результат выполнения, вернет в виде массива
				 * Т.е все ответы от axios будут помещены по порядку. И с помощью деструктуризации можно вытащить каждый ответ
				 * !!И если хотя бы 1 из промисов не выполнится, то выполнится catch и скажет нам, что возникла ошибка
				 * Иногда promise.all выполняет немного не то, что бывает нужно разработчику:
				 * Может оказаться так, что захочу чтобы запрос cart выполнился, а запрос items не выполнился, а cart и favorites выполнятся на 100%
				 * В promise.all то, что мы задумали выполнить не получится, потому что мы в promise.all ожидаем выполнения всех 3 промисов и если 1 из них не выполнится, то нам выдаст ошибку. Тут promise.all не очень подходит
				 *
				 */

				// const cartResponse = await axios.get(
				// 	//Здесь мы дожидаемся запроса от cart. !!!!!!!!!!! ПОРЯДОК МОЖЕТ БЫТЬ ЛЮБЫМ!! Разницы как таковой нет

				// 	'https://63d2bc1b06556a0fdd436605.mockapi.io/cart'
				// )

				// const favoriteResponse = await axios.get(
				// 	//Здесь мы дожидаемся запроса от favorites
				// 	'https://63d2bc1b06556a0fdd436605.mockapi.io/favorites'
				// )

				// const itemsResponse = await axios.get(
				// 	//Здесь мы дожидаемся запроса от items
				// 	'https://63d2bc1b06556a0fdd436605.mockapi.io/items'
				// )

				setIsLoading(false);
				/**И когда дождались полного завершения сделать setIsLoading(false)*/
				setCartItems(cartResponse.data); //<= Запрос о получении корзины
				setOnFavorite(favoriteResponse.data); //<= Запрос о получении элементов из "Закладок"
				setItems(itemsResponse.data); // <= Запрос о получении о всех данных, которые есть на сервере
			} catch (error) {
				alert('An error occurred while sending the request');
			}
		}
		fetchData(); // Ранее, создал функцию fetchData() и чтобы она(функция) работала, необходимо ее вызвать
		/** Все, что написано свыше необходимо для того, чтобы хук 'useEffect' корректно работал
		 * Внутри хука 'useEffect' можно сколько угодно создавать ассинхронные функции. Но самую главную функцию для 'useEffect' нельзя делать 'async'
		 */

		// В строках выше мы говорим 'Use Effect' что:
		/**Если  никакие переменные не изменились, то
		 * Когда впервый раз когда компонент App отобразится,
		 * только тогда вызови 'fetch'
		 * Если 'items' или 'cartOpened' изменятся, не вызывай 'fetch'
		 */
		// 	fetch('https://63d2bc1b06556a0fdd436605.mockapi.io/items')
		// 		/**fetch отправь запрос на бэкэнд. fetch возврщает промис. Из фэтч надо вытащить какие-то данные.
		// 		 * И мы пишем следующее:
		// 		.then--Верни мне ответ в JSON формате
		// 		.then--Вытащи его из переменной json и передай его в useState
		// 	*/
		// 		.then(res => {
		// 			return res.json()
		// 		})
		// 		.then(json => {
		// 			setItems(json)
		// 		})

		/**В React нельзя мутировать объект, массив или какие-то данные
		 * Рекомендуется, предыдущие данные, которые нам нужны получать не через
		 * первый аргумент массива, а сделать так:
		 * Наша функция может получать как массив, так и функцию*/
		//!!!!!!!! Разница между fetch и axios!!!!!!!!!!!!!!!!!!!!!!!!

		/**axios.get для получения
		 * axios.post для добавления какого-либо элемента в массив бэкнэнд
		 * axios.delete для удаления элемента из массива с бекэнда
		 */
	}, []);
	const onAddToCart = async obj => {
		/**try{} catch() - это контроль грамотного способа отлавливания ошибок */
		try {
			const findItem = cartItems.find(item => Number(item.parentId) === Number(obj.id)); // С помощью Number конвертировал item.id и obj.id в числа
			if (findItem) {
				/**Если в корзине нашелся хотя бы 1 объект у которого такой же id как у obj.id, то сделай следующее: */

				/**Cначала показывжи пользователю результат, а потом отправь запрос 
					Замени setCartItems(или же useState)  
					Отфильтруй  его на следующее условие:
					Если в одном моем setCartItems есть obj.id, который я нашел, то исключи его из массива setCartItems*/
				setCartItems(prev => prev.filter(nItem => Number(nItem.parentId) !== Number(obj.id)));
				await axios.delete(
					`https://63d2bc1b06556a0fdd436605.mockapi.io/cart/${findItem.id}`, // Здесь передаю объект, который нашел в корзине.
				);
			} else {
				/**Если не нашелся такой товар в корзине, тогда  */
				setCartItems(prev => [...prev, obj]); //Тут задается id не дожидаясь ответа от "бека"
				const { data } = await axios.post(
					'https://63d2bc1b06556a0fdd436605.mockapi.io/cart',
					obj,
				); /**Создай этот товар на бекэнде */

				/** Бекэнд(далее "бэк") дай ответ потом снова возьми, переообнови мне массив;
				 * Если parentId из массива равен тому parentId который пришел из "бек"а{
				 * То тогда замени конкретный item по нашему условию, возьми все его старые данные
				 * И замени его id на тот id который пришел с "бека"}
				 * Если условие не выполнится, тогда верни мне тот item который получил во время итерации
				 *
				 */
				setCartItems(prev =>
					prev.map(item => {
						if (item.parentId === data.parentId) {
							return {
								...item,
								id: data.id,
							};
						}
						return item;
					}),
				);
				/**Тут возникает проблема. В стэйт передается не id корзины, а передается id товара.
				 * Получается, необходимо дождаться пока запрос выполниться и передать данные с бекэнда в state
				 * Необходимо сделать так, чтобы брать id который есть в корзине, а не тот, который передается на главной странице*/
			}
		} catch (error) {
			alert('Error adding item to cart');
			console.error(error); //Написал comsole.error для того, чтобы в будущем когда возникнет ошибка, можно было зайти в консоль и узнать причину
		}
	};

	const onRemoveItem = async id => {
		try {
			setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(id)));
			await axios.delete(`https://63d2bc1b06556a0fdd436605.mockapi.io/cart/${id}`);
		} catch (error) {
			alert('Error deleting an item to cart');
			console.error(error);
		}
	};

	const onAddToFavorite = async obj => {
		// В основной функции написал, что данная функция ассинхронная
		try {
			if (onFavorite.find(newObj => Number(newObj.id) === Number(obj.id))) {
				/**Здесь мы говорим: найди мне хотя бы 1 объект, по условию: (obj.id === obj.id)
				 * Т.е "Если в закладках есть хотя бы 1 объект с id:1, которое есть в obj, то тогда удаляй"
				 */
				axios.delete(
					`https://63d2bc1b06556a0fdd436605.mockapi.io/favorites/${obj.id}`,
					obj,
					/**Как найдется, отправь запрос "delete" и передай туда id который есть в "obj.id"*/
				);
				setOnFavorite(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
				/**Потом из 'useState' с помощью фильтрации  удали этот id.
				 * Т.е измени setOnFavorite, возьми предыдущее значение,
				 * Пробежись по нему отфильтруй все id которые не равны тому id, который передал при нажатии на кнопку 'onAddToFavorite'*/
			} else {
				/**Если окажется, что массив пуст, тогда отправь запрос на создание
				 * И в state,в данном случае это у нас 'sestOnFavorite' сохрани этот объект*/
				const { data } = await axios.post(
					'https://63d2bc1b06556a0fdd436605.mockapi.io/favorites',
					obj,
				);
				/**На строке свыше: вытaщи из объекта axios ответ от сервера, который хранится в cвойстве data
				 * Благодаря 'await' ожидается ответ от сервера и данные перемещяются в переменную которую задали.
				 * Почему сделал деструктуризацию объекта?
				 * Допустим, что мы не сделали деструктуризацию. И назвали переменную 'resp' и поместили её в setOnFavorite.
				 * Если так сделать, то setOnFavorite передаст все, что есть в 'axios'
				 * Отныне не будется браться объект 'id' который есть в Home, а будет браться именно из бекэнда
				 *
				 * await - то же самое, что и then, просто не пишем then
				 */
				setOnFavorite(prev => [...prev, data]);
			}
		} catch (error) {
			alert('Не удалось добавить предмет в избранное (');
			console.error(error);
			/**try{} catch() используется для того, чтобы, отловить ошибку когда используется async/ await
			 * Если использовать async/await без try{} catch(){} не возможно будет узнать когда произойдет ошибка.
			 * Потому что await возвращает в консоль не отлавливаемую ошибку
			 * А так, мы говорим. Попробуй(try) выполнить весь код, который я написал и если что-то в данном коде сломается, в том числе если await не выполнит свой запрос
			 * Отлови(catch) ошибку и предупреди меня об этом
			 */
		}
	};

	/**Почему нельзя взять cartItems и сделать как ниже?
	 * Потому что есть вероятность того, что мы можем в cartItems, получить старые данные
	 */

	//setCartItems([...cartItems, obj])
	//С помощью spread(...) мы создаем новый массив, в котором есть старые данные
	//setCartItems берет все данные что есть в cartItems
	//И в конец добавляет новый объект

	const onChangeSearchInput = event => {
		setSearchValue(event.target.value);
	};

	const isItemAdded = id => {
		return cartItems.some(obj => Number(obj.parentId) === Number(id));
	}; /**Пробежиcь по массиву корзины, бери из каждого объекта корзины parentId и сравни его с тем id который есть в карточке*/

	return (
		<AppContext.Provider
			value={{
				items,
				cartItems,
				onFavorite,
				onAddToCart,
				isItemAdded,
				onAddToFavorite,
				setCartOpened,
				setCartItems,
			}}>
			{/** С помощью value говорю, что у этого провайдера есть какие-то данные которые будут доступны всему приложению.
			 * Теперь items, cartItems и onFavorite будут доступны во всем приложении, что мы написали внизу
			 * Здесь говорю компоненту объекта 'AppContext' все мое приложение должно знать об этом контексте
		 Контекст можно использовать в любом месте, где угодно. На данный момент я оборачиваю все мое приложение 'AppContext.provider'
		*/}
			<div className='wrapp clear'>
				<Drawer
					items={cartItems}
					onClose={() => setCartOpened(false)}
					onRemove={onRemoveItem}
					opened={cartOpened}
				/>
				<Header onClickCart={() => setCartOpened(true)} />

				<Routes>
					<Route
						path='/'
						element={
							<Home
								items={items}
								cartItems={cartItems}
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								onChangeSearchInput={onChangeSearchInput}
								onAddToCart={onAddToCart}
								onAddToFavorite={onAddToFavorite}
								isLoading={isLoading}
							/>
						}
					/>
					<Route
						/**Здесь данный Route  будет рендерится только в том случае если путь  '/favorites'
						 * И будет рендерится весь код из модуля favorites
						 * Можно как и где угодно рендерить Route.
						 * !!!ВАЖНО!!!
						 * В версии react-router V6 можно рендерить Route только внутри <Routes></Routes>*/
						path='/favorites'
						element={<Favorites onFavorite={onAddToFavorite} />}
					/>

					<Route path='/orders' element={<Orders />} />
				</Routes>
			</div>
		</AppContext.Provider>
	);
}

export default App;

/** Объяснение про useContext #6 урок 'react sneackers' 1:51:00 */
