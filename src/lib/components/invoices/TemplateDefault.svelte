<script>
	import { formatPrice, formatDate } from '$lib/utils';
	export let invoice;

	// Parse content if it's a string (though it should be parsed by parent)
	$: content = typeof invoice.content === 'string' ? JSON.parse(invoice.content) : invoice.content;
	$: client = content.client;
	$: items = content.items;
	$: settings = content.settings || {};
	$: user = invoice.user; // We need to pass user info to the template too (the issuer)
</script>

<div class="p-8 max-w-4xl mx-auto bg-white text-black text-sm">
	<!-- Header -->
	<div class="flex justify-between items-start mb-12">
		<div>
			<h1 class="text-3xl font-bold text-primary mb-2">FACTURE</h1>
			<p class="text-gray-600">N° {invoice.number}</p>
			<p class="text-gray-600">Date : {formatDate(invoice.date)}</p>
		</div>
		<div class="text-right">
			<h2 class="font-bold text-lg">
				{user.company_name || user.first_name + ' ' + user.last_name}
			</h2>
			<p>{user.address}</p>
			<p>{user.postal_code} {user.city}</p>
			<p>{user.country}</p>
			{#if user.siret}<p>SIRET: {user.siret}</p>{/if}
			{#if user.email}<p>{user.email}</p>{/if}
		</div>
	</div>

	<!-- Client Info -->
	<div class="mb-12 p-6 bg-gray-50 rounded-lg">
		<h3 class="text-gray-500 text-xs uppercase font-bold mb-2">Facturé à :</h3>
		<p class="font-bold text-lg">
			{client.company_name || client.first_name + ' ' + client.last_name}
		</p>
		<p>{client.billing_address}</p>
		<p>{client.billing_postal_code} {client.billing_city}</p>
		<p>{client.billing_country}</p>
		{#if client.vat_number}<p>TVA: {client.vat_number}</p>{/if}
	</div>

	<!-- Items -->
	<table class="w-full mb-8">
		<thead>
			<tr class="border-b-2 border-gray-200">
				<th class="text-left py-3">Description</th>
				<th class="text-right py-3">Qté</th>
				<th class="text-right py-3">Prix Unit. HT</th>
				{#if !settings.auto_entrepreneur}
					<th class="text-right py-3">TVA</th>
				{/if}
				<th class="text-right py-3">Total HT</th>
			</tr>
		</thead>
		<tbody>
			{#each items as item}
				<tr class="border-b border-gray-100">
					<td class="py-3">{item.name}</td>
					<td class="text-right py-3">{item.quantity}</td>
					<td class="text-right py-3">{formatPrice(item.price)}</td>
					{#if !settings.auto_entrepreneur}
						<td class="text-right py-3">{item.vatRate}%</td>
					{/if}
					<td class="text-right py-3">{formatPrice(item.price * item.quantity)}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- Totals -->
	<div class="flex justify-end mb-12">
		<div class="w-1/2">
			<div class="flex justify-between py-2 border-b border-gray-100">
				<span>Total HT</span>
				<span>{formatPrice(invoice.total_ht)}</span>
			</div>
			{#if !settings.auto_entrepreneur}
				<div class="flex justify-between py-2 border-b border-gray-100">
					<span>Total TVA</span>
					<span>{formatPrice(invoice.total_tax)}</span>
				</div>
			{/if}
			<div class="flex justify-between py-2 font-bold text-xl mt-2">
				<span>Total TTC</span>
				<span>{formatPrice(invoice.total_ttc)}</span>
			</div>
		</div>
	</div>

	<!-- Footer / Legal -->
	<div class="text-xs text-gray-500 mt-12 pt-8 border-t border-gray-200">
		<p>Échéance : {formatDate(invoice.due_date)}</p>
		{#if settings.auto_entrepreneur}
			<p class="mt-1 font-bold">TVA non applicable, art. 293 B du CGI</p>
		{/if}
		{#if user.iban}
			<p class="mt-2">IBAN: {user.iban} | BIC: {user.bic}</p>
		{/if}
	</div>
</div>
