import express from 'express';
import verifyToken from '../middlewares/token.js';
import { register, login, logout } from './controller.js';

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

    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User Req.Body Data',
        required: true,
        schema: {
            fullName: "Sethu K",
            email: "sethu@gmail.com",
            phoneNo: "9876543210",
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
        // #swagger.responses[400] = { description: 'validation Error.'}
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
    #swagger.summary = 'user login with their credentials.'
    #swagger.description = 'Add Desc Here'

    #swagger.method = 'post'
    #swagger.produces = ['application/json']
    #swagger.consumes = ['application/json']

    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User Req.Body Data',
        required: true,
        schema: {
            email: "palani@gmail.com",
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
        // #swagger.responses[400] = { description: 'validation Error.' }
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
router.get(
    '/logout',
    verifyToken,
    logout
    /*
    #swagger.tags = ['User & Admin']
    #swagger.summary = 'Logs out current logged in user session.'
    #swagger.description = 'Add Desc Here'
    #swagger.produces = ['application/json']
    ...
    // #swagger.responses[200] = { description: 'Logged out Successful.' }
    return res.status(200).send(false);
    }
    ...
    // #swagger.responses[401] = { description: 'Invalid token.' }
    return res.status(200).send(false);
    
    */
);

export default router;
