import express from 'express';
import {
    singleQA,
    getQA,
    postDepartment,
    getDepartment,
    updateUserDepartment,
    getUserDepartment,
} from './controller.js';
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
    
    #swagger.parameters['QA'] = {
        in: 'body',
        description: 'Question & Answer Req.Body Data',
        required: true,
        schema: {
            question: "Let me explain how this treatment works",
            answer: "Please go ahead and explain how the treatment works In did like to know more",
            department: ["Cardiology"],
            level: 1,
            createdBy: "Sethu K"
        }
    }
    ...
    if(...) {
        // #swagger.responses[200] = { description: 'New Question Added Successfully.' }
        return res.status(200).send(data);
    }
    ...
    else if(...) {
        // #swagger.responses[400] = { description: 'Validaiton Error.'}
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
    '/getQA',
    verifyToken,
    getQA
    /* 
    #swagger.tags = ['User & Admin']
    #swagger.summary = 'get question and answer'
    #swagger.description = 'Add Desc Here'

    #swagger.method = 'get'
    #swagger.produces = ['application/json']
       
    #swagger.parameters['level'] = {
        in: 'query',
        name: 'level',
        required: true,
        description: 'The level of the question is retrieve.',
        schema: {
            type: 'integer'
        }
    }

    #swagger.parameters['index'] = {
            in: 'query',
            name: 'index',
            required: true,
            description: 'The index of the question is retrieve.',
            schema: {
                type: 'integer'
            }
    }

    if(...) {
        // #swagger.responses[200] = { description: 'Question & Answer Retrieved Successfully.' }
        return res.status(200).send(data);
    }
    ...
    else if(...) {
        // #swagger.responses[400] = { description: 'Validaiton Error or Please Select the Department or You have completed your session'}
        return res.status(200).send(false);
    }
    ...
    else if(...) {
        // #swagger.responses[401] = { description: 'Invalid Token.'}
        return res.status(200).send(false);
    }
    ...
    // #swagger.responses[500] = { description: 'Server Error.'}
        return res.status(500).send(false);
    */
);

router.post('/postDepartment', verifyToken, authUser, postDepartment);
router.get('/getDepartment', verifyToken, getDepartment);
router.put('/updateUserDepartment', verifyToken, updateUserDepartment);
router.get('/getUserDepartment', verifyToken, getUserDepartment);

export default router;
