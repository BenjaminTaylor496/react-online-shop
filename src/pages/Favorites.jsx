import React from 'react';
import Card from '../components/Card';
import AppContext from '../context';
/**В данном проекте создал новый файл с названием "context", где экспортировал AppContext по дефолту(по умолчанию) 
 * Когда хочу импортировать какой-то элемент из всего кода, необходимо взять название того компонента, который вы хотите получить в '{}'
 А если мы скажем 'import AppContext from '../App', то он нам выдаст весь код который находится в 'App'
*/

function Favorites() {
	const { onFavorite, onAddToFavorite } = React.useContext(AppContext);
	/**Объект 'AppContext' который хранится в 'context.js' используй его
	 Cохрани данные в файле 'App.js', где есть объект 'AppContext.Provide value={}' в переменную onFavorite, которую мы вытащили из 
	 */

	return (
		<div className='content p-40'>
			<div className='d-flex align-center mb-40 justify-between'>
				<h1>My favorites :</h1>
			</div>

			<div className='d-flex flex-wrap'>
				{onFavorite.map((item, index) => (
					<Card
						key={index}
						/**title={item.title}
						price={item.price}
						imageUrl={item.imageUrl}
						Вместо того, чтобы писать все выше перечисленное, можно сделать следующим образом:
						{...item} тут получается, что используя оператор spread мы передаем все свойства, которые хранятся в "item", будет передаваться в Card
						!!! Если нужно достать все свойства элемента, лучше использовать {...item}, 
						А если нужны конкретные данные, то лучше делать как показано выше!*/
						favorited={
							true
						} /** <== В данной строчке мы говорим, что  для Card передаем свойство favorited, который должен быть true */
						onFavorite={
							onAddToFavorite
						} /**<== Здесь получается, мы сделали кнопку для добавления товара в "Закладки"
						 А должны были сделать по сути так, чтобы при нажатии на знак "закладки" предмет удалялся оттуда
						 И чтобы этого избежать надо прописать логику для того, чтобы проверить есть ли тот или иной товар в закладках
						 Если нет, то "добавь туда товар", а если есть, то "удали оттуда товар".*/
						{...item}
					/>
				))}
			</div>
		</div>
	);
}

export default Favorites;
