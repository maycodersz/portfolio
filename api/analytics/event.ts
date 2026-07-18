import { ingest } from '../_lib/ingest.js'
import { eventSchema } from '../_lib/schema.js'

export default { fetch: (request: Request) => ingest(request, eventSchema, 'event') }
