import fastify from 'fastify'

const app = fastify()

app.addContentTypeParser(
  'application/vnd.api+json',
  { parseAs: 'string' },
  (req: any, body: any, done: any) => {
    done(null, body)
  },
)

let handler = (req: fastify.FastifyRequest, reply: fastify.FastifyReply<{}>) => ({})

app.post('/webhooks', async (req: fastify.FastifyRequest, reply: fastify.FastifyReply<{}>) => {
  return handler(req, reply)
})

export default {
  start() {
    return app.listen(process.env.PORT)
  },
  stop() {
    return app.close()
  },
  setHandler(h: any) {
    handler = h
  },
}
