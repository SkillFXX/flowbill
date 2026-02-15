export function formatPrice(price) {
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR'
	}).format(price);
}

export function formatDate(date) {
	if (!date) return '';
	return new Date(date).toLocaleDateString('fr-FR');
}
