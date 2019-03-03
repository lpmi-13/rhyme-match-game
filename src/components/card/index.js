import style from './style.css';

export default function Card({
	hiddenValue,
	flipStatus,
	onClick,
	word
}) {

	return (
		<div class={style.card} data-flip-status={flipStatus}>
			<button class={style.front} onClick={onClick}>
				{word}
			</button>
			<div class={style.back}>{hiddenValue}</div>
		</div>
	);
}
