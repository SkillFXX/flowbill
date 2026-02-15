<script>
	import { onMount } from 'svelte';
	import { openModal } from '$lib/stores/modal';
	import { formatPrice } from '$lib/utils';

	let clients = [];
	let products = [];
	let settings = {};

	let selectedClient = null;
	let selectedClientId = '';

	let invoiceItems = [];
	let selectedProductToAdd = '';
	let manualItem = { name: '', price: 0, quantity: 1, vatRate: 20 };

	onMount(async () => {
		await Promise.all([loadClients(), loadProducts(), loadSettings()]);
	});

	async function loadClients() {
		const res = await fetch('/customers');
		if (res.ok) {
			const data = await res.json();
			clients = data.clients || [];
		}
	}

	async function loadProducts() {
		const res = await fetch('/products');
		if (res.ok) {
			const data = await res.json();
			products = data.products || [];
		}
	}

	async function loadSettings() {
		const res = await fetch('/settings');
		if (res.ok) {
			const data = await res.json();
			settings = data.user || {};
			if (settings.self_employed) {
				manualItem.vatRate = 0;
			}
		}
	}

	function addProductToInvoice() {
		if (!selectedProductToAdd) return;
		const product = products.find((p) => p.id == selectedProductToAdd);
		if (product) {
			invoiceItems = [
				...invoiceItems,
				{
					name: product.name,
					price: parseFloat(product.price),
					quantity: 1,
					vatRate: settings.self_employed ? 0 : parseFloat(product.vat_rate)
				}
			];
			selectedProductToAdd = '';
		}
	}

	function addManualItem() {
		if (!manualItem.name) return;
		invoiceItems = [...invoiceItems, { ...manualItem }];
		manualItem = { name: '', price: 0, quantity: 1, vatRate: settings.self_employed ? 0 : 20 };
	}

	function removeItem(index) {
		invoiceItems = invoiceItems.filter((_, i) => i !== index);
	}

	function updateClient() {
		selectedClient = clients.find((c) => c.id == selectedClientId);
	}

	$: totals = calculateTotals(invoiceItems);

	function calculateTotals(items) {
		let ht = 0;
		let tax = 0;
		items.forEach((item) => {
			const lineHt = item.price * item.quantity;
			ht += lineHt;
			tax += lineHt * (item.vatRate / 100);
		});
		return {
			ht,
			tax,
			ttc: ht + tax
		};
	}

	async function createInvoice() {
		if (!selectedClient) {
			openModal('Erreur', 'Veuillez sélectionner un client.');
			return;
		}
		if (invoiceItems.length === 0) {
			openModal('Erreur', 'Veuillez ajouter au moins un produit.');
			return;
		}

		try {
			const res = await fetch('', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					client: selectedClient,
					items: invoiceItems,
					settings: settings,
					totals: totals
				})
			});

			if (res.ok) {
				const data = await res.json();
				openModal('Succès', 'Facture créée avec succès !');
				window.location.href = `/invoices/${data.invoiceId}`;
			} else {
				openModal('Erreur', 'Impossible de créer la facture.');
			}
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Une erreur est survenue.');
		}
	}
</script>

