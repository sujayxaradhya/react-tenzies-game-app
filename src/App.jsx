import React, { useEffect, useState } from "react";

import Dice from "./components/Dice";

import { nanoid } from "nanoid";

import Confetti from "react-confetti";

export default function App() {
	const [diceRolls, setDiceRolls] = useState(rollNewDice());

	const [tenzies, setTenzies] = useState(false);

	useEffect(() => {
		const allHeld = diceRolls.every((dice) => {
			return dice.isHeld;
		});
		const firstValue = diceRolls[0].value;
		const allSameValue = diceRolls.every((dice) => {
			return dice.value === firstValue;
		});
		if (allHeld && allSameValue) {
			setTenzies(true);
		}
	}, [diceRolls]);

	function generateNewDice() {
		return {
			value: Math.ceil(Math.random() * 6),

			isHeld: false,

			id: nanoid()
		};
	}

	function rollNewDice() {
		const diceNums = [];

		for (let i = 0; i < 10; i++) {
			diceNums.push(generateNewDice());
		}

		return diceNums;
	}

	function reRoll() {
		if (!tenzies) {
			setDiceRolls((prevDice) => {
				return prevDice.map((dice) => {
					return dice.isHeld ? dice : generateNewDice();
				});
			});
		} else {
			setTenzies(false);

			setDiceRolls(rollNewDice());
		}
	}

	function holdDice(id) {
		setDiceRolls((prevDiceRolls) => {
			return prevDiceRolls.map((dice) => {
				return dice.id === id ? { ...dice, isHeld: !dice.isHeld } : dice;
			});
		});
	}

	const diceElements = diceRolls.map((dice) => {
		return (
			<Dice
				key={dice.id}
				value={dice.value}
				isHeld={dice.isHeld}
				holdDice={() => {
					return holdDice(dice.id);
				}}
			/>
		);
	});

	return (
		<section className="main-section">
			<main>
				{tenzies && <Confetti />}
				<h1 className="title">Tenzies</h1>
				<p className="instructions">
					Roll until all dice are the same. Click each die to freeze it at its
					current value between rolls.
				</p>
				<div className="dice-list">{diceElements}</div>
				<button className="roll-dice" onClick={reRoll}>
					{tenzies ? "New Game" : "Roll"}
				</button>
			</main>
		</section>
	);
}
