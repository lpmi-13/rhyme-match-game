import style from './style.css';

export default function Card({
	onClick,
	rhymeValue,
	word
}) {

	return (
		<div class={style.card}>
			<button class={style.front} onClick={onClick}>
				{word}
			</button>
			<div class={style.back}>{rhymeValue}</div>
		</div>
	);
}
