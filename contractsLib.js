/** @param {NS} ns */
export function solveCct(type = new String, data) {
	switch (type) {
		case 'Find Largest Prime Factor':
			function isPrime(num = new Number) {
				const maxFact = Math.floor(Math.sqrt(num));
				let prime = new Boolean;
				let i = maxFact;
				while (i > 1) {
					if (num % i == 0) {
						prime = false;
						break;
					}
					else { i--; }
				}
				if (prime !== false) {
					prime = true;
				}
				return prime;
			}
			let comp = Number(data)
			let i = comp - 1;
			let revFactors = new Array
			while (i > 1) {
				if (comp % i == 0) { revFactors.push(i); }
				i--;
			}
			for (let factor of revFactors) {
				if (isPrime(factor)) {
					return factor;

				}
			}

		case 'Subarray with Maximum Sum':
			return 'No solution ready'; //TODO: atmpt

		case 'Total Ways to Sum':
			return 'No solution ready'; //TODO: atmpt

		case 'Total Ways to Sum II':
			return 'No solution ready'; //TODO: atmpt

		case 'Spiralize Matrix':
			return 'No solution ready'; //TODO: atmpt

		case 'Array Jumping Game':
			return 'No solution ready'; //TODO: atmpt

		case 'Array Jumping Game II':
			return 'No solution ready'; //TODO: atmpt

		case 'Merge Overlapping Intervals':
			return 'No solution ready'; //TODO: atmpt

		case 'Generate IP Addresses':
			return 'No solution ready'; //TODO: atmpt

		case 'Algorithmic Stock Trader I':
			return 'No solution ready'; //TODO: atmpt

		case 'Algorithmic Stock Trader II':
			return 'No solution ready'; //TODO: atmpt

		case 'Algorithmic Stock Trader III':
			return 'No solution ready'; //TODO: atmpt

		case 'Algorithmic Stock Trader IV':
			return 'No solution ready'; //TODO: atmpt

		case 'Minimum Path Sum in a Triangle':
			return 'No solution ready'; //TODO: atmpt

		case 'Unique Paths in a Grid I':
			return 'No solution ready'; //TODO: atmpt

		case 'Unique Paths in a Grid II':
			return 'No solution ready'; //TODO: atmpt

		case 'Shortest Path in a Grid':
			return 'No solution ready'; //TODO: atmpt

		case 'Sanitize Parentheses in Expression':
			return 'No solution ready'; //TODO: atmpt

		case 'Find All Valid Math Expressions':
			return 'No solution ready'; //TODO: atmpt

		case 'HammingCodes Integer to Encoded Binary':
			function toBinary(integer) {
				let x = new Number;
				let binary = new String;
				while (2 ** x <= integer) { x++; }
				do {
					x--;
					let quote = Math.floor(integer / (2 ** x));
					if (quote >= 1) { binary += '1'; }
					else { binary += '0'; }
					integer -= quote * (2 ** x);
				} while (x > 0);
				return binary;
			}
			let bin = toBinary(data);
			return 'No solution ready'; //TODO: nano /scripts/prod/test_Hamming.js

		case 'HammingCodes Encoded Binary to Integer':
			return 'No solution ready'; //TODO: atmpt

		case 'Proper 2-Coloring of a Graph':
			return 'No solution ready'; //TODO: atmpt

		case 'Compression I RLE Compression':
			return 'No solution ready'; //TODO: atmpt

		case 'Compression II LZ Decompression':
			return 'No solution ready'; //TODO: atmpt

		case 'Compression III LZ Compression':
			return 'No solution ready'; //TODO: atmpt

		case 'Encryption I Caesar Cipher':
			const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
				'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
			let plaintext = String(data);
			let solution = new String;
			for (let char of plaintext[0]) {
				if (char !== ' ') {
					let shiftIdx = alphabet.indexOf(char) - plaintext[1];
					if (shiftIdx < 0) { shiftIdx += 25; }
					solution += alphabet[shiftIdx];
				} else { solution += char; }
			}
			return solution;

		case 'Encryption II Vigenère Cipher':
			return 'No solution ready'; //TODO: atmpt

	}
}