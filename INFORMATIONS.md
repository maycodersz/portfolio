# INFORMATIONS.md — Context, Research, and Copy Bank for Codex

## Purpose

This document gives Codex all relevant background information needed to update the existing Maycoder portfolio site.

Use this together with:

- `PLAN.md`
- `PHASES.md`
- Existing repo files
- Existing `PORTFOLIO.md` handoff

The goal is to remove the Pricing section and add GHL/n8n business automation case studies, especially the AccountingOps Automation System.

## Portfolio Website Context

### Project identity

- Brand shown in UI: `Maycoder`
- Owner/persona: `Aian Mhyco B. Nunez`
- Public positioning: AI automation specialist, n8n builder, agentic AI systems developer, and product builder for websites/mobile apps
- Core offer currently shown in hero: `Let's build your Automation / Website / Mobile App`
- Main content source: `src/content/portfolio.ts`
- Main homepage composition: `src/App.tsx`
- Main routing: React Router with `/`, `/cv`, and `/work/:id`

### Tech stack

- React 19
- Vite 8
- TypeScript 6
- Tailwind CSS 4
- React Router 7
- motion / motion-react
- Radix primitives
- shadcn-style local components
- lucide-react
- react-icons
- Simple Icons CDN

### Current homepage order

```txt
RouteHashScroll
LoadingScreen
NavBar
HeroSplineSection inside #hero
SkillsShowcase
StatsSection
WorksSection inside #works
AutomationSection
PricingSection
ContactSection
```

### Current navigation

```txt
CV -> /cv
Work -> /#works
Pricing -> /#pricing
Hire Me -> /#contact
```

### Target navigation

```txt
CV -> /cv
Work -> /#works
Systems -> /work/accountingops-automation-system
Hire Me -> /#contact
```

### Current pricing section

The current pricing section says:

```txt
Eyebrow: Pricing
Title: Pay for what you need
Disclaimer: All prices are starting rates. Final quote depends on project scope.
CTA: Have a custom project? Let's talk. -> /#contact
```

Current pricing cards:

1. Website — Starting at `$149`
2. Automation & AI — Starting at `$799`
3. Mobile App — Starting at `$199`

Decision:

```txt
Remove this section from the homepage.
```

Do not make pricing the main sales proof. Route visitors to the AccountingOps grouped system case study instead.

## Why Remove Pricing

The portfolio is currently trying to sell multiple service types:

- n8n automations
- AI agents
- GoHighLevel CRM setup
- Web dashboards
- Mobile apps
- API integrations
- Lead management systems
- Document processing workflows

Fixed prices can weaken conversion because:

- The scope varies too much.
- It can make complex GHL/n8n systems look like a commodity.
- It may filter out clients before they understand the value.
- Maycoder is still building proof and should sell through capability/case studies first.

Better proof path:

```txt
Show real business systems through Problem → Solution → Results.
```

## Internet Research Summary

Use these findings to justify the portfolio architecture.

### B2B case-study structure

Recent B2B portfolio/case-study guidance supports using a clear Problem → Solution → Results structure because it is easy for prospects to scan and understand.

Practical application:

- Each major project should explain the business problem.
- The solution should focus on decisions and system design, not only tools.
- Results should be honest and measurable where possible.
- If measured business results are not available, use implementation outcomes such as forms, objects, workflows, integrations, and operational visibility.

### Portfolio conversion principle

For service providers, case studies usually build more trust than generic pricing because they show how the provider thinks and solves real problems.

Practical application:

- Replace the Pricing section with a route-level Systems/Case Studies destination.
- Make AccountingOps the flagship project because it demonstrates end-to-end operations design.
- Let current automation projects route to the same AccountingOps system page as a grouped proof destination.

### Official HighLevel capability notes

HighLevel documentation supports the core technical claims needed for the AccountingOps case study:

- Custom Objects can model entities beyond Contacts, Companies, and Opportunities.
- Custom Objects can have custom fields, relationships/associations, and automations/workflows.
- Forms/surveys/quizzes can collect Custom Object and Company Object data linked back to contacts.
- Company Objects can group related contacts under a company profile.
- Associations can connect Opportunities, Companies, and Custom Objects.
- Smart Lists can organize and filter records/views.
- Custom Object workflow triggers/actions exist, but implementation details should be verified in the actual account before overpromising.

