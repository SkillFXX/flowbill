<script>
	let email = '';
	let password = '';

	async function register() {
		const res = await fetch('/auth/register', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (res.ok) alert('Compte créé ! Vous pouvez vous connecter.');
		else alert(data.error);
	}
</script>

<form on:submit|preventDefault={register} class="flex items-center justify-center">
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
		<legend class="fieldset-legend">Inscription</legend>

		<label class="label">Email</label>
		<input type="email" class="input" bind:value={email} placeholder="Email" />

		<label class="label">Mot de passe</label>
		<input type="password" class="input" bind:value={password} placeholder="Mot de passe" />

		<button class="btn btn-neutral mt-4">Créer compte</button>
		<span>Déja inscrit ? <a href="/auth/login" class="link">Se connecter</a></span>
	</fieldset>
</form>