<h1 class="text-4xl mb-8">Créer une nouvelle facture</h1>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
	<div class="lg:col-span-2 space-y-6">
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">1. Choisir le client</h2>
				<select
					class="select select-bordered w-full"
					bind:value={selectedClientId}
					on:change={updateClient}
				>
					<option value="">Sélectionner un client...</option>
					{#each clients as client}
						<option value={client.id}>
							{#if client.is_company == 1}
								{client.company_name} (Entreprise)
							{:else}
								{client.first_name} {client.last_name}
							{/if}
						</option>
					{/each}
				</select>

				{#if selectedClient}
					<div class="mt-4 p-4 bg-base-100 rounded-lg text-sm">
						<p class="font-bold">Adresse de facturation :</p>
						<p>{selectedClient.billing_address}</p>
						<p>{selectedClient.billing_postal_code} {selectedClient.billing_city}</p>
						<p>{selectedClient.billing_country}</p>
					</div>
				{/if}
			</div>
		</div>

		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">2. Ajouter des produits</h2>

				<div class="flex gap-2 items-end">
					<div class="form-control w-full">
						<label class="label"><span class="label-text">Depuis le catalogue</span></label>
						<select class="select select-bordered w-full" bind:value={selectedProductToAdd}>
							<option value="">Choisir un produit...</option>
							{#each products as product}
								<option value={product.id}>{product.name} - {formatPrice(product.price)} HT</option>
							{/each}
						</select>
					</div>
					<button
						class="btn btn-secondary"
						on:click={addProductToInvoice}
						disabled={!selectedProductToAdd}>Ajouter</button
					>
				</div>

				<div class="divider">OU AJOUT MANUEL</div>

				<div class="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
					<div class="form-control md:col-span-2">
						<label class="label"><span class="label-text">Nom</span></label>
						<input
							type="text"
							class="input input-bordered w-full"
							bind:value={manualItem.name}
							placeholder="Prestation..."
						/>
					</div>
					<div class="form-control">
						<label class="label"><span class="label-text">Prix HT</span></label>
						<input
							type="number"
							step="0.01"
							class="input input-bordered w-full"
							bind:value={manualItem.price}
						/>
					</div>
					<button class="btn btn-secondary" on:click={addManualItem} disabled={!manualItem.name}
						>Ajouter ligne</button
					>
				</div>
			</div>
		</div>

		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Détail de la facture</h2>
				<div class="overflow-x-auto">
					<table class="table w-full">
						<thead>
							<tr>
								<th>Description</th>
								<th class="w-20">Qté</th>
								<th class="w-24">Prix HT</th>
								{#if !settings.self_employed}
									<th class="w-20">TVA %</th>
								{/if}
								<th class="w-24">Total HT</th>
								<th class="w-10"></th>
							</tr>
						</thead>
						<tbody>
							{#each invoiceItems as item, i}
								<tr>
									<td
										><input
											type="text"
											class="input input-ghost w-full input-sm"
											bind:value={item.name}
										/></td
									>
									<td
										><input
											type="number"
											min="1"
											class="input input-ghost w-full input-sm"
											bind:value={item.quantity}
										/></td
									>
									<td
										><input
											type="number"
											step="0.01"
											class="input input-ghost w-full input-sm"
											bind:value={item.price}
										/></td
									>
									{#if !settings.self_employed}
										<td
											><input
												type="number"
												step="0.1"
												class="input input-ghost w-full input-sm"
												bind:value={item.vatRate}
											/></td
										>
									{/if}
									<td>{formatPrice(item.price * item.quantity)}</td>
									<td>
										<button class="btn btn-ghost btn-xs text-error" on:click={() => removeItem(i)}
											>X</button
										>
									</td>
								</tr>
							{:else}
								<tr><td colspan="5" class="text-center text-gray-500">Aucun article</td></tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Column: Summary -->
	<div class="lg:col-span-1">
		<div class="card bg-primary text-primary-content shadow-xl sticky top-4">
			<div class="card-body">
				<h2 class="card-title mb-4">Total à payer</h2>

				<div class="flex justify-between text-lg">
					<span>Total HT</span>
					<span class="font-bold">{formatPrice(totals.ht)}</span>
				</div>

				{#if !settings.self_employed}
					<div class="flex justify-between text-sm opacity-80">
						<span>TVA</span>
						<span>{formatPrice(totals.tax)}</span>
					</div>
				{/if}

				<div class="divider bg-primary-content/20 h-0.5"></div>

				<div class="flex justify-between text-2xl font-bold">
					<span>Total TTC</span>
					<span>{formatPrice(totals.ttc)}</span>
				</div>

				<div class="card-actions justify-end mt-8">
					<button
						class="btn btn-secondary w-full"
						on:click={createInvoice}
						disabled={invoiceItems.length === 0 || !selectedClient}
					>
						Créer la facture
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
