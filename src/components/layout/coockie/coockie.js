import './coockie.scss'
document.addEventListener('DOMContentLoaded', function () {
	const cookieNotice = document.getElementById('cookie-notice');
	const acceptButton = document.querySelector('.cookie-accept');
	if (localStorage.getItem('cookiesAccepted') === 'true') {
		cookieNotice.close();
		return;
	}
	cookieNotice.showModal();
	acceptButton.addEventListener('click', function () {
		localStorage.setItem('cookiesAccepted', 'true');
		cookieNotice.close();
	});
});