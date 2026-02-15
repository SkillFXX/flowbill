<script>
	import { modal, closeModal } from '$lib/stores/modal';
	import { onMount } from 'svelte';

	let dialog;

	$: if ($modal.open) {
		dialog?.showModal();
	} else {
		dialog?.close();
	}
</script>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">{$modal.title}</h3>
		<p class="py-4">{$modal.message}</p>

		<div class="modal-action">
			<button class="btn" on:click={closeModal}> Fermer </button>
		</div>
	</div>
</dialog>