## Official Reference Links

These are reference links for humans/Codex. Do not need to render publicly on the website.

### GHL docs

- Getting Started with Custom Objects: `https://help.gohighlevel.com/support/solutions/articles/155000003896-getting-started-with-custom-objects`
- Creating and Editing Custom Objects: `https://help.gohighlevel.com/support/solutions/articles/155000003897-creating-and-editing-custom-objects`
- Custom Objects and Company Objects in Forms, Surveys & Quizzes: `https://help.gohighlevel.com/support/solutions/articles/155000006384-custom-objects-and-company-objects-in-forms-surveys-quizzes`
- Associations Between Opportunities, Companies & Custom Objects: `https://help.gohighlevel.com/support/solutions/articles/155000004033-associations-between-opportunities-companies-custom-objects`
- How to Create & Manage Smart Lists: `https://help.gohighlevel.com/support/solutions/articles/48001062094-how-to-create-manage-smart-lists`
- How to Use Custom Fields: `https://help.gohighlevel.com/support/solutions/articles/48001161579-how-to-use-custom-fields`
- Using Custom Objects in Workflow Actions and Triggers: `https://help.gohighlevel.com/support/solutions/articles/155000004389-using-custom-objects-in-workflow-actions-and-triggers`
- Workflow Action — Create an Associated Record for Contact: `https://help.gohighlevel.com/support/solutions/articles/155000004586-workflow-action-create-an-associated-record-for-contact`

### Case study / portfolio strategy references

- B2B case study guide: `https://beomniscient.com/blog/writing-high-converting-b2b-case-studies/`
- Problem-Solution-Results framework: `https://scopicstudios.com/blog/8-proven-b2b-case-study-examples-and-frameworks/`
- Portfolio case study examples guide: `https://influenceflow.io/resources/portfolio-case-study-examples-the-complete-2026-guide-for-creative-professionals/`

## GHL Project Context

### Main project name

```txt
AccountingOps Automation System
```

### Subaccount name

```txt
Accounting Firm Automation Demo
```

### Project type

```txt
GoHighLevel CRM + n8n Automation System
```

### Niche

```txt
Accounting / Bookkeeping firms
```

### Positioning

This is a realistic portfolio demo system, not a live client deployment.

Use:

```txt
A realistic portfolio demo system built to show how an accounting/bookkeeping firm could automate intake, document processing, review routing, and monthly close tracking using GoHighLevel and n8n.
```

Avoid:

```txt
I automated a real accounting client and generated X revenue.
```

Avoid any unverified client outcome claims.

## Why Accounting/Bookkeeping Was Chosen

Accounting/bookkeeping is a stronger portfolio niche than simple local businesses because it shows more enterprise-style operations.

Good reasons:

- Clear repeatable workflows
- Lots of document handling
- Many follow-up points
- Internal review needs
- Client onboarding complexity
- CRM and operations tracking matter
- Monthly close workflows create recurring operational pain
- GHL custom objects and n8n fit well together

## AccountingOps System Summary

AccountingOps is a connected GHL+n8n system for an accounting/bookkeeping firm.

It covers:

1. Public inquiry intake
2. Discovery call booking
3. Internal discovery notes
4. Lead temperature / next-step routing
5. Proposal-needed routing
6. Document submission
7. AI document classification/extraction
8. Review request routing
9. Invoice/receipt status tracking
10. Monthly close tracking
11. Owner notifications
12. Smart operational views

## Core Objects

### Standard GHL objects

```txt
Contacts
Companies / Business
Opportunities
```

### Custom objects

```txt
Documents
Invoices
Review Requests
Monthly Close
```

### Earlier/optional object mention

Some old context mentions:

```txt
Accounting Transactions
```

Use the finalized public-facing version instead:

```txt
Documents, Invoices, Review Requests, Monthly Close
```

If transaction tracking is needed later, it can be introduced as a future expansion.

## Pipeline

Pipeline name:

```txt
Accounting Sales Pipeline
```

Stages:

```txt
New Inquiry
Booked Discovery Call
Proposal Needed
Follow-Up
Not Fit
Won
Lost
```

## Forms

### 1. Public Request Form

Client-facing name:

```txt
Request a Bookkeeping Operations Review
```

Purpose:

```txt
Short public form for new accounting/bookkeeping inquiries.
```

Objects:

```txt
Contact + Company
```

Important note:

```txt
GHL form submission creates/updates the contact, so a separate Create Contact workflow action is not required for this form.
```

Workflow effect:

- Create opportunity
- Add New Inquiry tag
- Send confirmation email
- Notify owner / create task if supported

### 2. Discovery Call Form

Purpose:

```txt
Used around booked discovery calls to collect or confirm contact/company details.
```

Objects:

```txt
Contact + Company
```

Fields:

- Full name
- Phone
- Company details as needed

### 3. Internal Discovery Notes Form

Purpose:

```txt
Internal form for recording discovery outcome and routing the opportunity.
```

Objects:

```txt
Contact + Opportunity
```

Important fields:

- Recommended Step
- Lead Temperature
- Opportunity Name

Routing:

- Proposal Needed
- Follow-Up
- Not Fit

### 4. Document Submission Form

Purpose:

```txt
Client-submitted accounting documents such as receipts, vendor bills, bank statements, and credit card statements.
```

Objects:

```txt
Contact + Documents custom object
```

Workflow effect:

- Create Document record
- Trigger n8n webhook
- Update status/confidence after processing
- Notify owner when needed

### 5. Internal Review Request Form

Purpose:

```txt
Internal form for exceptions, unclear items, or low-confidence documents needing human review.
```

Objects:

```txt
Contact + Review Requests custom object
```

Workflow effect:

- Create Review Request record
- Assign owner or notify team
- Track status

### Optional / future

```txt
Client Onboarding Form
```

Do not make this central unless it already exists in the current repo/screenshots.

## Associations

Use these as the intended logical model:

```txt
Contact ↔ Company: many-to-one
Contact ↔ Opportunity: one-to-many
Contact ↔ Documents: one-to-many
Contact ↔ Review Requests: one-to-many
Contact ↔ Monthly Close: one-to-many
Company ↔ Opportunities: one-to-many
Company ↔ Monthly Close: one-to-many
Opportunity ↔ Documents: one-to-many
Opportunity ↔ Review Requests: one-to-many
```

## Fields

### Company / Business fields

```txt
Current Accounting Software
Monthly Transaction Volume
Bank Accounts Count
Credit Cards Count
Payroll Needed
AP Needed
AR Needed
Cleanup Needed
Reporting Needed
Tax Support Needed
Existing Bookkeeper
Current Pain Point
```

### Opportunity fields

```txt
Stage
Amount
Source
Lead Temperature
Recommended Step
Opportunity Name
```

### Documents fields

```txt
Document Type
Upload Link
AI Confidence Score
Status
Exception Reason
```

Document Type options:

```txt
Bank Statement
Credit Card Statement
Receipt
Vendor Bill
Other
```

Document Status options:

```txt
Received
Missing Info
Rejected
Approved
```

### Invoices fields

```txt
Invoice Date
Vendor
Amount
Status
Review Status
```

Invoice Status options:

```txt
Pending
Paid
Disputed
```

### Review Requests fields

```txt
Request Type
Status
Owner
Notes
```

Review Request Type options:

```txt
Invoice
Receipt
Exception
```

Review Request Status options:

```txt
Open
In Review
Completed
```

### Monthly Close fields

```txt
Close Month
Status
Bank Statements Received
Credit Card Statements Received
Receipts Received
Vendor Bills Reviewed
```

Monthly Close Status options:

```txt
Open
Waiting Docs
In Review
Completed
```

## Workflows

### Workflow 1 — Public Request Form Submitted

Trigger:

```txt
Public Request Form submitted
```

Actions:

```txt
Create Opportunity in Accounting Sales Pipeline at New Inquiry
Add Contact tag: New Inquiry
Send confirmation email using snippet
Notify owner and/or create task
```

Portfolio wording:

```txt
New inquiries automatically enter the sales pipeline with owner visibility and client confirmation.
```

### Workflow 2 — Appointment Booked / Discovery Fallback

Trigger:

```txt
Discovery Call appointment booked
```

Actions:

```txt
If opportunity is missing, create one at Booked Discovery Call
Add tags: New Inquiry, Booked Discovery
Continue into discovery workflow logic
```

Portfolio wording:

```txt
Booked calls are kept connected to the pipeline even when the contact came through a calendar-first path.
```

### Workflow 3 — Internal Discovery Notes Submitted

Trigger:

