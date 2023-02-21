import React from 'react';
import axios from 'axios';

import Info from '../../Info';
import { useCart } from '../../hooks/useCart';

import styles from './Drawer.module.scss';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function Drawer({ onClose, onRemove, items = [], opened }) {
	const { cartItems, setCartItems, totalPrice } =
		useCart(); /**Теперь наша функция - обычная функция без рекатовской логики, которую мы импортировали из нашего useCart */
	const [orderId, setOrderId] = React.useState(null);
	const [isOrderCompleted, setIsOrderCompleted] = React.useState(false);
	/**По умолчанию isOrderCompleted - false, т.е закрыт */
	const [isLoading, setIsLoading] = React.useState(false);
	console.log(opened);

	const onClickOrder = async () => {
		/**Данная функция создана для того, чтобы при нажатии на кнопку состояние setIsOrderCompleted изменилось с false на true
		 * И я могу вызвать ее где угодно в тегах <button> и в пределах данного файла
		 */
		try {
			setIsLoading(true); /**Перед отправкой запроса, сделай setIsLoading true */
			const { data } = await axios.post(
				'https://63d2bc1b06556a0fdd436605.mockapi.io/orders',
				{ items: cartItems }, //Передаю в бекэнд объект в котором содержится items и массив с продуктами, тем временем mockAPI у себя прикрепит id
			);
			/** С помощью axios.post говорю создать заказ,
			 * И в useState, который находится на 32 строке очисти корзину*/
			setOrderId(data.id);
			/**Здесь передается весь массив cartItems на сервер mockAPI.
			 * И после того как передал объект, параллельно этому делаю, что заказ сформирован
			 * И очищаю массив корзины. Если коротко, то сначала отправляю, а потом очищаю*/
			setIsOrderCompleted(true);
			setCartItems([]);

			for (let i = 0; i < cartItems.length; i++) {
				/**!!!!!! ЭТО "КОСТЫЛЬ" И ТАК ДЕЛАТЬ НЕ РЕКОМЕНДУЕТСЯ! 
			Так как в mockAPI нету метода, который мог бы удалять элемент и заменять его, пришлось написать "КОСТЫЛЬ"*/
				//В данном цикле отправляю запрос, после чего жду 1 секунду. И так далее, пока все элементы не удалятся. Задержка нужна для того, чтобы mockAPI не блокировал
				const item = cartItems[i];
				await axios.delete('https://63d2bc1b06556a0fdd436605.mockapi.io/cart/' + item.id);
				await delay(1000);
			}
		} catch (error) {
			alert('Failed to create order, sorry :(');
		}
		setIsLoading(false); /**И после окончания всего этого процесса, сделай setIsLoading false .
		И не важно выполнится верхнее или нет. Так сделано для того, чтобы не писать setIsLoading(false) в блоках try{} catch{}*/
	};

	return (
		<div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
			{/**Делаю скрытой корзину, вместо того, чтобы каждый раз удалять её */}
			<div className={styles.drawer}>
				<h2 className='d-flex justify-between mb-30'>
					Cart
					<img
						onClick={onClose}
						className='cu-p '
						width={32}
						height={32}
						src='/img/symbols/delete.svg'
						alt='Close Cart'
					/>
				</h2>

				{items.length > 0 ? (
					/**Здесь сказал, items.length больше нуля? Если да, то выведи мне всю информацию о товаре
					 * А если items.length <= 0, то тогда, возьми из файла Info.jsx все данные которые находятся в переменной Info,
					 * И вместо пропсов "title, image и description" поставь то, что я передам
					 */
					<div className='d-flex flex-column flex'>
						<div className='items flex'>
							{items.map(obj => (
								<div key={obj.id} className='cartItem d-flex align-center mb-20'>
									<div
										style={{ backgroundImage: `url(${obj.imageUrl})` }}
										className='cartItemImg'></div>
									<div className='mr-20 flex'>
										<p className='mb-5'>{obj.title}</p>
										<b>{obj.price}$</b>
									</div>
									<img
										onClick={() => onRemove(obj.id)}
										className='removeItem'
										width={32}
										height={32}
										src='/img/symbols/delete.svg'
										alt='Remove'
									/>
								</div>
							))}
						</div>
						<div className='cartTotalBlock'>
							<ul>
								<li>
									<span>Total:</span>
									<div></div>
									<b> {totalPrice}$</b>
								</li>
								<li>
									<span>Tax 10%:</span>
									<div></div>
									<b>{Math.floor((totalPrice / 100) * 10)} $</b>
								</li>
							</ul>
							<button disabled={isLoading} onClick={onClickOrder} className='greenButton'>
								{/**Здесь вызвал функцию, где изменил состояние useState с false на true */}
								Checkout
								<img className='justify-between' src='/img/symbols/arrow.svg' alt='arrow' />
							</button>
						</div>
					</div>
				) : (
					<Info
						title={isOrderCompleted ? 'Order is processed' : 'Cart is Empty'}
						/**Теперь, здесь говорю: "Нажали на кнопку "оформить заказ"? Если да, то напиши это 'Order is processed', а если нет, то'Cart is Empty'" */
						descrition={
							/**Тут все точно так же как и в title */
							isOrderCompleted
								? `Your order #${orderId} will soon be transferred to the delivery service. Thank you for choosing us`
								: 'Please add some items to your cart to place an order'
						}
						image={
							isOrderCompleted ? '/img/symbols/completed-task.png' : '/img/symbols/empty-cart.jpg'
						}
					/>
				)}
			</div>
		</div>
	);
}

export default Drawer;
