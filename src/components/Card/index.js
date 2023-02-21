import React from 'react';
import ContentLoader from 'react-content-loader';

import AppContext from '../../context';

import styles from './Card.module.scss';

function Card({
	id,
	title,
	price,
	imageUrl,
	onFavorite,
	onPlus,
	favorited = false,
	loading = false,
}) {
	const { isItemAdded } = React.useContext(AppContext);
	const [isFavorite, setIsFavorite] = React.useState(favorited);
	/**При первом рендере компонента favorite по умолчанию useState будет хранить то, что есть favorited
	 * И будет сохранять в 'isFavorite'
	 */
	const itemsObj = { id, parentId: id, title, imageUrl, price };

	const handleClick = () => {
		onPlus(itemsObj); //Здесь мы отправляем данные на сервер
		// setIsAdded(!isAdded) // Значит, что когда мы будем вызывать данную функцию,то значение которое
		// в нем есть, оно инвертируется. Т.е если isAdded = true, то станет false
	};

	const onClickFavorite = () => {
		onFavorite(itemsObj);
		setIsFavorite(!isFavorite);
	};

	const myLoader = (
		<ContentLoader
			speed={2}
			width={200}
			height={190}
			viewBox='0 0 200 190'
			backgroundColor='#f3f5d6'
			foregroundColor='#ecebeb'>
			<rect x='0' y='116' rx='5' ry='5' width='150' height='15' />
			<rect x='0' y='138' rx='5' ry='5' width='115' height='15' />
			<rect x='0' y='162' rx='5' ry='5' width='100' height='24' />
			<rect x='0' y='0' rx='5' ry='5' width='150' height='108' />
			<rect x='118' y='154' rx='5' ry='5' width='32' height='32' />
		</ContentLoader>
	);

	return (
		<div className={styles.card}>
			{loading ? (
				myLoader
			) : (
				<>
					{/**Зачем тут написан '<></>'? В реакте, можно не создавать лишний див, а можно создать фрагмент
				 Он позволяет создавать реактовский родительский элемент. "<></>" <= это фрагмент, в реакте он будет как родительский блок
				 НО в html он не будет создавать лишний блок, но будет помещать всё, куда это необходимо.
				*/}
					{onFavorite && (
						<div className={styles.favorite} onClick={onClickFavorite}>
							<img
								width={27}
								height={27}
								src={isFavorite ? 'Img/symbols/like.svg' : 'Img/symbols/unlike.svg'}
								alt='Unliked'
							/>
						</div>
					)}

					<img width='100%' height={135} src={imageUrl} alt={title} />
					<h5>{title}</h5>
					<div className='d-flex justify-between align-center'>
						<div className='d-flex flex-column '>
							<span>Price:</span>
							<b>{price}$</b>
						</div>
						{onPlus && (
							<img
								className={styles.plus}
								onClick={handleClick}
								src={isItemAdded(id) ? 'Img/symbols/done.svg' : 'Img/symbols/plus.svg'}
								alt='plus'
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default Card;
