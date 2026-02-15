<script>
	import { openModal } from '$lib/stores/modal';

	let email = '';
	let password = '';

	async function login() {
		const res = await fetch('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});

		if (res.ok) {
			window.location.href = '/dashboard'; // redirige après login
		} else {
			const data = await res.json();
			openModal('Erreur', data.error);
		}
	}
</script>

<form on:submit|preventDefault={login} class="flex items-center justify-center">
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
		<legend class="fieldset-legend">Connexion</legend>

		<label class="label">Email</label>
		<input type="email" class="input" bind:value={email} placeholder="Email" />

		<label class="label">Mot de passe</label>
		<input type="password" class="input" bind:value={password} placeholder="Mot de passe" />

		<button class="btn btn-neutral mt-4">Se connecter</button>
		<span>Pas encore de compte ? <a href="/auth/register" class="link">S'inscrire</a></span>
	</fieldset>
</form>
