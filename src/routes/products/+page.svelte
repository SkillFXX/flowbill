<script>
	import { onMount } from 'svelte';
	import { openModal } from '$lib/stores/modal';
	import { formatPrice } from '$lib/utils';

	let products = [];

	let form = {
		name: '',
		description: '',
		price: '',
		vatRate: ''
	};

	let editForm = { ...form, id: null };
	let productInfosDrawerCheckbox;
	let addProductDrawerCheckbox;
	let productToShow = null;

	onMount(loadProducts);

	// Fonction helper pour formater les données produit
	function formatProductData(formData) {
		return {
			name: formData.name,
			description: formData.description,
			price: parseFloat(formData.price),
			vatRate: parseFloat(formData.vatRate)
		};
	}

	async function loadProducts() {
		try {
			const res = await fetch('');
			if (!res.ok) throw new Error('Erreur lors du chargement');
			const data = await res.json();
			products = data.products || [];
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Impossible de charger les produits.');
		}
	}

	async function addProduct() {
		try {
			const res = await fetch('', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formatProductData(form))
			});

			if (res.ok) {
				openModal('Succès', 'Produit ajouté avec succès !');
				resetForm();
				addProductDrawerCheckbox.checked = false;
				await loadProducts();
			} else {
				openModal('Erreur', "Impossible d'ajouter le produit.");
			}
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Une erreur est survenue.');
		}
	}

	async function updateProduct() {
		try {
			const res = await fetch('', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: editForm.id,
					...formatProductData(editForm)
				})
			});

			if (res.ok) {
				openModal('Succès', 'Produit mis à jour avec succès !');
				productInfosDrawerCheckbox.checked = false;
				productToShow = null;
				await loadProducts();
			} else {
				openModal('Erreur', 'Impossible de mettre à jour le produit.');
			}
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Une erreur est survenue.');
		}
	}

	async function deleteProduct(id) {
		if (!confirm('Supprimer ce produit ?')) return;
		try {
			const res = await fetch('', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			if (res.ok) {
				openModal('Succès', 'Produit supprimé.');
				await loadProducts();
			} else {
				openModal('Erreur', 'Impossible de supprimer le produit.');
			}
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Une erreur est survenue.');
		}
	}

	function showProductDetails(product) {
		productToShow = product;

		editForm = {
			id: product.id,
			name: product.name || '',
			description: product.description || '',
			price: product.price || '',
			vatRate: product.vat_rate || ''
		};

		productInfosDrawerCheckbox.checked = true;
	}

	function resetForm() {
		form = {
			name: '',
			description: '',
			price: '',
			vatRate: ''
		};
	}
</script>

<h1 class="text-4xl mb-4">Vos produits</h1>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Nom</th>
				<th>Description</th>
				<th>Prix HT</th>
				<th>TVA</th>
				<th>Prix TTC</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each products as product}
				<tr class="bg-base-200">
					<td class="font-semibold">{product.name}</td>
					<td>
						{#if product.description}
							<span class="line-clamp-2">{product.description}</span>
						{:else}
							<span class="text-gray-500">-</span>
						{/if}
					</td>
					<td>{formatPrice(product.price)}</td>
					<td>{product.vat_rate}%</td>
					<td class="font-semibold">
						{formatPrice(product.price * (1 + product.vat_rate / 100))}
					</td>
					<td>
						<div class="flex gap-2">
							<button class="btn btn-sm" on:click={() => showProductDetails(product)}>
								Modifier
							</button>
							<button class="btn btn-sm btn-error" on:click={() => deleteProduct(product.id)}>
								Supprimer
							</button>
						</div>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="6" class="text-center text-gray-500">Aucun produit</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="drawer-content mt-4">
	<label
		for="add-product-drawer"
		class="btn btn-primary drawer-button"
		bind:this={addProductDrawerCheckbox}
	>
		Ajouter un nouveau produit
	</label>
</div>

<!-- Drawer pour les détails et modification du produit -->
<div class="drawer drawer-end z-50">
	<input
		id="product-infos-drawer"
		type="checkbox"
		class="drawer-toggle"
		bind:this={productInfosDrawerCheckbox}
	/>
	<div class="drawer-side">
		<label for="product-infos-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="bg-base-200 min-h-full w-full max-w-2xl p-6 overflow-y-auto">
			<h2 class="text-2xl font-bold mb-6">Modifier le produit</h2>

			{#if productToShow}
				<form on:submit|preventDefault={updateProduct} class="space-y-6">
					<div class="card bg-base-300 p-4 space-y-4">
						<h3 class="font-semibold text-lg">Informations du produit</h3>

						<div class="form-control">
							<label class="label">
								<span class="label-text">Nom du produit</span>
							</label>
							<input
								type="text"
								class="input input-bordered w-full"
								bind:value={editForm.name}
								required
							/>
						</div>

						<div class="form-control">
							<label class="label">
								<span class="label-text">Description</span>
							</label>
							<textarea
								class="textarea textarea-bordered h-24"
								bind:value={editForm.description}
								placeholder="Description du produit (optionnelle)"
							></textarea>
						</div>

						<div class="grid md:grid-cols-2 gap-4">
							<div class="form-control">
								<label class="label">
									<span class="label-text">Prix HT (€)</span>
								</label>
								<input
									type="number"
									step="0.01"
									min="0"
									class="input input-bordered"
									bind:value={editForm.price}
									required
								/>
							</div>

							<div class="form-control">
								<label class="label">
									<span class="label-text">Taux de TVA (%)</span>
								</label>
								<input
									type="number"
									step="0.01"
									min="0"
									max="100"
									class="input input-bordered"
									bind:value={editForm.vatRate}
									required
								/>
							</div>
						</div>

						{#if editForm.price && editForm.vatRate}
							<div class="alert alert-info">
								<div>
									<div class="font-semibold">Prix TTC calculé :</div>
									<div class="text-lg">
										{formatPrice(editForm.price * (1 + editForm.vatRate / 100))}
									</div>
								</div>
							</div>
						{/if}
					</div>

					<div class="flex justify-end gap-2">
						<button
							type="button"
							class="btn"
							on:click={() => (productInfosDrawerCheckbox.checked = false)}
						>
							Annuler
						</button>
						<button type="submit" class="btn btn-primary"> Mettre à jour </button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</div>

<!-- Drawer pour ajouter un produit -->
<div class="drawer drawer-end z-40">
	<input id="add-product-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label for="add-product-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="bg-base-200 min-h-full w-full max-w-2xl p-6 overflow-y-auto">
			<h2 class="text-2xl font-bold mb-6">Ajouter un produit</h2>

			<form on:submit|preventDefault={addProduct} class="space-y-6">
				<div class="card bg-base-300 p-4 space-y-4">
					<h3 class="font-semibold text-lg">Informations du produit</h3>

					<div class="form-control">
						<label class="label">
							<span class="label-text">Nom du produit</span>
						</label>
						<input
							type="text"
							class="input input-bordered w-full"
							placeholder="Ex: Consultation, Formation, Produit..."
							bind:value={form.name}
							required
						/>
					</div>

					<div class="form-control">
						<label class="label">
							<span class="label-text">Description</span>
						</label>
						<textarea
							class="textarea textarea-bordered h-24"
							bind:value={form.description}
							placeholder="Description du produit (optionnelle)"
						></textarea>
					</div>

					<div class="grid md:grid-cols-2 gap-4">
						<div class="form-control">
							<label class="label">
								<span class="label-text">Prix HT (€)</span>
							</label>
							<input
								type="number"
								step="0.01"
								min="0"
								class="input input-bordered"
								placeholder="99.99"
								bind:value={form.price}
								required
							/>
						</div>

						<div class="form-control">
							<label class="label">
								<span class="label-text">Taux de TVA (%)</span>
							</label>
							<input
								type="number"
								step="0.01"
								min="0"
								max="100"
								class="input input-bordered"
								placeholder="20"
								bind:value={form.vatRate}
								required
							/>
						</div>
					</div>

					{#if form.price && form.vatRate}
						<div class="alert alert-info">
							<div>
								<div class="font-semibold">Prix TTC calculé :</div>
								<div class="text-lg">
									{formatPrice(form.price * (1 + form.vatRate / 100))}
								</div>
							</div>
						</div>
					{/if}
				</div>

				<div class="flex justify-end gap-2">
					<button
						type="button"
						class="btn"
						on:click={() => (addProductDrawerCheckbox.checked = false)}
					>
						Annuler
					</button>
					<button type="submit" class="btn btn-primary px-8"> Ajouter le produit </button>
				</div>
			</form>
		</div>
	</div>
</div>