```txt
Internal Discovery Notes Form submitted
```

Actions:

```txt
Find Opportunity by Opportunity Name
Check Recommended Step
Check Lead Temperature
Move opportunity to Proposal Needed, Follow-Up, or Not Fit
Notify owner if Proposal Needed
```

Portfolio wording:

```txt
Discovery notes route the opportunity to the right next step instead of relying on memory or manual updates.
```

### Workflow 4 — Document Submission Form Submitted

Trigger:

```txt
Document Submission Form submitted
```

Actions:

```txt
Create Document record
Send webhook to n8n
Wait for AI processing response
Update Document Status
Update AI Confidence Score
Notify owner when review is needed
```

Portfolio wording:

```txt
Submitted files become structured records and can trigger AI-assisted document processing.
```

### Workflow 5 — Internal Review Request Submitted

Trigger:

```txt
Internal Review Request Form submitted
```

Actions:

```txt
Create Review Request record
Assign owner or notify owner
Track status as Open, In Review, or Completed
```

Portfolio wording:

```txt
Exception items are routed into a visible review queue instead of being lost in messages.
```

### Workflow 6 — n8n Document Processing

Trigger:

```txt
Webhook from GHL document workflow
```

Actions:

```txt
Receive GHL document data
Download or access uploaded file/link if available
Classify document type
Extract key invoice/receipt/document fields
Normalize structured output
Return JSON response to GHL
Update status/confidence/review signals
```

Known response shape from prior setup:

```json
{
  "status": "success",
  "data": {
    "gdrive_link": "..."
  }
}
```

Portfolio wording:

```txt
n8n acts as the backend processor for AI document classification and structured extraction.
```

### Workflow 7 — Review Request Status Routing

Trigger:

```txt
Review Request status changes or form/event update
```

Actions:

```txt
Branch by Open, In Review, Completed
Notify or update related records as needed
```

Caution:

```txt
Previous setup had a GHL limitation where custom object fields were not always visible in IF/ELSE. Do not overpromise exact implementation unless confirmed in the account/code.
```

### Workflow 8 — Monthly Close Tracking

Trigger:

```txt
Monthly close record created/updated or manual status update
```

Actions:

```txt
Track missing bank statements
Track missing credit card statements
Track receipts received
Track vendor bills reviewed
Update close status
```

Portfolio wording:

```txt
Monthly close status is tracked through structured records so the firm can see what is waiting, in review, or completed.
```

## Tags and Smart Lists

### Tags

Use tags sparingly as workflow helpers.

Suggested tags:

```txt
New Inquiry
Booked Discovery
Proposal Sent
Docs Missing
```

### Smart Lists / operational views

Use object fields and smart lists for operational visibility.

Suggested views:

```txt
New inquiries
Booked discovery calls
Proposal needed
Follow-up required
Documents missing information
Documents approved
Open review requests
Monthly close waiting docs
Monthly close in review
Monthly close completed
```

## AccountingOps Case Study Copy Bank

### Short homepage card copy

```txt
AccountingOps Automation System
A GoHighLevel + n8n demo system for accounting and bookkeeping firms that tracks client intake, discovery, document submission, review routing, invoice/receipt processing, and monthly close operations.
```

### Problem

```txt
Accounting teams lose time chasing leads, documents, review tasks, and month-end status across email threads and spreadsheets.
```

### Solution

```txt
A structured GHL subaccount with pipelines, custom objects, forms, automations, smart lists, and n8n document-processing webhooks.
```

### Result

```txt
Every inquiry, document, review request, and close task becomes visible, routed, and easier to follow up on.
```

### Full project description

```txt
AccountingOps is a GoHighLevel and n8n automation system built to model how an accounting/bookkeeping firm can handle inquiries, discovery, onboarding, document collection, AI-assisted document processing, review requests, and monthly close tracking in one connected CRM workflow.
```

### Full overview

```txt
A full-business automation demo built inside a dedicated GoHighLevel subaccount for an accounting/bookkeeping firm. The system connects public intake, discovery, document submission, internal review routing, and monthly close tracking, with n8n used for backend AI document processing.
```

### Full problem

```txt
Accounting and bookkeeping teams often manage new inquiries, client discovery, document collection, invoice/receipt review, exceptions, and monthly close work across disconnected forms, inboxes, spreadsheets, and manual reminders. This makes it hard to know which clients are ready, which documents are missing, which items need human review, and what needs to happen next.
```

