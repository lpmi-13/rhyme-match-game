
import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style.css';


export default class Select extends Component{
  
  rhymeSelections = [
  	'say',
  	'be',
  	'go',
  	'you',
  	'why',
	];
	
	startGame = () => {
		route('/game');
	};
	
	render () {
          return (
        	<div class={style.select}>
        	  <div class={style.head}>
        	    <h2>Choose a rhyme</h2>
            </div>
						{this.rhymeSelections.map((rhyme) => {
							<button class={style.button} onClick={this.startGame}>buttons</button>
						})}
        	</div>
          )
	}
}
