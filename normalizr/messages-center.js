import util from 'util';
import { normalize, schema, denormalize } from 'normalizr';
import mongoose from 'mongoose'

const data = {
    id: 0,
    messages: [
        {
            id: 0,
            author: {
                email: 'santi@quetal',
                name: 'santi',
                surname: 'penalva'
            },
            message: 'hola que tal',
            date: 'hoy'
        },
        {
            id: 1,
            author: {
                email: 'santi@quetal',
                name: 'santi',
                surname: 'penalva'
            },
            message: 'hola que tal',
            date: 'hoy'
        },
        {
            id: 2,
            author: {
                email: 'cata@quetal',
                name: 'cata',
                surname: 'fernandez'
            },
            message: 'hola que tal',
            date: 'hoy'
        },
        {
            id: 3,
            author: {
                email: 'santi@quetal',
                name: 'santi',
                surname: 'penalva'
            },
            message: 'hola que tal',
            date: 'hoy'
        },
        {
            id: 4,
            author: {
                email: 'cata@quetal',
                name: 'cata',
                surname: 'fernandez'
            },
            message: 'hola que tal',
            date: 'hoy'
        },
    ]
}

const author = new schema.Entity('author', {}, { idAttribute: 'email' });
const message = new schema.Entity('message', {
    author: author
// }, { idAttribute: '_id' });
});
const messagesCenter = new schema.Entity('messagesCenter', {
    authors: [author],
    messages: [message]
});

export default function normalizeMessages(messages) {
    const toNormalize = messages.map((message, i) => ({
        author: message.author,
        date: message.date,
        message: message.message,
        id: message._id.toString(),
    }));
    const normalized = normalize({
        id: 0,
        messages: toNormalize
    }, messagesCenter);
    return normalized;
}


// const denormalizedData = denormalize(normalizedData.result, messagesCenter, normalizedData.entities)

// console.log(util.inspect(normalizedData, false, 12, true));
// console.log(util.inspect(denormalizedData, false, 12, true));