### Full solution

```txt
I designed a realistic GHL subaccount with a structured Accounting Sales Pipeline, custom objects for Documents, Invoices, Review Requests, and Monthly Close records, public and internal forms, smart operational views, email snippets, owner notifications, and workflows that move records through the process. n8n connects to GHL through webhooks for AI document classification and extraction, returning structured status, confidence, and review signals.
```

### Full results

```txt
The system turns scattered accounting operations into a visible workflow: new inquiries enter the pipeline automatically, discovery notes route the opportunity to the right next step, submitted documents become trackable records, low-confidence or exception items can create review requests, and monthly close progress can be monitored through structured status fields instead of manual follow-up.
```

## Feature Module Copy Bank

### Client Intake

```txt
Public request form creates or updates the contact, starts the opportunity, tags the lead, sends confirmation, and notifies the owner.
```

### Discovery Routing

```txt
Internal discovery notes classify the lead temperature and recommended next step, then route the opportunity to Proposal Needed, Follow-Up, or Not Fit.
```

### Document Submission

```txt
Client document submissions create structured document records and trigger n8n processing through a webhook.
```

### AI Document Processing

```txt
n8n classifies files, extracts invoice/receipt fields, normalizes the output, and returns confidence/status data to GHL.
```

### Review Requests

```txt
Exception or low-confidence items can be routed into review request records with owner visibility and status tracking.
```

### Monthly Close Tracking

```txt
Monthly close records track statements, receipts, vendor bills, review status, and close completion for each client/company.
```

## Metrics Copy Bank

Use these if the design supports five metrics:

```txt
5 Core Forms
4 Custom Objects
8+ GHL Workflows
GHL + n8n Integration
Accounting/Bookkeeping Use Case
```

Use these if the design supports three metrics:

```txt
5 Core Forms
4 Custom Objects
8+ Workflows
```

Alternative metrics:

```txt
CRM Pipeline
Document Processing
Review Routing
Monthly Close Tracking
```

## Grouped System Case Study Page Copy Bank

### Section copy

```txt
Eyebrow: Client Systems
Title: Business automation systems built like real operations
Description: Full CRM and automation demos showing how I structure intake, pipelines, documents, review work, and AI-powered follow-up.
```

### Alternative title

```txt
Business systems, not just workflows
```

### Alternative description

```txt
CRM, AI, and n8n builds designed around real client operations: intake, follow-up, document handling, review queues, and reporting.
```

### Support note

```txt
Built as reusable demo systems for client walkthroughs, Looms, proposals, and content.
```

## Supporting Systems Copy

### AI Lead Qualification Pipeline

Title:

```txt
AI Lead Qualification Pipeline
```

Type:

```txt
n8n + AI Lead Routing
```

Description:

```txt
A portfolio contact-form automation that qualifies inquiries, enriches business emails, drafts follow-ups, sends alerts, and logs cold leads for later review.
```

Problem:

```txt
New inquiries are easy to miss or respond to too slowly when every message is handled manually.
```

Solution:

```txt
n8n classifies leads as hot, warm, or cold, enriches business context, creates grounded reply drafts, and notifies the owner.
```

Result:

```txt
Better response speed, cleaner lead tracking, and less manual triage.
```

Tags:

```txt
n8n
OpenRouter
Gmail
Telegram
```

Metrics:

```txt
AI Qualification
Lead Alerts
CRM Logging
```

### Meeting Summarizer & Task Extractor

Title:

```txt
Meeting Summarizer & Task Extractor
```

Type:

```txt
AI Meeting-to-Task Automation
```

Description:

```txt
A client-demo n8n workflow that turns meeting recordings or transcripts into summaries, Slack updates, and Monday.com tasks.
```

Problem:

```txt
Meetings create action items, but the follow-up work often stays buried in notes or recordings.
```

Solution:

```txt
The workflow transcribes/summarizes meetings, extracts decisions and tasks, posts the summary, and creates action items in Monday.com.
```

Result:

```txt
Teams leave meetings with clearer summaries and trackable next steps.
```

Tags:

```txt
n8n
OpenRouter
Slack
Monday.com
```

Metrics:

```txt
Meeting Summary
Task Extraction
Team Alerts
```

## Hero Copy Options

