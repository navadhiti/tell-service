import express from 'express';
import { singleQA, getAllQA } from './controller.js';
import verifyToken from '../middlewares/token.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

router.post(
    '/singleQA',
    verifyToken,
    authUser,
    singleQA
    /* 
    #swagger.tags = ['Admin']
    #swagger.summary = 'upload single question and answer'
    #swagger.description = 'Add Desc Here'

    #swagger.method = 'post'
    #swagger.produces = ['application/json']
    #swagger.consumes = ['application/json']
    
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Admin Req.Body Data',
        required: true,
        schema: {
            question: "Let me explain how this treatment works",
            answer: "Please go ahead and explain how the treatment works In did like to know more",
            department: "All",
            createdBy: "Palani S"
        }
    }
    ...
    if(...) {
        // #swagger.responses[200] = { description: 'New Question Added to the Database.' }
        return res.status(200).send(data);
    }
    ...
    else if(...) {
        // #swagger.responses[400] = { description: 'Bad Request.'}
        return res.status(200).send(false);
    }
    ...
    else if(...) {
        // #swagger.responses[401] = { description: 'Invalid Token or Unauthorized Access to the user.'}
        return res.status(200).send(false);
    }
    ...
    // #swagger.responses[500] = { description: 'Server Error.'}
        return res.status(500).send(false);
    */
);

router.get(
    '/getAllQA',
    verifyToken,
    getAllQA
    /* 
    #swagger.tags = ['User & Admin']
    #swagger.summary = 'get all questions and answers'
    #swagger.description = 'Add Desc Here'

    #swagger.method = 'get'
    #swagger.produces = ['application/json']
    
    #swagger.parameters['query'] = {
        in: 'query',
        name: 'index',
        description: 'The index of the question is retrieve.',
        schema: {
            type: 'integer'
        }
    }
    ...
    if(...) {
        // #swagger.responses[200] = { description: 'Questions & Answers Retrieved Successfully.' }
        return res.status(200).send(data);
    }
    ...
    else if(...) {
        // #swagger.responses[400] = { description: 'Bad Request.'}
        return res.status(200).send(false);
    }
    ...
    else if(...) {
        // #swagger.responses[401] = { description: 'Unauthorized Access to the user.'}
        return res.status(200).send(false);
    }
    ...
    // #swagger.responses[500] = { description: 'Server Error.'}
        return res.status(500).send(false);
    */
);

export default router;
