/* Privacy Policy page */
export const metadata = {
  title: "Privacy Policy — AgentCheckout",
  description: "How AgentCheckout handles merchant, customer, and agent session data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <a href="/" className="text-sm text-neutral-400 no-underline">← AgentCheckout</a>
        <h1>Privacy Policy</h1>
        <p><em>Last updated: 19 April 2026</em></p>

        <p>
          AgentCheckout (&quot;we&quot;, &quot;us&quot;) operates agentcheckout.app and provides a hosted
          Model Context Protocol (MCP) endpoint service for e-commerce merchants. This policy
          explains what data we collect, why, and how we handle it.
        </p>

        <h2>1. Data we collect</h2>
        <h3>From merchants</h3>
        <ul>
          <li>Account data: store name, store URL, work email, company name.</li>
          <li>Store integration data: API credentials / OAuth tokens for your storefront platform.</li>
          <li>Catalogue data: product titles, descriptions, prices, variants, inventory counts.</li>
        </ul>
        <h3>From agent sessions</h3>
        <ul>
          <li>Anonymised agent identifiers, tool calls made, inputs, timestamps.</li>
          <li>Cart and order data when a checkout completes.</li>
        </ul>
        <h3>From website visitors</h3>
        <ul>
          <li>Standard server logs and privacy-friendly analytics (no identifying cookies).</li>
        </ul>

        <h2>2. Why we collect it</h2>
        <p>
          To provision and operate your MCP endpoint, to let AI agents search your catalogue and
          complete checkout, to secure the service, to show you a dashboard of agent activity,
          and to improve the product (aggregate and anonymised only).
        </p>
        <p>We do not sell your data. We do not train AI models on your data.</p>

        <h2>3. Payment data</h2>
        <p>
          We never store full payment card numbers. Payment processing is handled by Razorpay,
          MoltPe, or (when enabled) Stripe. Their privacy policies apply to the payment step.
        </p>

        <h2>4. Data sharing</h2>
        <p>
          We share data only with infrastructure providers (hosting, database, monitoring),
          payment processors you have enabled, and legal authorities when required by law.
        </p>

        <h2>5. Data retention</h2>
        <ul>
          <li>Account data: retained while your account is active; deleted within 30 days of closure.</li>
          <li>Agent session logs: 90 days, then anonymised.</li>
          <li>Order data: retained as required by tax and e-commerce law.</li>
        </ul>

        <h2>6. Your rights</h2>
        <p>
          You can export your data, delete your account, revoke agent tokens, or request correction
          at privacy@agentcheckout.app. EU/UK residents: GDPR rights apply.
        </p>

        <h2>7. Security</h2>
        <p>TLS for all connections, encrypted storage at rest, scoped tokens, least-privilege access.</p>

        <h2>8. International transfers</h2>
        <p>
          Data is processed in India and the United States. Cross-border transfers use appropriate
          safeguards where required.
        </p>

        <h2>9. Children</h2>
        <p>The service is not intended for users under 18.</p>

        <h2>10. Changes</h2>
        <p>We will notify account holders of material changes by email.</p>

        <h2>11. Contact</h2>
        <p><a href="mailto:privacy@agentcheckout.app">privacy@agentcheckout.app</a></p>
      </div>
    </main>
  );
}
