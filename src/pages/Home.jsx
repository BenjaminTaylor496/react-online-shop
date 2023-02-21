import React from 'react';
import Card from '../components/Card';
import AppContext from '../context';

function Home({ items, searchValue, setSearchValue, onChangeSearchInput, onAddToCart, isLoading }) {
	const { isItemAdded, onAddToFavorite } = React.useContext(AppContext);

	const renderItems = () => {
		const filteredItems = items.filter(item =>
			item.title.toLowerCase().includes(searchValue.toLowerCase()),
		);
		/**Перед рендерингом filter будет проходить по массиву и будет исключать все item
		 * у которых в title нету того, что написано в searchValue */

		/**<== Если  isLoading есть, тогда создай 10 фейковых элементов, если загрузка закончилась. тогда рендери потенциально фильтрируемые объекты в массиве  */
		// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
		return (isLoading ? [...Array(8)] : filteredItems).map((item, index) => (
			<Card
				key={index}
				onFavorite={obj => onAddToFavorite(obj)}
				onPlus={obj => onAddToCart(obj)}
				added={isItemAdded(item && item.id)}
				/**CartItems если хотя бы один объект в этом массиве id.item, то только в этом случае примени added 
				в JavaScriptе оператор some(), который говорит, что если хотя бы одно условие совпало, то он вернет true.  */
				//added Не указали true потому, что в React когда мы используем булевы значения(true, false) в свойствах, то не обязательно делать true
				loading={isLoading}
				{...item}
			/>
		));
	};

	return (
		<div className='content p-40'>
			<div className='d-flex align-center mb-40 justify-between'>
				<h1>{searchValue ? `Search result for query : ${searchValue}` : 'All components'}</h1>
				<div className='searching d-flex'>
					{searchValue && (
						<img
							onClick={() => setSearchValue('')}
							className='clear cu-p'
							src='/img/symbols/delete.svg'
							alt='Clear'
						/>
					)}
					<img
						className='justify-center'
						width={20}
						height={20}
						src='/img/symbols/search.svg'
						alt='search'
					/>
					<input
						onChange={onChangeSearchInput}
						value={searchValue}
						width={10}
						height={10}
						placeholder='Поиск...'
					/>
				</div>
			</div>

			<div className='d-flex flex-wrap'>{renderItems()}</div>
		</div>
	);
}

export default Home;
