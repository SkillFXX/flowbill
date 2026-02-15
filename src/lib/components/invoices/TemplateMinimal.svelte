<script>
	import { formatPrice, formatDate } from '$lib/utils';
	export let invoice;

	$: content = typeof invoice.content === 'string' ? JSON.parse(invoice.content) : invoice.content;
	$: client = content.client;
	$: items = content.items;
	$: settings = content.settings || {};
	$: user = invoice.user;
</script>

<div class="p-8 max-w-4xl mx-auto bg-white text-black font-mono text-sm leading-relaxed">
	<!-- Header -->
	<div class="border-b-2 border-black pb-8 mb-8">
		<h1 class="text-4xl font-bold mb-4">FACTURE #{invoice.number}</h1>
		<div class="flex justify-between">
			<div>
				<p class="font-bold">ÉMETTEUR</p>
				<p>{user.company_name || user.first_name + ' ' + user.last_name}</p>
				<p>{user.email}</p>
			</div>
			<div class="text-right">
				<p>Date: {formatDate(invoice.date)}</p>
				<p>Échéance: {formatDate(invoice.due_date)}</p>
			</div>
		</div>
	</div>

	<!-- Client -->
	<div class="mb-8">
		<p class="font-bold mb-2">CLIENT</p>
		<p>{client.company_name || client.first_name + ' ' + client.last_name}</p>
		<p>{client.billing_address}</p>
		<p>{client.billing_postal_code} {client.billing_city}</p>
	</div>

	<!-- Items -->
	<div class="mb-8">
		{#each items as item}
			<div class="flex justify-between py-2 border-b border-gray-200 border-dashed">
				<div class="flex-1">
					<span class="font-bold">{item.name}</span>
					<span class="text-gray-500 ml-2">x{item.quantity}</span>
				</div>
				<div class="text-right">
					{formatPrice(item.price * item.quantity)}
				</div>
			</div>
		{/each}
	</div>

	<!-- Totals -->
	<div class="flex justify-end p-4 bg-gray-100">
		<div class="w-64">
			<div class="flex justify-between">
				<span>HT:</span>
				<span>{formatPrice(invoice.total_ht)}</span>
			</div>
			{#if !settings.self_employed}
				<div class="flex justify-between">
					<span>TVA:</span>
					<span>{formatPrice(invoice.total_tax)}</span>
				</div>
			{/if}
			<div class="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-black">
				<span>TOTAL TTC:</span>
				<span>{formatPrice(invoice.total_ttc)}</span>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<div class="mt-12 text-center text-xs">
		{#if settings.self_employed}
			<p>TVA non applicable, art. 293 B du CGI</p>
		{/if}
		<p class="mt-2">Merci de votre confiance.</p>
	</div>
</div>
