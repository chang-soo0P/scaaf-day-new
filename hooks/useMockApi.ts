import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { EmailSummary, DigestItem, Recommendation, ActionItem, ExtractedEvent } from "@/lib/types"

// Mock data - DISABLED FOR PRODUCTION
/*
const mockEmails: EmailSummary[] = [
  {
    id: "1",
    subject: "Weekly Tech Digest - AI Breakthroughs",
    sender: "TechCrunch",
    senderEmail: "newsletter@techcrunch.com",
    date: "2024-01-15T09:00:00Z",
    receivedAt: "2024-01-15T09:00:00Z",
    snippet: "Latest AI developments including GPT-5 rumors, new robotics advances, and startup funding news.",
    originalContent: `Dear Tech Enthusiasts,

This week has been absolutely incredible for AI developments! Here are the key highlights:

🚀 GPT-5 Development Updates
OpenAI insiders hint at significant breakthroughs in reasoning capabilities. The new model is expected to handle complex multi-step problems with unprecedented accuracy.

🤖 Robotics Revolution
Boston Dynamics announced their latest humanoid robot with improved dexterity and natural language processing. The robot can now perform complex household tasks and engage in meaningful conversations.

💰 Startup Funding News
- AI startup Anthropic raises $100M Series B
- Computer vision company Perceptive AI secures $50M funding
- Robotics startup Figure AI closes $70M round

🔬 Research Breakthroughs
MIT researchers developed a new neural architecture that reduces training time by 80% while improving accuracy. This could revolutionize how we approach large language model training.

Stay tuned for more exciting developments!

Best regards,
The TechCrunch Team`,
    summary:
      "Weekly roundup of AI breakthroughs including GPT-5 development rumors, robotics advances, and major startup funding announcements.",
    isRead: false,
    isStarred: true,
    labels: ["newsletters", "tech"],
  },
  {
    id: "2",
    subject: "Design System Updates - Figma 2024",
    sender: "Figma",
    senderEmail: "updates@figma.com",
    date: "2024-01-14T14:30:00Z",
    receivedAt: "2024-01-14T14:30:00Z",
    snippet: "New component variants, improved auto-layout, and collaboration features for better design workflows.",
    originalContent: `Hello Designers,

We're excited to announce major updates to Figma that will transform your design workflow:

✨ Component Variants 2.0
Create more flexible and maintainable design systems with our enhanced variant system. Now supports nested variants and conditional properties.

📐 Auto-Layout Improvements
- Better spacing controls
- Improved text wrapping
- Enhanced responsive behavior
- New alignment options

🤝 Enhanced Collaboration
- Real-time cursor tracking
- Improved commenting system
- Better version history
- Team library sync improvements

🎨 New Features
- Advanced prototyping animations
- Improved developer handoff
- Enhanced accessibility tools
- Performance optimizations

These updates are rolling out to all users over the next week.

Happy designing!
The Figma Team`,
    summary:
      "Major Figma updates including enhanced component variants, improved auto-layout, and better collaboration features for design teams.",
    isRead: true,
    isStarred: false,
    labels: ["updates", "design"],
  },
  {
    id: "3",
    subject: "Q4 Marketing Performance Report",
    sender: "Sarah Johnson",
    senderEmail: "sarah.johnson@company.com",
    date: "2024-01-13T16:45:00Z",
    receivedAt: "2024-01-13T16:45:00Z",
    snippet:
      "Our Q4 campaigns exceeded expectations with 25% increase in conversion rates and 40% growth in organic traffic.",
    originalContent: `Hi Team,

I'm thrilled to share our Q4 marketing performance results - we've exceeded all expectations!

📈 Key Metrics:
- Conversion Rate: +25% (from 3.2% to 4.0%)
- Organic Traffic: +40% year-over-year
- Email Open Rate: +18%
- Social Media Engagement: +35%
- Cost per Acquisition: -22%

🎯 Top Performing Campaigns:
1. "Future of Work" content series - 45% engagement rate
2. Product demo webinars - 60% conversion rate
3. Customer success stories - 38% click-through rate

💡 Key Insights:
- Video content performed 3x better than static posts
- Personalized email campaigns had 2x higher open rates
- LinkedIn generated highest quality leads

🚀 Q1 2024 Strategy:
Based on these results, we'll double down on video content and personalized campaigns. I'll have the detailed Q1 plan ready by January 30th.

Great work everyone!
Sarah`,
    summary:
      "Q4 marketing exceeded expectations with 25% conversion increase, 40% organic traffic growth, and significant improvements across all key metrics.",
    isRead: false,
    isStarred: true,
    labels: ["work", "reports"],
  },
  {
    id: "4",
    subject: "Product Launch: New Dashboard Features",
    sender: "Product Team",
    senderEmail: "product@startup.com",
    date: "2024-01-12T11:20:00Z",
    receivedAt: "2024-01-12T11:20:00Z",
    snippet: "Exciting new analytics dashboard with real-time data visualization and custom reporting capabilities.",
    originalContent: `Hello Everyone,

We're excited to announce the launch of our new analytics dashboard! Here's what's new:

📊 Real-Time Data Visualization
- Interactive charts and graphs
- Customizable dashboards
- Enhanced data filtering options

📅 Custom Reporting
- Create and schedule custom reports
- Export reports to PDF and Excel
- Share reports with team members

🔧 Technical Improvements
- Improved performance and stability
- Enhanced security features
- Better integration with other tools

These features are now available in your account. Let us know what you think!

Best regards,
Product Team`,
    summary: "Launch of a new analytics dashboard with real-time data visualization and custom reporting capabilities.",
    isRead: true,
    isStarred: false,
    labels: ["product", "updates"],
  },
  {
    id: "5",
    subject: "Conference Invitation: AI Summit 2024",
    sender: "AI Summit",
    senderEmail: "events@aisummit.com",
    date: "2024-01-11T08:15:00Z",
    receivedAt: "2024-01-11T08:15:00Z",
    snippet:
      "Join industry leaders for three days of AI innovation, networking, and hands-on workshops. Early bird pricing ends soon.",
    originalContent: `Dear Participants,

We're thrilled to invite you to the AI Summit 2024! This is your chance to be part of the most exciting AI event of the year.

📅 Event Dates:
- January 25th - 27th, 2024

📍 Venue:
Convention Center, Downtown City

🕒 Schedule:
- Keynote Speeches: 9:00 AM - 12:00 PM
- Workshops: 1:00 PM - 5:00 PM
- Networking Sessions: 6:00 PM - 8:00 PM

🌟 Highlights:
- Industry leaders sharing insights
- Hands-on workshops on AI applications
- Networking opportunities with peers and experts

💰 Early Bird Pricing:
- Ends January 18th, 2024

RSVP now to secure your spot!

Best regards,
AI Summit Team`,
    summary: "Invitation to the AI Summit 2024 with keynote speeches, workshops, and networking sessions.",
    isRead: false,
    isStarred: true,
    labels: ["events", "ai"],
  },
  {
    id: "6",
    subject: "Weekly Newsletter: Design Inspiration",
    sender: "Design Weekly",
    senderEmail: "hello@designweekly.com",
    date: "2024-01-10T07:30:00Z",
    receivedAt: "2024-01-10T07:30:00Z",
    snippet:
      "This week's curated collection of stunning UI designs, typography trends, and creative portfolios from around the world.",
    originalContent: `Hello Designers,

Welcome to this week's Design Weekly newsletter! Here are some of the most inspiring designs and trends:

🎨 UI Designs:
- Minimalist design by Studio A
- Bold and colorful design by Studio B
- Clean and functional design by Studio C

📚 Typography Trends:
- Futuristic fonts gaining popularity
- Retro fonts making a comeback
- Handwritten fonts for a personal touch

💼 Creative Portfolios:
- Explore the latest work from top designers
- Discover emerging talent in the design community
- Get inspired by diverse design styles

Stay creative and keep designing!

Best regards,
Design Weekly Team`,
    summary:
      "Curated collection of stunning UI designs, typography trends, and creative portfolios showcasing innovative design approaches.",
    isRead: true,
    isStarred: false,
    labels: ["newsletters", "design"],
  },
  {
    id: "7",
    subject: "Team Meeting Notes - Sprint Planning",
    sender: "Alex Chen",
    senderEmail: "alex.chen@company.com",
    date: "2024-01-09T15:00:00Z",
    receivedAt: "2024-01-09T15:00:00Z",
    snippet:
      "Sprint planning session notes with user story priorities, technical debt items, and timeline estimates for next quarter.",
    originalContent: `Hi Team,

Here are the notes from our sprint planning session:

📋 User Story Priorities:
1. Implement new authentication system
2. Optimize dashboard performance
3. Enhance email notifications

🛠️ Technical Debt Items:
- Refactor legacy code
- Update dependencies
- Improve testing coverage

📅 Timeline Estimates:
- Authentication system: 2 weeks
- Dashboard optimization: 3 weeks
- Email notifications: 1 week

Let's get started on these tasks!

Best regards,
Alex`,
    summary:
      "Sprint planning session notes with user story priorities, technical debt items, and timeline estimates for next quarter.",
    isRead: false,
    isStarred: false,
    labels: ["work", "meetings"],
  },
  {
    id: "8",
    subject: "Customer Success Story: 300% Growth",
    sender: "Customer Success",
    senderEmail: "success@platform.com",
    date: "2024-01-08T13:45:00Z",
    receivedAt: "2024-01-08T13:45:00Z",
    snippet:
      "Learn how TechCorp achieved 300% user growth using our platform's advanced analytics and automation features.",
    originalContent: `Dear Customers,

We're excited to share a success story with you! TechCorp has achieved 300% user growth using our platform.

📈 Growth Metrics:
- User Base: +300%
- Engagement Rate: +45%
- Retention Rate: +20%

💡 Success Factors:
- Advanced analytics tools
- Automation features
- Personalized user experiences

Read the full case study to learn more!

Best regards,
Customer Success Team`,
    summary: "TechCorp achieved 300% user growth using advanced analytics and automation features.",
    isRead: true,
    isStarred: true,
    labels: ["success", "case-study"],
  },
  {
    id: "9",
    subject: "Security Alert: New Authentication Features",
    sender: "Security Team",
    senderEmail: "security@company.com",
    date: "2024-01-07T10:30:00Z",
    receivedAt: "2024-01-07T10:30:00Z",
    snippet:
      "Important security updates including two-factor authentication, SSO integration, and enhanced password policies.",
    originalContent: `Dear Team,

We have some important security updates for you:

🔒 Two-Factor Authentication
Enable two-factor authentication for an extra layer of security.

🌐 Single Sign-On Integration
Integrate SSO for seamless access across multiple platforms.

🔑 Enhanced Password Policies
- Minimum password length increased to 12 characters
- Password complexity requirements updated

Please update your settings as soon as possible.

Best regards,
Security Team`,
    summary:
      "Important security updates including two-factor authentication, SSO integration, and enhanced password policies.",
    isRead: false,
    isStarred: true,
    labels: ["security", "updates"],
  },
  {
    id: "10",
    subject: "Industry Report: Remote Work Trends 2024",
    sender: "Future of Work",
    senderEmail: "research@futureofwork.com",
    date: "2024-01-06T09:00:00Z",
    receivedAt: "2024-01-06T09:00:00Z",
    snippet:
      "Comprehensive analysis of remote work adoption, productivity metrics, and emerging collaboration tools shaping the future workplace.",
    originalContent: `Hello Everyone,

We've released the Remote Work Trends 2024 report! Here are some key findings:

📈 Adoption Rates:
- 75% of companies now offer remote work options
- 50% of employees prefer remote work

📊 Productivity Metrics:
- Average productivity increase of 10%
- Reduced commute time and stress

🛠️ Emerging Tools:
- Collaboration platforms like Slack and Microsoft Teams
- Project management tools like Asana and Trello
- Virtual meeting software like Zoom and Google Meet

Download the full report for more insights!

Best regards,
Future of Work Team`,
    summary:
      "Comprehensive analysis of remote work adoption, productivity metrics, and emerging collaboration tools shaping the future workplace.",
    isRead: true,
    isStarred: false,
    labels: ["research", "remote-work"],
  },
]

const mockDigestItems: DigestItem[] = [
  {
    emailId: "1",
    title: "AI Breakthroughs This Week",
    summary:
      "GPT-5 development rumors surface from OpenAI insiders. New robotics company raises $50M Series A. Meta announces improved language models.",
    actions: [
      {
        type: "link",
        text: "Read full GPT-5 analysis",
        url: "https://example.com/gpt5-analysis",
        priority: "high",
        completed: false,
      },
      {
        type: "deadline",
        text: "Submit AI conference proposal",
        dueDate: "2024-01-20T23:59:00Z",
        priority: "medium",
        completed: false,
      },
    ],
    importance: "high",
    source: "TechCrunch",
  },
  {
    emailId: "2",
    title: "Design System Revolution",
    summary:
      "Figma introduces game-changing component variants and auto-layout improvements. New collaboration features streamline design handoffs.",
    actions: [
      {
        type: "event",
        text: "Figma Config 2024 keynote",
        dueDate: "2024-01-25T15:00:00Z",
        priority: "medium",
        completed: false,
      },
    ],
    importance: "medium",
    source: "Figma",
  },
  {
    emailId: "3",
    title: "Marketing Performance Surge",
    summary:
      "Q4 campaigns delivered exceptional results with 25% conversion increase. Organic traffic grew 40% year-over-year across all channels.",
    actions: [
      {
        type: "deadline",
        text: "Prepare Q1 marketing strategy",
        dueDate: "2024-01-30T17:00:00Z",
        priority: "high",
        completed: false,
      },
    ],
    importance: "high",
    source: "Sarah Johnson",
  },
  {
    emailId: "4",
    title: "Dashboard Analytics Launch",
    summary:
      "New real-time analytics dashboard with custom reporting capabilities. Enhanced data visualization tools for better decision making.",
    actions: [
      {
        type: "link",
        text: "Explore new dashboard features",
        url: "https://example.com/dashboard",
        priority: "medium",
        completed: false,
      },
    ],
    importance: "medium",
    source: "Product Team",
  },
  {
    emailId: "5",
    title: "AI Summit 2024 Invitation",
    summary:
      "Three-day conference featuring industry leaders, hands-on workshops, and networking opportunities. Early bird pricing available.",
    actions: [
      {
        type: "rsvp",
        text: "RSVP for AI Summit 2024",
        dueDate: "2024-01-18T23:59:00Z",
        priority: "high",
        completed: false,
      },
    ],
    importance: "high",
    source: "AI Summit",
  },
  {
    emailId: "6",
    title: "Design Inspiration Weekly",
    summary:
      "Curated collection of stunning UI designs, typography trends, and creative portfolios showcasing innovative design approaches.",
    actions: [
      {
        type: "link",
        text: "Browse design gallery",
        url: "https://example.com/designs",
        priority: "low",
        completed: false,
      },
    ],
    importance: "low",
    source: "Design Weekly",
  },
  {
    emailId: "7",
    title: "Sprint Planning Session",
    summary:
      "User story priorities defined for next quarter. Technical debt items identified with timeline estimates and resource allocation.",
    actions: [
      {
        type: "deadline",
        text: "Review sprint backlog",
        dueDate: "2024-01-22T09:00:00Z",
        priority: "medium",
        completed: false,
      },
    ],
    importance: "medium",
    source: "Alex Chen",
  },
  {
    emailId: "8",
    title: "Customer Success Milestone",
    summary:
      "TechCorp achieved 300% user growth using advanced analytics and automation. Case study highlights key success factors.",
    actions: [
      {
        type: "link",
        text: "Read full case study",
        url: "https://example.com/case-study",
        priority: "medium",
        completed: false,
      },
    ],
    importance: "medium",
    source: "Customer Success",
  },
  {
    emailId: "9",
    title: "Security Enhancement Update",
    summary:
      "New authentication features including two-factor authentication, SSO integration, and enhanced password policies for better security.",
    actions: [
      {
        type: "deadline",
        text: "Update security settings",
        dueDate: "2024-01-19T17:00:00Z",
        priority: "high",
        completed: false,
      },
    ],
    importance: "high",
    source: "Security Team",
  },
  {
    emailId: "10",
    title: "Remote Work Trends Report",
    summary:
      "Comprehensive analysis of remote work adoption, productivity metrics, and emerging collaboration tools shaping future workplace dynamics.",
    actions: [
      {
        type: "link",
        text: "Download full report",
        url: "https://example.com/remote-work-report",
        priority: "low",
        completed: false,
      },
    ],
    importance: "medium",
    source: "Future of Work",
  },
]

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "The Future of AI in Design",
    source: "UX Magazine",
    topics: ["AI", "Design", "Innovation"],
    url: "https://example.com/ai-design-future",
    description:
      "Exploring how artificial intelligence is reshaping the design industry with automated workflows and intelligent design assistance.",
    relevanceScore: 0.92,
    isPaid: false,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Building Scalable Design Systems",
    source: "Design Systems Weekly",
    topics: ["Design", "Systems", "Scalability"],
    url: "https://example.com/scalable-design-systems",
    description:
      "Best practices for creating and maintaining design systems that grow with your organization and product needs.",
    relevanceScore: 0.88,
    isPaid: true,
    createdAt: "2024-01-14T15:30:00Z",
  },
  {
    id: "3",
    title: "Remote Team Collaboration Strategies",
    source: "Harvard Business Review",
    topics: ["Remote Work", "Collaboration", "Management"],
    url: "https://example.com/remote-collaboration",
    description:
      "Evidence-based strategies for improving remote team collaboration and maintaining high productivity across distributed teams.",
    relevanceScore: 0.85,
    isPaid: true,
    createdAt: "2024-01-13T11:45:00Z",
  },
  {
    id: "4",
    title: "JavaScript Performance Optimization",
    source: "Dev.to",
    topics: ["JavaScript", "Performance", "Web Development"],
    url: "https://example.com/js-performance",
    description:
      "Advanced techniques for optimizing JavaScript performance including code splitting, lazy loading, and memory management.",
    relevanceScore: 0.9,
    isPaid: false,
    createdAt: "2024-01-12T09:20:00Z",
  },
  {
    id: "5",
    title: "Product-Led Growth Strategies",
    source: "Product Hunt",
    topics: ["Product", "Growth", "Strategy"],
    url: "https://example.com/product-led-growth",
    description:
      "How successful companies use their product as the primary driver of customer acquisition, retention, and expansion.",
    relevanceScore: 0.87,
    isPaid: false,
    createdAt: "2024-01-11T14:15:00Z",
  },
  {
    id: "6",
    title: "Data Visualization Best Practices",
    source: "Towards Data Science",
    topics: ["Data", "Visualization", "Analytics"],
    url: "https://example.com/data-viz-practices",
    description:
      "Comprehensive guide to creating effective data visualizations that tell compelling stories and drive decision-making.",
    relevanceScore: 0.83,
    isPaid: false,
    createdAt: "2024-01-10T16:30:00Z",
  },
  {
    id: "7",
    title: "Startup Funding Landscape 2024",
    source: "TechCrunch",
    topics: ["Startup", "Funding", "Venture Capital"],
    url: "https://example.com/startup-funding-2024",
    description:
      "Analysis of current venture capital trends, funding patterns, and what startups need to know to secure investment.",
    relevanceScore: 0.91,
    isPaid: true,
    createdAt: "2024-01-09T12:00:00Z",
  },
  {
    id: "8",
    title: "Customer Experience Innovation",
    source: "McKinsey & Company",
    topics: ["Customer Experience", "Innovation", "Business"],
    url: "https://example.com/cx-innovation",
    description:
      "How leading companies are reimagining customer experience through digital transformation and personalization strategies.",
    relevanceScore: 0.86,
    isPaid: true,
    createdAt: "2024-01-08T10:45:00Z",
  },
  {
    id: "9",
    title: "Cybersecurity Trends and Threats",
    source: "Security Weekly",
    topics: ["Security", "Cybersecurity", "Technology"],
    url: "https://example.com/cybersecurity-trends",
    description:
      "Latest cybersecurity threats, defense strategies, and emerging technologies for protecting digital assets and infrastructure.",
    relevanceScore: 0.84,
    isPaid: false,
    createdAt: "2024-01-07T13:20:00Z",
  },
  {
    id: "10",
    title: "Machine Learning in Production",
    source: "ML Engineering",
    topics: ["Machine Learning", "Engineering", "Production"],
    url: "https://example.com/ml-production",
    description:
      "Practical guide to deploying and maintaining machine learning models in production environments with real-world examples.",
    relevanceScore: 0.89,
    isPaid: false,
    createdAt: "2024-01-06T08:30:00Z",
  },
]

// API hooks
export const useEmails = () => {
  return useQuery({
    queryKey: ["emails"],
    queryFn: async (): Promise<EmailSummary[]> => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return mockEmails
    },
    staleTime: 5 * 60 * 1000, // Added 5 minute stale time to prevent unnecessary refetches
  })
}

export const useEmail = (emailId: string) => {
  return useQuery({
    queryKey: ["email", emailId],
    queryFn: async (): Promise<EmailSummary | null> => {
      console.log("[v0] useEmail called with emailId:", emailId)
      await new Promise((resolve) => setTimeout(resolve, 100))
      const email = mockEmails.find((email) => email.id === emailId) || null
      console.log("[v0] useEmail found email:", email ? email.subject : "null")
      return email
    },
    enabled: !!emailId,
    staleTime: 2 * 60 * 1000, // Added 2 minute stale time
  })
}

export const useDigestItems = () => {
  return useQuery({
    queryKey: ["digestItems"],
    queryFn: async (): Promise<DigestItem[]> => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return mockDigestItems
    },
    staleTime: 5 * 60 * 1000, // Added 5 minute stale time
  })
}

export const useRecommendations = () => {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: async (): Promise<Recommendation[]> => {
      await new Promise((resolve) => setTimeout(resolve, 250))
      return mockRecommendations
    },
    staleTime: 10 * 60 * 1000, // Added 10 minute stale time for recommendations
  })
}

export const useExtractActions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (emailContent: string): Promise<ActionItem[]> => {
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock action extraction
      const actions: ActionItem[] = [
        {
          type: "deadline",
          text: "RSVP for conference by Jan 20",
          datetime: "2024-01-20T23:59:00Z",
          priority: "high",
          completed: false,
        },
        {
          type: "event",
          text: "Webinar: Future of AI",
          datetime: "2024-01-25T15:00:00Z",
          priority: "medium",
          completed: false,
        },
      ]

      return actions
    },
  })
}

export const useCreateCalendarEvent = () => {
  return useMutation({
    mutationFn: async (event: ExtractedEvent): Promise<{ success: boolean; eventId?: string }> => {
      await new Promise((resolve) => setTimeout(resolve, 400))

      // Mock calendar creation
      return {
        success: true,
        eventId: `cal_${Date.now()}`,
      }
    },
  })
}
*/
