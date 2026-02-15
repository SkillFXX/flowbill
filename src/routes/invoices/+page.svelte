<script>
	import { onMount } from 'svelte';
	import { formatPrice, formatDate } from '$lib/utils';

	let invoices = [];
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const res = await fetch('/invoices');
			if (res.ok) {
				const data = await res.json();
				invoices = data.invoices || [];
			} else {
				error = 'Impossible de charger les factures';
			}
		} catch (e) {
			error = 'Erreur lors du chargement';
		} finally {
			loading = false;
		}
	});
</script>

<h1 class="text-4xl mb-8">Historique des factures</h1>

{#if loading}
	<div class="flex justify-center p-8">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else if error}
	<div class="alert alert-error">{error}</div>
{:else}
	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th>Numéro</th>
					<th>Date</th>
					<th>Client</th>
					<th>Montant TTC</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each invoices as invoice}
					<tr class="hover">
						<td class="font-bold">{invoice.number}</td>
						<td>{formatDate(invoice.date)}</td>
						<td>
							{#if invoice.content}
								{JSON.parse(invoice.content).client.company_name ||
									JSON.parse(invoice.content).client.first_name +
										' ' +
										JSON.parse(invoice.content).client.last_name}
							{:else}
								-
							{/if}
						</td>
						<td>{formatPrice(invoice.total_ttc)}</td>
						<td>
							<div class="badge badge-success gap-2">
								{invoice.status}
							</div>
						</td>
						<td>
							<a href="/invoices/{invoice.id}" class="btn btn-sm btn-ghost">Voir</a>
						</td>
					</tr>
				{:else}
					<tr><td colspan="6" class="text-center text-gray-500">Aucune facture</td></tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="mt-8">
		<a href="/facture" class="btn btn-primary">Créer une nouvelle facture</a>
	</div>
{/if}
