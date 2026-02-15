<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import TemplateDefault from '$lib/components/invoices/TemplateDefault.svelte';
	import TemplateMinimal from '$lib/components/invoices/TemplateMinimal.svelte';

	let invoice = null;
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const res = await fetch(`/invoices/${$page.params.id}`);
			if (res.ok) {
				const data = await res.json();
				invoice = data.invoice;
			} else {
				error = 'Facture introuvable';
			}
		} catch (e) {
			error = 'Erreur lors du chargement';
		} finally {
			loading = false;
		}
	});

	function printInvoice() {
		window.print();
	}
</script>

{#if loading}
	<div class="flex justify-center p-8">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else if error}
	<div class="alert alert-error">{error}</div>
{:else if invoice}
	<div class="p-4 print:p-0">
		<div class="flex justify-between items-center mb-4 print:hidden">
			<a href="/invoices" class="btn btn-ghost">← Retour</a>
			<button class="btn btn-primary" on:click={printInvoice}>Imprimer / PDF</button>
		</div>

		<div class="shadow-2xl print:shadow-none">
			{#if invoice.user.invoice_template === 'minimal'}
				<TemplateMinimal {invoice} />
			{:else}
				<TemplateDefault {invoice} />
			{/if}
		</div>
	</div>
{/if}
