import React from 'react';
import Card from '../components/Card';
import axios from 'axios';

function Orders() {
	const [orders, setOrders] = React.useState([]);

	/**ВАЖНО! Здесь используется собственный state 'isLoading', а не используется isLoading из App.js, потому что загрузка Orders идет в отдельной странице */
	const [isLoading, setIsLoading] = React.useState(true);

	/**Причина по которой здесь написал useState для заказов, а не в App.js связана с тем, что страница заказов не связана ни с каким из "state"-ов которыe находятся в App.js
	 * Как те не зависят от 'orders'-a, так и orders не зависит от них
	 * Внутри страницы Orders использую локальный state, a не глобальный из useContext. Так как не имеет смысла их запрашивать у App.js заказы, поскольку сайт будет рендерить это только на 1 странице
	 */

	React.useEffect(() => {
		/**Объяснение функции что написана внизу
		 * Создал анонимную функцию; Поместил ее в скобки; Говрю js "Вызови сразу же эту функцию";
		 * С помощью async говорю, что она не просто функция, а ассинхронная функция
		 * И не нужно создавать именованную функцию и потом ее вызывать. Просто говорю:"Создайся, вызовись и остановись(умри)"
		 */
		(async () => {
			try {
				/**!!!КОГДА ВЫЗЫВАЕМ ЧТО-ТО С ПОМОЩЬЮ async/await НЕОБХОДИМО ОБОРАЧИВАТЬ ЭТО ВСЕ В try/catch, ЧТОБЫ В СЛУЧАЕ ЕСЛИ БУДЕТ ОШИБКА ОНА ПОКАЗЫВАЛАСЬ */
				const { data } = await axios.get('https://63d2bc1b06556a0fdd436605.mockapi.io/orders');
				/**Как массив массивов превратить в один. 2 способа:
				 * 1 способ. data возьми эти объекты, вытащи из них items и верни их в сеть массивов и выровни эти массивы в 1. Благодаря ".flat" мы сделали из множества массивов один!*/
				// console.log(data.map(obj => obj.items).flat())

				/**2 способ. Все что есть в пустом массиве, возьми предыдущее значение и добавь то, что есть в obj.items*/
				setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
				/**Самовызывающая функция, можно использовать как этот способ или как тот что в App.js для async/await
				 *Можно использовать любую из этих 2 функций, которая покажется лучше
				 */
				setIsLoading(false);
			} catch (error) {
				alert('Failed to send request to courier service. Try again. ');
				console.error(error);
				/**Хочешь стать хорошим программистом?  Тогда отлавливай ошибки с помощью try/catch и прописывай сценарий когда ошибка произошла. Это очень ВАЖНО!*/
			}
		})();
	}, []);

	return (
		<div className='content p-40'>
			<div className='d-flex align-center mb-40 justify-between'>
				<h1>My orders :</h1>
			</div>

			<div className='d-flex flex-wrap'>
				{/**!!!! ОБРАЩАЙ ВНИМАНИЕ НА СКОБКИ!! БЕЗ НИХ НЕ ПОКАЗЫВАЛО ПУСТЫЕ КАРТОЧКИ! БУДЬ ВНИМАТЕЛЕН! */}
				{(isLoading ? [...Array(8)] : orders).map((item, index) => (
					<Card key={index} loading={isLoading} {...item} />
				))}
			</div>
		</div>
	);
}

export default Orders;
