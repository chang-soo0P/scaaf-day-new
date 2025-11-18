import React from "react";
import Markdown from "react-markdown";

const termsText = `
# Terms of Service
_Last updated: January 2025_

Welcome to **Scaaf (scaaf.day)**.  
By accessing or using this service, you agree to the following Terms.

---

## 1. Overview
Scaaf is an AI-powered email summarization and productivity platform.  
The Service retrieves Gmail data (with consent), processes it using AI, and provides insights.

---

## 2. Eligibility
You must be 18+ and legally capable of authorizing Gmail access.

---

## 3. Acceptable Use
You may not:
- Use the Service illegally  
- Attempt unauthorized access  
- Reverse-engineer the system  
- Abuse Gmail data  

---

## 4. Gmail Access
By signing in via Google OAuth, you authorize Scaaf to:
- Read Gmail messages
- Analyze content via AI
- Store summaries and metadata
- Maintain encrypted tokens

We do **not**:
- Send emails on your behalf
- Permanently store full raw emails without your action
- Access data outside Gmail

You may revoke access anytime:  
https://myaccount.google.com/permissions

---

## 5. AI-Generated Content
Summaries may be inaccurate.  
AI results do not constitute legal, financial, or professional advice.

---

## 6. Data Storage
Stored securely:
- Summaries  
- Metadata  
- Encrypted OAuth tokens  

---

## 7. Payments
Premium features may require a subscription.

---

## 8. Termination
We may suspend access for violations or abnormal activity.

---

## 9. Disclaimers
The Service is provided “as is" without warranties.

---

## 10. Limitation of Liability
We are not liable for:
- Losses from reliance on AI content  
- Gmail API failures  
- Service outages  

---

## 11. Governing Law
Governed by the laws of the Republic of Korea.

---

## 12. Contact
**support@scaaf.day**
`;

export default function TermsPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto py-10 px-5">
      <Markdown>{termsText}</Markdown>
    </div>
  );
}
