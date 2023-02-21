import React from 'react';
import { useCart } from '../../hooks/useCart';

import { Link } from 'react-router-dom';

function Header(props) {
	const { totalPrice } = useCart();

	return (
		<header className='d-flex justify-between align-center p-40'>
			<Link to='/'>
				{/**Здесь задаю элемент 'react-router-dom' <Link>, который позволяет мне перейти на другую страницу щелкнув на нее.
				 * Можно назвать страницу как угодно, главное чтобы подходило по смыслу*/}
				<div className='d-flex align-center'>
					<img width={40} height={40} src='/img/symbols/logo.svg' alt='logo' />
					<div>
						<h3 className='text-uppercase'>React Pc components</h3>
						<p className='opacity-5'>Shop for the best accessories for your computer</p>
					</div>
				</div>
			</Link>
			<ul className='d-flex'>
				<li onClick={props.onClickCart} className='mr-30 cu-p'>
					<img width={18} height={18} src='/img/symbols/cart.svg' alt='Cart' />
					<span className='m-l'>{totalPrice}$</span>
				</li>
				<li className='mr-20 cu-p'>
					<Link to='/favorites'>
						<img width={18} height={18} src='/img/symbols/heart.svg' alt='Favorites' />
					</Link>
				</li>
				<li>
					<Link to='/orders'>
						<img width={18} height={18} src='/img/symbols/user.svg' alt='User' />
					</Link>
				</li>
			</ul>
		</header>
	);
}

export default Header;
