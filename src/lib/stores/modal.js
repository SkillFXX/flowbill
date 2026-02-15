import { writable } from 'svelte/store';

export const modal = writable({
	open: false,
	title: '',
	message: ''
});

export function openModal(title, message) {
	modal.set({
		open: true,
		title,
		message
	});
}

export function closeModal() {
	modal.update((m) => ({ ...m, open: false }));
}
