export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 space-y-8">

        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-indigo-700">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: November 20, 2025</p>
        </header>

        <section className="space-y-6 text-gray-700 leading-relaxed">

          <div>
            <h2 className="font-semibold text-lg text-gray-900">1. Data We Collect</h2>
            <p>
              We temporarily access email content to generate summaries, but we store only metadata:
              id, gmail_id, subject, from, snippet, summary, actions, user_id, date.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Access Token Policy</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>We do NOT store Access Tokens.</li>
              <li>We do NOT store Refresh Tokens.</li>
              <li>Tokens are used once and immediately discarded.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">1.2 Technical Data</h2>
            <p>We use server-side logging only. No cookies are used for tracking.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">1.3 AI Processing</h2>
            <p>Email content is securely transmitted to OpenAI for summary generation.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">2. How We Use Data</h2>
            <p>To provide email summaries, improve performance, and enhance user experience.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">4. Data Storage & Transfers</h2>
            <p>
              Data is stored in Supabase (Sydney region). Additional processing occurs through
              Vercel (US) and OpenAI (US).
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">5. Data Retention</h2>
            <p>Metadata is retained until you request deletion or your account is removed.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">6. Data Security</h2>
            <p>We use TLS encryption, do not store tokens, and apply secure DB access controls.</p>
          </div>

        </section>

        <footer className="text-center text-sm text-gray-600 pt-4">
          Contact: <span className="font-semibold">support@scaaf.day</span>
        </footer>

      </div>
    </main>
  )
}
