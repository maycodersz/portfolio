import intakeImage from '@/assets/projects/automation/project-9.1.png'
import discoveryImage from '@/assets/projects/automation/project-10.1.png'
import onboardingImage from '@/assets/projects/automation/project-14.1.png'
import documentImage from '@/assets/projects/automation/project-15.2.png'
import closeImage from '@/assets/projects/automation/project-16.1.png'
import { portfolio } from '@/content/portfolio'

type WorkflowDetail = {
  id: string
  trigger: string
  actions: readonly string[]
  humanCheckpoint: string
  outcome: string
}

const workflowDetails: readonly WorkflowDetail[] = [
  {
    id: 'ghl-public-request-form',
    trigger: 'A prospect submits the public bookkeeping operations review form.',
    actions: ['Creates or updates the contact and company', 'Checks for a duplicate pipeline opportunity', 'Sends confirmation and alerts the owner'],
    humanCheckpoint: 'The firm owner receives a task to review the inquiry before discovery.',
    outcome: 'A structured inquiry enters the CRM once, with a visible next action.',
  },
  {
    id: 'ghl-discovery-call-booked',
    trigger: 'A lead chooses a discovery time and submits the Calendar booking form.',
    actions: ['Moves the opportunity into Discovery Call Booked', 'Updates contact and company status', 'Sends email, preparation task, and Telegram alert'],
    humanCheckpoint: 'The owner reviews the company and submitted context before the call.',
    outcome: 'The meeting, pipeline record, preparation work, and internal alert stay connected.',
  },
  {
    id: 'ghl-discovery-completed-notes-reminder',
    trigger: 'The owner moves the opportunity from booked to completed after the call.',
    actions: ['Calculates the next-day due date', 'Creates an internal notes task', 'Calls n8n for a Telegram reminder'],
    humanCheckpoint: 'The owner records fit, budget, urgency, service, and next steps.',
    outcome: 'Post-call context is captured before the deal moves forward.',
  },
  {
    id: 'ghl-internal-discovery-notes-submitted',
    trigger: 'The internal discovery notes form is submitted.',
    actions: ['Finds the matching opportunity', 'Routes proposal, follow-up, not-fit, or review branches', 'Creates the correct owner task and notification'],
    humanCheckpoint: 'Ambiguous decisions route to manual review instead of being guessed by automation.',
    outcome: 'Every post-call decision produces an explicit pipeline stage and owner action.',
  },
  {
    id: 'ghl-won-deal-onboarding',
    trigger: 'An opportunity is marked Won by the firm owner.',
    actions: ['Updates opportunity, contact, and company status', 'Sends the onboarding email and form', 'Creates a client-success task and team alert'],
    humanCheckpoint: 'The owner confirms the deal before client onboarding starts.',
    outcome: 'A won deal becomes an active onboarding record without a manual handoff chain.',
  },
  {
    id: 'ghl-client-onboarding-form-submitted',
    trigger: 'The new client submits the onboarding form.',
    actions: ['Creates the Google Drive company structure', 'Writes the folder link back to the CRM', 'Sends document requests, tasks, and Telegram notifications'],
    humanCheckpoint: 'Client success reviews the submitted details and follows up on missing documents.',
    outcome: 'The CRM, folder structure, document request, and internal ownership are prepared together.',
  },
  {
    id: 'ghl-document-created-processor',
    trigger: 'A document custom-object record is created in GoHighLevel.',
    actions: ['Associates the file with the correct company and contact', 'Routes images or text files into specialized AI extraction', 'Creates transactions or review requests and notifies the bookkeeper'],
    humanCheckpoint: 'Low-confidence, uncertain, or exceptional records become visible review requests.',
    outcome: 'Extracted data remains traceable to its source document and responsible reviewer.',
  },
  {
    id: 'ghl-monthly-close-command-center',
    trigger: 'A scheduled n8n workflow checks each active client close record.',
    actions: ['Reviews document and transaction readiness', 'Detects unresolved review blockers', 'Updates close status and creates the next task'],
    humanCheckpoint: 'The assigned bookkeeper resolves blockers and confirms accounting judgment.',
    outcome: 'Monthly-close readiness is visible instead of being reconstructed from folders and inboxes.',
  },
] as const

export const accountingOpsWorkflows = workflowDetails.map((detail) => {
  const project = portfolio.automationProjects.find((item) => item.id === detail.id)
  if (!project) throw new Error(`Missing AccountingOps workflow content: ${detail.id}`)
  return {
    ...project,
    ...detail,
    systems: project.tags,
    images: [project.image, ...(project.galleryImages ?? [])],
  }
})

export const accountingOpsSystem = {
  id: 'accountingops-automation-system',
  eyebrow: 'Flagship portfolio demo',
  title: 'AccountingOps Client Operations System',
  summary:
    'A realistic GoHighLevel and n8n system showing how an accounting or bookkeeping firm can connect inquiry, discovery, onboarding, document work, human review, and monthly close visibility.',
  disclaimer:
    'This is a portfolio demonstration system, not a claim of a live client deployment or measured client results.',
  metrics: [
    { value: '5', label: 'Core forms' },
    { value: '4', label: 'Custom objects' },
    { value: '8+', label: 'Workflows' },
    { value: 'GHL + n8n', label: 'Connected stack' },
  ],
  lifecycle: [
    { short: 'Intake', title: 'Structured client intake', description: 'Creates or updates the contact, prevents duplicate opportunities, confirms receipt, and alerts the owner.' },
    { short: 'Discovery', title: 'Discovery and decision routing', description: 'Keeps booked calls connected to the pipeline and routes post-call decisions into proposal, follow-up, or not-fit work.' },
    { short: 'Onboarding', title: 'Won-deal onboarding', description: 'Updates client status, sends onboarding and document requests, creates Drive folders, tasks, and team alerts.' },
    { short: 'Documents', title: 'AI-assisted document processing', description: 'Classifies files, extracts fields, records confidence, and sends uncertain or exceptional items to human review.' },
    { short: 'Review', title: 'Visible human review', description: 'Creates trackable review requests instead of hiding uncertainty inside an automated workflow.' },
    { short: 'Close', title: 'Monthly-close command center', description: 'Checks documents, transactions, and review blockers so the responsible person can see what needs attention.' },
  ],
  screenshots: [
    { src: intakeImage, title: 'Inquiry intake', alt: 'GoHighLevel public request workflow for structured inquiry intake' },
    { src: discoveryImage, title: 'Discovery booking', alt: 'GoHighLevel workflow for a booked discovery call' },
    { src: onboardingImage, title: 'Client onboarding', alt: 'GoHighLevel and n8n client onboarding workflow' },
    { src: documentImage, title: 'Document processing', alt: 'n8n document processing workflow with AI extraction and review routing' },
    { src: closeImage, title: 'Monthly close', alt: 'n8n monthly close readiness workflow' },
  ],
  problem:
    'Accounting teams often manage inquiries, calls, onboarding, files, review questions, and recurring close work across disconnected forms, inboxes, folders, and spreadsheets. The process becomes dependent on memory and manual follow-up.',
  solution:
    'AccountingOps models the full lifecycle in a structured CRM. GoHighLevel holds contacts, companies, opportunities, operational records, and tasks; n8n handles cross-system processing, AI extraction, Google Drive setup, and internal notifications.',
  result:
    'The demonstration turns scattered steps into a visible operating flow. Every automation has a clear trigger, record, owner, next action, and exception path without presenting accounting judgment as fully automated.',
} as const
