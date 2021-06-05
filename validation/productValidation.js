const Joi = require('@hapi/joi');

const postValidation = data =>  {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        imageUrl: Joi.string().required()
    });
    return schema.validate(data);
}

module.exports.postValidation = postValidation;