var schemas = {
  redirect: {
    type: 'object',
    properties: {
      alias: {
        type: 'string',
        format: 'alphanumeric',
        required: true
      },
      url: {
        type: 'string',
        format: 'uri',
        required: true
      },
      action: {
        type: 'string',
        pattern: /^redirect$/,
        required: true
      },
      type: {
        type: 'string',
        enum: [ 'permanent', 'temporary' ],
        required: true
      },
      constraints: {
        type: 'object',
        properties: {
          validFrom: {
            type: 'string',
            format: 'date-time'
          },
          validBefore: {
            type: 'string',
            format: 'date-time'
          }
        }
      }
    }
  },
  download: {
    type: 'object',
    properties: {
      alias: {
        type: 'string',
        format: 'alphanumeric',
        required: true
      },
      url: {
        type: 'string',
        format: 'uri',
        required: true
      },
      action: {
        type: 'string',
        pattern: /^download$/,
        required: true
      },
      fileName: {
        type: 'string',
        required: true
      },
      contentType: {
        type: 'string',
        pattern: /^[-\w]+\/[-\w\+]+$/,
        required: true
      },
      forceDownload: {
        type: 'boolean',
        required: true
      },
      constraints: {
        type: 'object',
        properties: {
          validFrom: {
            type: 'string',
            format: 'date-time'
          },
          validBefore: {
            type: 'string',
            format: 'date-time'
          }
        }
      }
    }
  }
};

module.exports = schemas;