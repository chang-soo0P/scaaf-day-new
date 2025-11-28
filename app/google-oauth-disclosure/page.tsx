export default function OAuthDisclosurePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 space-y-8">

        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-indigo-700">Google OAuth Restricted Scope Disclosure</h1>
          <p className="text-sm text-gray-500">Last updated: November 20, 2025</p>
        </header>

        <section className="space-y-6 text-gray-700 leading-relaxed">

          <div>
            <h2 className="font-semibold text-lg text-gray-900">1. Why We Request Restricted Scopes</h2>
            <p>Scaaf.day accesses Gmail data solely to generate AI-based email summaries.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">2. Data We Access</h2>
            <p>Metadata: sender, subject, snippet, date, message ID.</p>
            <p>Email body is accessed temporarily for summary creation but NOT stored.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">3. Data We Store</h2>
            <p>id, gmail_id, subject, from, snippet, summary, actions, user_id, date</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">4. Access Token Handling</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access Tokens are NOT stored.</li>
              <li>Refresh Tokens are NOT used.</li>
              <li>Tokens are discarded after each request.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">6. How We Do NOT Use Gmail Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>No advertising</li>
              <li>No data sale</li>
              <li>No human review</li>
              <li>No persistent background access</li>
            </ul>
          </div>

        </section>

        <footer className="text-center text-sm text-gray-600 pt-4">
          Contact: <span className="font-semibold">support@scaaf.day</span>
        </footer>

      </div>
    </main>
  )
}
