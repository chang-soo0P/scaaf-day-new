// app/google-oauth-disclosure/page.tsx

export default function GoogleOAuthDisclosure() {
    return (
      <div className="prose mx-auto px-6 py-10">
        <h1>Google OAuth Restricted Scope Disclosure</h1>
        <p>Last updated: [날짜]</p>
  
        <h2>1. Why We Request Restricted Scopes</h2>
        <p>
          Scaaf.day accesses Gmail data solely to generate AI-based email summaries.
        </p>
  
        <h2>2. Data We Access</h2>
        <ul>
          <li>Metadata: sender, subject, snippet, date, message ID</li>
          <li>Email body (temporarily, non-stored) for summary creation</li>
        </ul>
  
        <h2>3. Data We Store</h2>
        <pre>id, gmail_id, subject, from, snippet, summary, actions, user_id, date</pre>
  
        <h2>4. Access Token Handling</h2>
        <ul>
          <li>Access Tokens are NOT stored</li>
          <li>Refresh Tokens are NOT used</li>
          <li>Tokens are discarded after each request</li>
        </ul>
  
        <h2>5. How We Use Gmail Data</h2>
        <p>To generate summaries and display email insights.</p>
  
        <h2>6. How We Do NOT Use Gmail Data</h2>
        <ul>
          <li>No advertising</li>
          <li>No data sale</li>
          <li>No human review</li>
          <li>No persistent background access</li>
        </ul>
  
        <h2>7. Data Security</h2>
        <p>
          TLS encryption, zero token storage, no email body storage, controlled DB access.
        </p>
  
        <h2>8. Policy Compliance</h2>
        <p>
          We comply with Google API Services User Data Policy:
          <a href="https://developers.google.com/terms/api-services-user-data-policy">
            Google User Data Policy
          </a>
        </p>
  
        <h2>9. Contact</h2>
        <p>Email: [운영자 이메일]</p>
      </div>
    );
  }
  