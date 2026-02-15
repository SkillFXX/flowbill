<script>
	import GlobalModal from '$lib/components/GlobalModal.svelte';
	import '../app.css';
</script>

<div class="navbar bg-base-100 shadow-sm print:hidden">
	<div class="flex-1">
		<a href="/dashboard" class="btn btn-ghost text-xl">FlowBill</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/invoice">Facturer</a></li>
			<li><a href="/invoices">Historique</a></li>
			<li><a href="/products">Produits</a></li>
			<li><a href="/customers">Clients</a></li>
			<li><a href="/settings">Paramètres</a></li>
		</ul>
	</div>
</div>

<div class="max-w-5xl mx-auto px-4 m-8">
	<slot />
</div>
<GlobalModal />
