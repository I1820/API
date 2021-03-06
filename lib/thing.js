/*
 * +===============================================
 * | Author:        Parham Alvani (parham.alvani@gmail.com)
 * |
 * | Creation Date: 19-06-2017
 * |
 * | File Name:     thing.js
 * +===============================================
 */
const EventEmitter = require('events')

class I1820Thing extends EventEmitter {
  constructor (client, id, agentId, type, socket) {
    super()
    this.client = client
    this.id = id
    this.agentId = agentId
    this.type = type
    if (socket) {
      socket.on('raw', (message) => {
        let result = JSON.parse(message)
        if (result['agent_id'] === this.agentId &&
          result['device_id'] === this.id &&
          result['type'] === this.type) {
          this.emit('log', result['states'])
        }
      })
    }
  }

  get log () {
    return new Promise((resolve, reject) => {
      this.client.post('/thing', {
        'type': this.type,
        'agent_id': this.agentId,
        'device_id': this.id,
        'states': []
      }).then((response) => {
        const result = response.data
        return resolve(result)
      }).catch((err) => reject(err))
    })
  }

  set configuration (configuration) {
    return new Promise((resolve, reject) => {
      this.client.put('/thing', {
        'type': this.type,
        'agent_id': this.agentId,
        'device_id': this.id,
        'settings': configuration
      }).then(() => resolve()
      ).catch((err) => reject(err))
    })
  }
}

module.exports = I1820Thing
