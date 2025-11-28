export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-8 space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-indigo-700">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: November 20, 2025</p>
        </header>

        <section className="space-y-6 text-gray-700 leading-relaxed">

          <div>
            <h2 className="font-semibold text-lg text-gray-900">1. Service Overview</h2>
            <p>Scaaf.day provides an AI-powered email summarization and organization tool that connects to your Gmail account via Google OAuth.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">2. Eligibility</h2>
            <p>You must be legally able to create and use an email account to use this Service.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">3. Account & Security</h2>
            <p>We do not store your Google password, access token, or refresh token.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">4. Acceptable Use</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>No reverse engineering</li>
              <li>No unlawful use</li>
              <li>No service disruption</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">5. Gmail Integration & Permissions</h2>
            <p>We store only metadata: gmail_id, subject, from, snippet, summary, actions, user_id, date.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">6. Intellectual Property</h2>
            <p>All software, trademarks, and service materials remain our property.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">7. Service Modifications</h2>
            <p>We may modify or discontinue the Service at any time.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">8. Disclaimer</h2>
            <p>The Service is provided “as is” without warranties.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">9. Limitation of Liability</h2>
            <p>We are not responsible for indirect damages or third-party actions.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-900">10. Governing Law</h2>
            <p>These Terms are governed by the laws of the Republic of Korea.</p>
          </div>

        </section>

        <footer className="text-center text-sm text-gray-600 pt-4">
          Contact: <span className="font-semibold">support@scaaf.day</span>
        </footer>
      </div>
    </main>
  )
}
