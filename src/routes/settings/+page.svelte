<script>
	import { openModal } from '$lib/stores/modal';
	import { onMount } from 'svelte';

	let data = {
		first_name: '',
		last_name: '',
		phone: '',
		email: '',
		address: '',
		postal_code: '',
		city: '',
		country: '',
		legal_form: '',
		siret: '',
		vat_number: '',
		iban: '',
		bic: '',
		company_name: '',
		self_employed: 0,
		invoice_template: 'default'
	};

	onMount(() => {
		getSettings();
	});

	async function getSettings() {
		try {
			const res = await fetch('');
			if (res.ok) {
				const json = await res.json();
				data = json.user || data;
				data.self_employed = data.self_employed === 1;
			} else {
				openModal('Erreur', 'Impossible de charger les paramètres.');
			}
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Une erreur est survenue lors du chargement.');
		}
	}

	async function updateSettings() {
		try {
			const res = await fetch('', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...data,
					self_employed: data.self_employed ? 1 : 0
				})
			});

			if (res.ok) {
				openModal('Succès', 'Paramètres mis à jour avec succès !');
			} else {
				openModal('Erreur', 'Impossible de mettre à jour les paramètres.');
			}
		} catch (err) {
			console.error(err);
			openModal('Erreur', 'Une erreur est survenue.');
		}
	}
</script>

<h1 class="text-4xl mb-4">Votre compte</h1>
<h2 class="text-2xl font-bold mb-6">Modifier vos informations</h2>

<form on:submit|preventDefault={updateSettings} class="space-y-6">
	<div class="card bg-base-300 p-6 space-y-4 shadow-xl">
		<h3 class="font-semibold text-lg border-b border-base-100 pb-2">Préférences de facturation</h3>

		<div class="form-control">
			<label class="label cursor-pointer justify-start gap-4">
				<input type="checkbox" class="checkbox" bind:checked={data.self_employed} />
				<span class="label-text">Je suis auto-entrepreneur (Pas de TVA)</span>
			</label>
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label"><span class="label-text">Modèle de facture par défaut</span></label>
			<select class="select select-bordered" bind:value={data.invoice_template}>
				<option value="default">Défaut</option>
				<option value="minimal">Minimaliste</option>
				<option value="corporate">Entreprise</option>
			</select>
		</div>

		<h3 class="font-semibold text-lg border-b border-base-100 pb-2 pt-4">
			Informations personnelles
		</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="form-control">
				<label class="label"><span class="label-text">Prénom</span></label>
				<input type="text" class="input input-bordered" bind:value={data.first_name} />
			</div>

			<div class="form-control">
				<label class="label"><span class="label-text">Nom</span></label>
				<input type="text" class="input input-bordered" bind:value={data.last_name} />
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="form-control">
				<label class="label"><span class="label-text">Email</span></label>
				<input type="email" class="input input-bordered" bind:value={data.email} required />
			</div>

			<div class="form-control">
				<label class="label"><span class="label-text">Téléphone</span></label>
				<input type="text" class="input input-bordered" bind:value={data.phone} />
			</div>
		</div>

		<h3 class="font-semibold text-lg border-b border-base-100 pb-2 pt-4">Adresse</h3>

		<div class="form-control">
			<label class="label"><span class="label-text">Adresse</span></label>
			<input type="text" class="input input-bordered" bind:value={data.address} />
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="form-control">
				<label class="label"><span class="label-text">Code postal</span></label>
				<input type="text" class="input input-bordered" bind:value={data.postal_code} />
			</div>
			<div class="form-control md:col-span-2">
				<label class="label"><span class="label-text">Ville</span></label>
				<input type="text" class="input input-bordered" bind:value={data.city} />
			</div>
		</div>

		<div class="form-control">
			<label class="label"><span class="label-text">Pays</span></label>
			<input type="text" class="input input-bordered" bind:value={data.country} />
		</div>

		<h3 class="font-semibold text-lg border-b border-base-100 pb-2 pt-4">
			Informations Légales & Bancaires
		</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="form-control">
				<label class="label"><span class="label-text">Nom de l'entreprise</span></label>
				<input type="text" class="input input-bordered" bind:value={data.company_name} />
			</div>
			<div class="form-control">
				<label class="label"><span class="label-text">Forme juridique</span></label>
				<input type="text" class="input input-bordered" bind:value={data.legal_form} />
			</div>
			<div class="form-control">
				<label class="label"><span class="label-text">SIRET</span></label>
				<input type="text" class="input input-bordered" bind:value={data.siret} />
			</div>
		</div>

		<div class="form-control">
			<label class="label"><span class="label-text">N° TVA Intracommunautaire</span></label>
			<input type="text" class="input input-bordered" bind:value={data.vat_number} />
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="form-control">
				<label class="label"><span class="label-text">IBAN</span></label>
				<input type="text" class="input input-bordered" bind:value={data.iban} />
			</div>
			<div class="form-control">
				<label class="label"><span class="label-text">BIC</span></label>
				<input type="text" class="input input-bordered" bind:value={data.bic} />
			</div>
		</div>

		<div class="pt-6">
			<button type="submit" class="btn btn-primary w-full">Enregistrer les modifications</button>
		</div>
	</div>
</form>
