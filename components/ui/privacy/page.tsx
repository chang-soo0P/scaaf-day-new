import React from "react";
import Markdown from "react-markdown";

const privacyText = `
# Privacy Policy
_Last updated: January 2025_

Scaaf (“we”, “our”, “the Service”) is committed to protecting your privacy.  
This Policy explains how we collect, use, disclose, store, and protect your data in compliance with:
- GDPR (EU)
- CCPA (California)
- Korea Personal Information Protection Act (PIPA)
- Other relevant data protection laws

---

## 1. Information We Collect

### 1.1 Google Account Information
When you sign in using Google OAuth, we collect:
- Name
- Email address
- Profile image
- OAuth access and refresh tokens

Tokens are encrypted and stored securely.

---

### 1.2 Gmail Data
With your explicit consent, we access:
- Email subjects  
- Sender/recipient  
- Message body text  
- Metadata (timestamps, labels, thread info)  
- Text-based attachments (for summarization only)

We do **not** permanently store full raw emails unless required for features you explicitly enable.

---

### 1.3 Usage Data
We may collect:
- Clickstream events
- Device information
- Browser type
- Feature usage logs

Used solely to improve service quality.

---

## 2. How We Use Your Information
We use your data to:
- Generate AI-based summaries using OpenAI
- Provide personalized insights
- Support secure authentication
- Improve platform performance

---

## 3. Legal Basis (GDPR)
We process data based on:
- Your **consent** (Google OAuth, Gmail scopes)
- **Performance of contract**
- **Legitimate interests** (security, product improvement)

---

## 4. Data Sharing
We **do not** sell or rent your data.

We may share with:
- OpenAI (for AI summarization)
- Supabase (database provider)
- Google OAuth / Gmail API
- Analytics providers (aggregated data only)

All transfers use:
- Encryption  
- SCC (Standard Contractual Clauses)  
- DPAs as required  

---

## 5. International Data Transfers
Your data may be processed in the USA, EU, South Korea, or other regions.

---

## 6. Data Retention

| Data Type | Retention |
|-----------|-----------|
| AI summaries | Until deleted |
| Tokens | Until revoked |
| Logs | 30–90 days |
| Metadata | While account active |

---

## 7. Your Rights
You may:
- Request your data  
- Delete summaries  
- Withdraw Gmail access  
- Request account deletion  
- Request data export  

Contact: **privacy@scaaf.day**

---

## 8. Children’s Privacy
Not intended for users under 18.

---

## 9. Cookie Policy
We use essential cookies, preference cookies, and analytics cookies.  
You may disable cookies in your browser.

---

## 10. Contact
**privacy@scaaf.day**
`;

export default function PrivacyPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto py-10 px-5">
      <Markdown>{privacyText}</Markdown>
    </div>
  );
}
