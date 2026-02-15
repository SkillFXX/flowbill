<script>
	import { onMount } from 'svelte';
	import { openModal } from '$lib/stores/modal';

	let clients = [];
	let customerType = 'individual';

	let form = {
		email: '',
		phone: '',
		firstName: '',
		lastName: '',
		companyName: '',
		legalForm: '',
		siret: '',
		vatNumber: '',
		billingAddress: '',
		billingPostalCode: '',
		billingCity: '',
		billingCountry: '',
		shippingAddress: '',
		shippingPostalCode: '',
		shippingCity: '',
		shippingCountry: ''
	};

	let editForm = { ...form, id: null };
	let customerInfosDrawerCheckbox;
	let addCustomerDrawerCheckbox;
	let customerToShow = null;
	let editCustomerType = 'individual';

	onMount(loadCustomers);

	async function loadCustomers() {
		try {
			const res = await fetch('');
			if (!res.ok) throw new Error('Erreur lors du chargement');
			const data = await res.json();
			clients = data.clients || [];
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Impossible de charger les clients.');
		}
	}

	function formatClientData(formData, isCompany) {
		return {
			email: formData.email,
			phone: formData.phone,
			firstName: formData.firstName,
			lastName: formData.lastName,
			companyName: formData.companyName,
			legalForm: formData.legalForm,
			siret: formData.siret,
			vatNumber: formData.vatNumber,
			billingAddress: formData.billingAddress,
			billingPostalCode: formData.billingPostalCode,
			billingCity: formData.billingCity,
			billingCountry: formData.billingCountry,
			shippingAddress: formData.shippingAddress,
			shippingPostalCode: formData.shippingPostalCode,
			shippingCity: formData.shippingCity,
			shippingCountry: formData.shippingCountry,
			isCompany: isCompany
		};
	}

	async function addCustomer() {
		try {
			const res = await fetch('', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formatClientData(form, customerType === 'company'))
			});

			if (res.ok) {
				openModal('Succès', 'Client ajouté avec succès !');
				resetForm();
				addCustomerDrawerCheckbox.checked = false;
				await loadCustomers();
			} else {
				openModal('Erreur', "Impossible d'ajouter le client.");
			}
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Une erreur est survenue.');
		}
	}

	async function updateCustomer() {
		try {
			const res = await fetch('', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: editForm.id,
					...formatClientData(editForm, editCustomerType === 'company')
				})
			});

			if (res.ok) {
				openModal('Succès', 'Client mis à jour avec succès !');
				customerInfosDrawerCheckbox.checked = false;
				customerToShow = null;
				await loadCustomers();
			} else {
				openModal('Erreur', 'Impossible de mettre à jour le client.');
			}
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Une erreur est survenue.');
		}
	}

	async function deleteClient(id) {
		if (!confirm('Supprimer ce client ?')) return;
		try {
			const res = await fetch('', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			if (res.ok) {
				openModal('Succès', 'Client supprimé.');
				await loadCustomers();
			} else {
				openModal('Erreur', 'Impossible de supprimer le client.');
			}
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Une erreur est survenue.');
		}
	}

	function showCustomerDetails(client) {
		customerToShow = client;
		editCustomerType = Number(client.is_company) === 1 ? 'company' : 'individual';

		editForm = {
			id: client.id,
			email: client.email || '',
			phone: client.phone || '',
			firstName: client.first_name || '',
			lastName: client.last_name || '',
			companyName: client.company_name || '',
			legalForm: client.legal_form || '',
			siret: client.siret || '',
			vatNumber: client.vat_number || '',
			billingAddress: client.billing_address || '',
			billingPostalCode: client.billing_postal_code || '',
			billingCity: client.billing_city || '',
			billingCountry: client.billing_country || '',
			shippingAddress: client.shipping_address || '',
			shippingPostalCode: client.shipping_postal_code || '',
			shippingCity: client.shipping_city || '',
			shippingCountry: client.shipping_country || ''
		};

		customerInfosDrawerCheckbox.checked = true;
	}

	function resetForm() {
		form = {
			email: '',
			phone: '',
			firstName: '',
			lastName: '',
			companyName: '',
			legalForm: '',
			siret: '',
			vatNumber: '',
			billingAddress: '',
			billingPostalCode: '',
			billingCity: '',
			billingCountry: '',
			shippingAddress: '',
			shippingPostalCode: '',
			shippingCity: '',
			shippingCountry: ''
		};
		customerType = 'individual';
	}
</script>

<h1 class="text-4xl mb-4">Vos clients</h1>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Nom</th>
				<th>Email</th>
				<th>Téléphone</th>
				<th>Type</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each clients as client}
				<tr class="bg-base-200">
					<td>
						{#if Number(client.is_company) === 1}
							{client.company_name}
						{:else}
							{client.first_name} {client.last_name}
						{/if}
					</td>
					<td>{client.email}</td>
					<td>{client.phone || '-'}</td>
					<td>
						{#if Number(client.is_company) === 1}
							<span class="badge badge-primary">Entreprise</span>
						{:else}
							<span class="badge badge-secondary">Particulier</span>
						{/if}
					</td>
					<td>
						<div class="flex gap-2">
							<button class="btn btn-sm" on:click={() => showCustomerDetails(client)}>
								Détails
							</button>
							<button class="btn btn-sm btn-error" on:click={() => deleteClient(client.id)}>
								Supprimer
							</button>
						</div>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="5" class="text-center text-gray-500">Aucun client</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="drawer-content mt-4">
	<label
		for="add-customer-drawer"
		class="btn btn-primary drawer-button"
		bind:this={addCustomerDrawerCheckbox}
	>
		Ajouter un nouveau client
	</label>
</div>

<!-- Drawer pour les détails et modification du client -->
<div class="drawer drawer-end z-50">
	<input
		id="customer-infos-drawer"
		type="checkbox"
		class="drawer-toggle"
		bind:this={customerInfosDrawerCheckbox}
	/>
	<div class="drawer-side">
		<label for="customer-infos-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="bg-base-200 min-h-full w-full max-w-2xl p-6 overflow-y-auto">
			<h2 class="text-2xl font-bold mb-6">Détails du client</h2>

			{#if customerToShow}
				<form on:submit|preventDefault={updateCustomer} class="space-y-6">
					<!-- Type de client -->
					<div class="card bg-base-300 p-4">
						<div class="form-control">
							<label class="label">
								<span class="label-text font-semibold">Type de client</span>
							</label>
							<select class="select select-bordered w-full" bind:value={editCustomerType} required>
								<option value="individual">Particulier</option>
								<option value="company">Entreprise</option>
							</select>
						</div>
					</div>

					<!-- Informations principales -->
					<div class="card bg-base-300 p-4 space-y-4">
						<h3 class="font-semibold text-lg">Informations principales</h3>

						<div class="grid md:grid-cols-2 gap-4">
							<div class="form-control">
								<label class="label">
									<span class="label-text">Email</span>
								</label>
								<input
									type="email"
									class="input input-bordered w-full"
									bind:value={editForm.email}
									required
								/>
							</div>

							<div class="form-control">
								<label class="label">
									<span class="label-text">Téléphone</span>
								</label>
								<input type="tel" class="input input-bordered w-full" bind:value={editForm.phone} />
							</div>
						</div>

						{#if editCustomerType === 'individual'}
							<div class="grid md:grid-cols-2 gap-4">
								<div class="form-control">
									<label class="label">
										<span class="label-text">Prénom</span>
									</label>
									<input
										type="text"
										class="input input-bordered"
										bind:value={editForm.firstName}
										required
									/>
								</div>

								<div class="form-control">
									<label class="label">
										<span class="label-text">Nom</span>
									</label>
									<input
										type="text"
										class="input input-bordered"
										bind:value={editForm.lastName}
										required
									/>
								</div>
							</div>
						{/if}

						{#if editCustomerType === 'company'}
							<div class="space-y-4">
								<div class="form-control">
									<label class="label">
										<span class="label-text">Raison sociale</span>
									</label>
									<input
										type="text"
										class="input input-bordered"
										bind:value={editForm.companyName}
										required
									/>
								</div>

								<div class="grid md:grid-cols-2 gap-4">
									<div class="form-control">
										<label class="label">
											<span class="label-text">Forme juridique</span>
										</label>
										<input
											type="text"
											class="input input-bordered"
											bind:value={editForm.legalForm}
										/>
									</div>

									<div class="form-control">
										<label class="label">
											<span class="label-text">SIRET</span>
										</label>
										<input type="text" class="input input-bordered" bind:value={editForm.siret} />
									</div>
								</div>

								<div class="form-control">
									<label class="label">
										<span class="label-text">Numéro de TVA</span>
									</label>
									<input type="text" class="input input-bordered" bind:value={editForm.vatNumber} />
								</div>
							</div>
						{/if}
					</div>

					<!-- Adresse de facturation -->
					<div class="card bg-base-300 p-4 space-y-4">
						<h3 class="font-semibold text-lg">Adresse de facturation</h3>

						<div class="form-control">
							<input
								type="text"
								class="input input-bordered"
								placeholder="Adresse"
								bind:value={editForm.billingAddress}
								required
							/>
						</div>

						<div class="grid md:grid-cols-3 gap-4">
							<input
								type="text"
								class="input input-bordered"
								placeholder="Code postal"
								bind:value={editForm.billingPostalCode}
								required
							/>
							<input
								type="text"
								class="input input-bordered"
								placeholder="Ville"
								bind:value={editForm.billingCity}
								required
							/>
							<input
								type="text"
								class="input input-bordered"
								placeholder="Pays"
								bind:value={editForm.billingCountry}
							/>
						</div>
					</div>

					<!-- Adresse de livraison -->
					<div class="card bg-base-300 p-4 space-y-4">
						<h3 class="font-semibold text-lg">Adresse de livraison</h3>

						<div class="form-control">
							<input
								type="text"
								class="input input-bordered"
								placeholder="Adresse"
								bind:value={editForm.shippingAddress}
							/>
						</div>

						<div class="grid md:grid-cols-3 gap-4">
							<input
								type="text"
								class="input input-bordered"
								placeholder="Code postal"
								bind:value={editForm.shippingPostalCode}
							/>
							<input
								type="text"
								class="input input-bordered"
								placeholder="Ville"
								bind:value={editForm.shippingCity}
							/>
							<input
								type="text"
								class="input input-bordered"
								placeholder="Pays"
								bind:value={editForm.shippingCountry}
							/>
						</div>
					</div>

					<div class="flex justify-end gap-2">
						<button
							type="button"
							class="btn"
							on:click={() => (customerInfosDrawerCheckbox.checked = false)}
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

<!-- Drawer pour ajouter un client -->
<div class="drawer drawer-end z-40">
	<input id="add-customer-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-side">
		<label for="add-customer-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="bg-base-200 min-h-full w-full max-w-2xl p-6 overflow-y-auto">
			<h2 class="text-2xl font-bold mb-6">Ajouter un client</h2>

			<form on:submit|preventDefault={addCustomer} class="space-y-6">
				<div class="card bg-base-300 p-4">
					<div class="form-control">
						<label class="label">
							<span class="label-text font-semibold">Type de client</span>
						</label>
						<select class="select select-bordered w-full" bind:value={customerType} required>
							<option value="" disabled>Choisir un type</option>
							<option value="individual">Particulier</option>
							<option value="company">Entreprise</option>
						</select>
					</div>
				</div>

				<!-- Informations principales -->
				<div class="card bg-base-300 p-4 space-y-4">
					<h3 class="font-semibold text-lg">Informations principales</h3>

					<div class="grid md:grid-cols-2 gap-4">
						<div class="form-control">
							<label class="label">
								<span class="label-text">Email</span>
							</label>
							<input
								type="email"
								class="input input-bordered w-full"
								placeholder="contact@email.com"
								bind:value={form.email}
								required
							/>
						</div>

						<div class="form-control">
							<label class="label">
								<span class="label-text">Téléphone</span>
							</label>
							<input
								type="tel"
								class="input input-bordered w-full"
								placeholder="+33 6 00 00 00 00"
								bind:value={form.phone}
							/>
						</div>
					</div>

					{#if customerType === 'individual'}
						<div class="grid md:grid-cols-2 gap-4">
							<div class="form-control">
								<label class="label">
									<span class="label-text">Prénom</span>
								</label>
								<input
									type="text"
									class="input input-bordered"
									placeholder="Jean"
									bind:value={form.firstName}
									required
								/>
							</div>

							<div class="form-control">
								<label class="label">
									<span class="label-text">Nom</span>
								</label>
								<input
									type="text"
									class="input input-bordered"
									placeholder="Dupont"
									bind:value={form.lastName}
									required
								/>
							</div>
						</div>
					{/if}

					{#if customerType === 'company'}
						<div class="space-y-4">
							<div class="form-control">
								<label class="label">
									<span class="label-text">Raison sociale</span>
								</label>
								<input
									type="text"
									class="input input-bordered"
									placeholder="Google France SAS"
									bind:value={form.companyName}
									required
								/>
							</div>

							<div class="grid md:grid-cols-2 gap-4">
								<div class="form-control">
									<label class="label">
										<span class="label-text">Forme juridique</span>
									</label>
									<input
										type="text"
										class="input input-bordered"
										placeholder="SAS, SARL, EI..."
										bind:value={form.legalForm}
									/>
								</div>

								<div class="form-control">
									<label class="label">
										<span class="label-text">SIRET</span>
									</label>
									<input
										type="text"
										class="input input-bordered"
										placeholder="12345678901234"
										bind:value={form.siret}
									/>
								</div>
							</div>

							<div class="form-control">
								<label class="label">
									<span class="label-text">Numéro de TVA intracommunautaire</span>
								</label>
								<input
									type="text"
									class="input input-bordered"
									placeholder="FR12345678901"
									bind:value={form.vatNumber}
								/>
							</div>
						</div>
					{/if}
				</div>

				<!-- Adresse de facturation -->
				<div class="card bg-base-300 p-4 space-y-4">
					<h3 class="font-semibold text-lg">Adresse de facturation</h3>

					<div class="form-control">
						<input
							type="text"
							class="input input-bordered"
							placeholder="1 rue de la Paix"
							bind:value={form.billingAddress}
							required
						/>
					</div>

					<div class="grid md:grid-cols-3 gap-4">
						<input
							type="text"
							class="input input-bordered"
							placeholder="Code postal"
							bind:value={form.billingPostalCode}
							required
						/>
						<input
							type="text"
							class="input input-bordered"
							placeholder="Ville"
							bind:value={form.billingCity}
							required
						/>
						<input
							type="text"
							class="input input-bordered"
							placeholder="Pays"
							bind:value={form.billingCountry}
						/>
					</div>
				</div>

				<!-- Adresse de livraison -->
				<div class="card bg-base-300 p-4 space-y-4">
					<h3 class="font-semibold text-lg">Adresse de livraison (optionnelle)</h3>

					<div class="form-control">
						<input
							type="text"
							class="input input-bordered"
							placeholder="1 rue de la Paix"
							bind:value={form.shippingAddress}
						/>
					</div>

					<div class="grid md:grid-cols-3 gap-4">
						<input
							type="text"
							class="input input-bordered"
							placeholder="Code postal"
							bind:value={form.shippingPostalCode}
						/>
						<input
							type="text"
							class="input input-bordered"
							placeholder="Ville"
							bind:value={form.shippingCity}
						/>
						<input
							type="text"
							class="input input-bordered"
							placeholder="Pays"
							bind:value={form.shippingCountry}
						/>
					</div>
				</div>

				<div class="flex justify-end gap-2">
					<button
						type="button"
						class="btn"
						on:click={() => (addCustomerDrawerCheckbox.checked = false)}
					>
						Annuler
					</button>
					<button type="submit" class="btn btn-primary px-8"> Ajouter le client </button>
				</div>
			</form>
		</div>
	</div>
</div>
