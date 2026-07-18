import { ingest } from '../_lib/ingest.js'
import { visitSchema } from '../_lib/schema.js'

export default { fetch: (request: Request) => ingest(request, visitSchema, 'visit') }