Do not force hero changes if they are outside the implementation scope, but these are recommended.

### Main positioning option

```txt
I build AI automation systems for service businesses using n8n, GoHighLevel, APIs, and custom dashboards.
```

### Secondary line

```txt
I can also build the web dashboards, landing pages, and internal tools needed around the automation.
```

### Simple hero offer option

```txt
Let's build your Automation System / CRM Setup / AI Workflow
```

## Contact Form Copy Options

Current project type options:

```txt
Web dev
Mobile app
Automation
```

Recommended display options:

```txt
Automation / AI Workflow
GHL CRM Setup
Website / Dashboard
Mobile App
```

Important:

```txt
Do not break the n8n contact webhook by changing submitted projectType values unless the webhook is updated too.
```

## Public Tone Rules

Use Maycoder's portfolio tone:

- Clear
- Business-focused
- Confident
- Not too corporate
- Not overly technical on homepage
- More detailed on project page

Avoid sounding like:

- A generic student portfolio
- A cheap fixed-price menu
- A tool-only showcase
- A fake agency with unverified client claims

Prefer:

```txt
I built a realistic operations system...
The workflow routes...
The system tracks...
This gives the business visibility into...
Human review handles exceptions...
```

Avoid:

```txt
Guaranteed results
Fully automated accounting
No human needed
Generated X revenue
Saved X hours
Real client results
```

unless real proof exists.

## Design Direction

Use existing site style:

- Purple brand palette
- Glassmorphism cards
- Smooth gradients
- Dark/light theme support
- Motion animations where already used
- Clean bento sections
- Accessible hover/focus states
- Responsive layouts

For AccountingOps visual language, use:

```txt
Inquiry → Discovery → Documents → AI Review → Monthly Close
```

Good icons/metaphors:

- Pipeline
- File/document
- Bot/AI sparkle
- Checklist
- Calendar/month
- Webhook/connection
- Building/company
- User/contact

## Implementation Risks

### Risk 1 — Project kind may not support automation

Existing project pages may only support `website` and `mobile` kinds.

Options:

1. Add a new kind `system` or `automation` and update renderers.
2. Reuse an existing kind and provide placeholder screens.
3. Add AccountingOps as a route-only project page and hide it from homepage Works if needed.

Preferred:

```txt
Add full project page if it can be done cleanly. Do not break existing project pages.
```

### Risk 2 — Missing screenshots

There may be no AccountingOps screenshots in assets yet.

Do not fake screenshots.

Use placeholders or a diagram if supported.

Future screenshots to add:

```txt
GHL pipeline
Public request form
Custom objects
Document submission form
n8n workflow
Review request list
Monthly close list
```

### Risk 3 — Contact form webhook values

Changing project type values may break downstream automation.

Safe approach:

```txt
Change labels only, keep values stable.
```

### Risk 4 — Dead pricing anchors

Search the repo for:

```txt
pricing
#pricing
PricingSection
```

Remove or update public references.

### Risk 5 — Overclaiming

Do not write fake business outcomes.

Use implementation metrics:

```txt
forms, custom objects, workflows, integrations, process coverage
```

## QA Checklist

### Build

```bash
npm run lint
npm run build
```

### Homepage

- Pricing section removed
- No landing Systems section is rendered
- Systems nav opens `/work/accountingops-automation-system`
- Automation cards route to the AccountingOps system page
- Modal fallback remains available for future automation projects without a system route
- Contact still visible
- Automation section still works

### Project page

- `/work/accountingops-automation-system` loads
- Problem/Solution/Results present
- Tech stack present
- Metrics present
- No fake links
- No fake client claims

### Existing routes

- `/`
- `/cv`
- `/work/academic-hub`
- `/work/admino-mobile`

### Responsive

- Mobile nav works
- Mobile cards stack
- No horizontal overflow
- CTAs visible without hover

### Theme/accessibility

- Light mode ok
- Dark mode ok
- Keyboard focus ok
- Reduced motion ok

## Final Outcome

After implementation, the portfolio should communicate:

```txt
Maycoder can build complete AI automation systems around real business operations, especially GHL + n8n systems for service businesses.
```

The user should no longer see generic pricing as the main conversion point. Instead, they should see a stronger proof section showing how Maycoder thinks through business problems, system architecture, CRM setup, automation, AI processing, and operational results.
