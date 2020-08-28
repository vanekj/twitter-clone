export default function({ $axios }) {
	if (process.client) {
		$axios.defaults.baseURL = window.location.origin;
	}
}
