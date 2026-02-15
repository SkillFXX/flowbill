<script>
	export let data;

	async function logout() {
		await fetch('/auth/logout', { method: 'POST' });
		window.location.href = '/auth/login';
	}
</script>

<h1 class="text-5xl font-bold">Bienvenue, utilisateur {data.userId}</h1>

<div>
	<p>Accédez à vos factures, clients et produits depuis les liens ci-dessous :</p>

	<div class="mt-6 space-x-4">
		<a href="/invoice" class="btn btn-primary">Créer une nouvelle facture</a>
		<a href="/invoices" class="btn btn-secondary">Mes factures</a>
		<a href="/customers" class="btn btn-secondary">Mes clients</a>
		<a href="/products" class="btn btn-secondary">Mes produits</a>
		<a href="/settings" class="btn btn-secondary">Paramètres du compte</a>
	</div>
</div>

<button on:click={logout} class="link mt-8">Se déconnecter</button>
