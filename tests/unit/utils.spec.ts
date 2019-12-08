import { CommerceLayerResource, SIGNATURE_HEADER, TOPIC_HEADER } from '../../src/interfaces'
import { deserialize, getBody, getHeaders, parseRequest, verifySignature } from '../../src/utils'
import { createMessage, createSignature } from '../helpers'

describe('utils', () => {

  test('getHeaders', () => {
    expect(getHeaders({
      headers: {},
    })).toStrictEqual({})

    const headers = getHeaders({
      headers: {
        test: 'ok',
      },
    })
    expect(Object.keys(headers).includes('test')).toBe(true)
    expect(headers.test).toBe('ok')
  })

  test('getBody', () => {
    let body = getBody({
      headers: {},
    })

    expect(body).toBe('')

    body = getBody({
      body: 'test',
      headers: {},
    })

    expect(body).toBe('test')

    body = getBody({
      headers: {},
      rawBody: 'test',
    })

    expect(body).toBe('test')

    body = getBody({
      headers: {},
      payload: 'test',
    })

    expect(body).toBe('test')

    body = getBody({
      body: 'bad',
      headers: {},
      rawBody: 'test',
    })

    expect(body).toBe('test')
  })

  test('parseRequest', () => {
    let result

    result = parseRequest({
      body: '',
      headers: {},
    })

    expect(result.signature).toBe('')
    expect(result.topic).toBe('')
    expect(result.body).toBe('')

    result = parseRequest({
      body: 'test',
      headers: {
        [SIGNATURE_HEADER]: 'signature',
        [TOPIC_HEADER]: 'topic',
      },
    })

    expect(result.signature).toBe('signature')
    expect(result.topic).toBe('topic')
    expect(result.body).toBe('test')
  })

  test('verifySignature', () => {
    const secret = 'secret'
    const message = 'message'

    let result = verifySignature(secret, createSignature('', ''), message)
    expect(result).toBe(false)

    result = verifySignature(secret, createSignature(secret, ''), message)
    expect(result).toBe(false)

    result = verifySignature(secret, createSignature('', message), message)
    expect(result).toBe(false)

    result = verifySignature(secret, createSignature(secret, message), message)
    expect(result).toBe(true)
  })

  test('deserialize', async () => {
    const dataSingle = { title: 'Test title', subTitle: 'test subtitle' }
    let serialized = await createMessage(dataSingle)

    const deserializedSingle = await deserialize(serialized) as CommerceLayerResource

    expect(deserializedSingle).toHaveProperty('title')
    expect(deserializedSingle).toHaveProperty('subTitle')
    expect(deserializedSingle.title).toBe(dataSingle.title)
    expect(deserializedSingle.subTitle).toBe(dataSingle.subTitle)

    const dataMulti = [
      { title: 'Test title 1', subTitle: 'test subtitle 1' },
      { title: 'Test title 2', subTitle: 'test subtitle 2' },
    ]
    serialized = await createMessage(dataMulti)

    const deserializedMulti = await deserialize(serialized) as CommerceLayerResource[]

    expect(deserializedMulti.length).toBe(dataMulti.length)

    deserializedMulti.forEach((des, index) => {
      expect(des).toHaveProperty('title')
      expect(des).toHaveProperty('subTitle')
      expect(des.title).toBe(dataMulti[index].title)
      expect(des.subTitle).toBe(dataMulti[index].subTitle)
    })
  })
})
