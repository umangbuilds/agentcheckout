/* Terms of Service page */
export const metadata = {
  title: "Terms of Service — AgentCheckout",
  description: "Terms governing use of AgentCheckout.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto prose prose-invert">
        <a href="/" className="text-sm text-neutral-400 no-underline">← AgentCheckout</a>
        <h1>Terms of Service</h1>
        <p><em>Last updated: 19 April 2026</em></p>

        <h2>1. Service description</h2>
        <p>
          AgentCheckout provides a hosted Model Context Protocol (MCP) endpoint that lets AI
          agents search, add to cart, and check out on your e-commerce store.
        </p>

        <h2>2. Beta service</h2>
        <p>
          The service is in public beta. Features may change. We offer no uptime guarantee during
          beta. In return the service is free for beta merchants.
        </p>

        <h2>3. Eligibility</h2>
        <p>
          You must be at least 18, authorised to bind your business, and operate a legitimate
          e-commerce store.
        </p>

        <h2>4. Your responsibilities</h2>
        <ul>
          <li>Provide accurate information and valid credentials.</li>
          <li>Comply with your storefront platform&apos;s terms.</li>
          <li>Handle fulfilment, returns, and taxes on orders placed through agents.</li>
        </ul>

        <h2>5. Acceptable use</h2>
        <p>
          Do not circumvent rate limits, send spam or fraudulent traffic, attempt to exfiltrate
          other merchants&apos; data, or reverse-engineer to replicate commercially.
        </p>

        <h2>6. Intellectual property</h2>
        <p>
          You retain all rights to your store and customer data. You grant us a limited licence
          to process it solely to operate the service. We retain all rights to the AgentCheckout
          platform, code, brand, and MCP tool definitions.
        </p>

        <h2>7. Fees</h2>
        <p>
          The service is free during beta. We will give at least 30 days&apos; notice before
          introducing paid plans. Founding beta merchants get preferential pricing.
        </p>

        <h2>8. Termination</h2>
        <p>
          You may terminate at any time by deleting your account. We may suspend or terminate for
          breach of these terms, misuse, or insolvency.
        </p>

        <h2>9. Disclaimers</h2>
        <p>
          The service is provided &quot;as is&quot; to the fullest extent permitted by law.
        </p>

        <h2>10. Limitation of liability</h2>
        <p>
          Our aggregate liability is limited to the greater of (a) INR 10,000 or (b) fees paid in
          the 12 months preceding the claim. We are not liable for indirect, incidental, or
          consequential damages.
        </p>

        <h2>11. Indemnification</h2>
        <p>
          You will indemnify AgentCheckout against third-party claims arising from your store
          content, products, customer interactions, or breach of these terms.
        </p>

        <h2>12. Governing law</h2>
        <p>
          These terms are governed by the laws of India. Disputes are subject to the exclusive
          jurisdiction of the courts in Bangalore, Karnataka, India.
        </p>

        <h2>13. Changes</h2>
        <p>Material changes will be communicated by email with at least 14 days&apos; notice.</p>

        <h2>14. Contact</h2>
        <p><a href="mailto:legal@agentcheckout.app">legal@agentcheckout.app</a></p>
      </div>
    </main>
  );
}
