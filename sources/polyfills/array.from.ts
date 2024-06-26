/**
 * @source {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill}
 * but without thisArg (too hard to type, no need to `this`)
 */
const toStr = Object.prototype.toString;
function isCallable(fn: unknown): boolean {
	return typeof fn === "function" || toStr.call(fn) === "[object Function]";
}
function toInteger(value: unknown): number {
	const number = Number(value);
	if (isNaN(number)) {
		return 0;
	}
	if (number === 0 || !isFinite(number)) {
		return number;
	}
	return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
}
const maxSafeInteger = Math.pow(2, 53) - 1;
function toLength(value: unknown): number {
	const len = toInteger(value);
	return Math.min(Math.max(len, 0), maxSafeInteger);
}
/**
 * Creates an array from an iterable object.
 * @param iterable An iterable object to convert to an array.
 */
export default function arrayFrom<T>(iterable: Iterable<T> | ArrayLike<T>): T[];
/**
 * Creates an array from an iterable object.
 * @param iterable An iterable object to convert to an array.
 * @param mapfn A mapping function to call on every element of the array.
 * @param thisArg Value of 'this' used to invoke the mapfn.
 */
export default function arrayFrom<T, U>(
	arrayLike: Iterable<T> | ArrayLike<T>,
	mapFn?: (v: T, k: number) => U,
): U[] {
	// 1. Let C be the this value.
	// edit(@eps1lon): we're not calling it as Array.from
	const C = Array;

	// 2. Let items be ToObject(arrayLike).
	const items = Object(arrayLike);

	// 3. ReturnIfAbrupt(items).
	if (arrayLike == null) {
		throw new TypeError(
			"Array.from requires an array-like object - not null or undefined",
		);
	}

	// 4. If mapfn is undefined, then let mapping be false.
	// const mapFn = arguments.length > 1 ? arguments[1] : void undefined;

	if (typeof mapFn !== "undefined") {
		// 5. else
		// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
		if (!isCallable(mapFn)) {
			throw new TypeError(
				"Array.from: when provided, the second argument must be a function",
			);
		}
	}

	// 10. Let lenValue be Get(items, "length").
	// 11. Let len be ToLength(lenValue).
	const len = toLength(items.length);

	// 13. If IsConstructor(C) is true, then
	// 13. a. Let A be the result of calling the [[Construct]] internal method
	// of C with an argument list containing the single item len.
	// 14. a. Else, Let A be ArrayCreate(len).
	const A = isCallable(C) ? Object(new C(len)) : new Array(len);

	// 16. Let k be 0.
	let k = 0;
	// 17. Repeat, while k < len… (also steps a - h)
	let kValue;
	while (k < len) {
		kValue = items[k];
		if (mapFn) {
			A[k] = mapFn(kValue, k);
		} else {
			A[k] = kValue;
		}
		k += 1;
	}
	// 18. Let putStatus be Put(A, "length", len, true).
	A.length = len;
	// 20. Return A.
	return A;
}
