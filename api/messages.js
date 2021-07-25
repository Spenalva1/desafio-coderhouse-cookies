import Message from '../models/Message.js';

class MessagesController {

    constructor() { }

    async findAll() {
        return await Message.find({});
    }

    async findById(id) {
        return await Message.findById(id);
    }

    async create(data) {
        return await Message.create(data);
    }

    async update(id, data) {
        return await Message.findByIdAndUpdate(id, data);
    }

    async delete(id) {
        return await Message.findByIdAndDelete(id);
    }
}

const messagesController = new MessagesController();

export default messagesController;