import express from 'express';
import verifyToken from '../middlewares/token.js';
import { register, login, markResult, logout } from './controller.js';

const router = express.Router();

router.post(
    '/register',
    register
    /* 
    #swagger.tags = ['User']
    #swagger.summary = 'create account for new user'
    #swagger.description = 'Add Desc Here'

    #swagger.method = 'post'
    #swagger.produces = ['application/json']
    #swagger.consumes = ['application/json']

    #swagger.parameters['Register'] = {
        in: 'body',
        description: 'Req.Body Data',
        required: true,
        schema: {
            fullName: "Sethu K",
            email: "sethu@gmail.com",
            phoneNumber: "9876543210",
            password: "zA1@sethu"
        }
    }
    ...
    if(...) {
        // #swagger.responses[200] = { description: 'Registered Successfully.' }
        return res.status(200).send(data);
    }
    ...
    else if(...) {
        // #swagger.responses[400] = { description: 'Validaiton Error.'}
        return res.status(200).send(false);
    }
    ...
    else if(...) {
        // #swagger.responses[409] = { description: 'Account Already Exists.'}
        return res.status(200).send(false);
    }
    ...
    // #swagger.responses[500] = { description: 'Server Error.'}
        return res.status(500).send(false);
    
    */
);
router.post(
    '/login',
    login
    /* 
    #swagger.tags = ['User']
    #swagger.summary = 'user login with their credentials'
    #swagger.description = 'Add Desc Here'

    #swagger.method = 'post'
    #swagger.produces = ['application/json']
    #swagger.consumes = ['application/json']

    #swagger.parameters['Login'] = {
        in: 'body',
        description: 'Req.Body Data',
        required: true,
        schema: {
            email: "sethu@gmail.com",
            password: "zxcASD123@!$"
        }
    }
    ...
    if(...) {
        // #swagger.responses[200] = { description: 'Login Successful.' }
        return res.status(200).send(data);
    }
    ...
    else if(...) {
        // #swagger.responses[400] = { description: 'Validaiton Error.' }
        return res.status(200).send(false);
    }
    ...
    else if(...) {
        // #swagger.responses[401] = { description: 'Incorrect Email or Password.' }
        return res.status(200).send(false);
    }
    ...
    else if(...) {
        // #swagger.responses[404] = { description: 'Account Not Exists.' }
        return res.status(200).send(false);
    }
    ...
    // #swagger.responses[500] = { description: 'Server Error.' }
    return res.status(500).send(false);
    
    */
);
router.post(
    '/markResult',
    verifyToken,
    markResult
    /* 
    #swagger.tags = ['User']
    #swagger.summary = 'overall mark & speed for the level'
    #swagger.description = 'Add Desc Here'

    #swagger.method = 'post'
    #swagger.produces = ['application/json']
    #swagger.consumes = ['application/json']

    #swagger.parameters['Result'] = {
        in: 'body',
        description: 'Req.Body Data',
        required: true,
        schema: {
            QA_ID: "6555c642fe134b47d29f820f",
            questionResult: "how are you feeling right now",
            answerResult: "I am feeling fine thank you",
            questionMark: 80,
            answerMark: 70,
            level: 1,
            scenario: "Post Surgery",
            timeTakenForQuestion: 5,
            timeTakenForAnswer: 3
        }
    }
    ...
    if(...) {
        // #swagger.responses[200] = { description: 'Result Submitted Successfully or Level Completed.' }
        return res.status(200).send(data);
    }
    ...
    else if(...) {
        // #swagger.responses[400] = { description: 'Validaiton Error.' }
        return res.status(200).send(false);
    }
    ...
    else if(...) {
        // #swagger.responses[401] = { description: 'Invalid token.' }
        return res.status(200).send(false);
    }
    ...
    else if(...) {
        // #swagger.responses[404] = { description: 'Question Not Found.' }
        return res.status(200).send(false);
    }
    ...
    // #swagger.responses[500] = { description: 'Server Error.' }
    return res.status(500).send(false);
    
    */
);
router.get(
    '/logout',
    verifyToken,
    logout
    /*
    #swagger.tags = ['User & Admin']
    #swagger.summary = 'Logs out current logged in user session'
    #swagger.description = 'Add Desc Here'

    #swagger.method = 'get'
    #swagger.produces = ['application/json']
    ...
    // #swagger.responses[200] = { description: 'Logged out Successful.' }
    return res.status(200).send(false);
    }
    ...
    // #swagger.responses[401] = { description: 'Invalid token.' }
    return res.status(200).send(false);
    ...
    // #swagger.responses[500] = { description: 'Server Error.' }
    return res.status(500).send(false);
    
    */
);

export default router;
