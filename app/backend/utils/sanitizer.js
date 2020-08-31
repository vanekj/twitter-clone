const escapeMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#39;',
		'`': '&#96;'
	},
	escapeKeys = Object.keys(escapeMap).join(''),
	escapeRegExp = new RegExp(`[${escapeKeys}]`, 'g'),
	needsEscapeRegExp = new RegExp(escapeRegExp.source);

module.exports = {

	/**
	 * Does value need to be escaped?
	 * @param {*} value
	 * @returns {Boolean}
	 */
	needsEscape(value) {
		let stringValue = String(value);
		return needsEscapeRegExp.test(stringValue);
	},

	/**
	 * Escape single character
	 * @param {*} value
	 * @returns {String}
	 */
	escapeChar(value) {
		return escapeMap[value] || String(value);
	},

	/**
	 * Escape string of markup
	 * @param {*} value
	 * @returns {String}
	 */
	escapeMarkup(value) {
		if (this.needsEscape(value)) {
			let stringValue = String(value);
			return stringValue.replace(escapeRegExp, this.escapeChar);
		} else {
			return value;
		}
	},

	/**
	 * Escape every string in an object
	 * @param {Object} object
	 * @returns {Object}
	 */
	escapeObject(object) {
		if (typeof object === 'object' && object) {
			return Object.entries(object).reduce((previous, [key, value]) => {
				previous[this.escapeMarkup(key)] = typeof value === 'object' && value ? this.escapeObject(value) : this.escapeMarkup(value);
				return previous;
			}, {});
		} else {
			return object;
		}
	}

};
