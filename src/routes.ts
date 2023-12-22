import * as express from 'express';
import * as OrganiserController from './controller/OrganiserController';
import * as EventController from './controller/EventController';
import * as ItemController from './controller/ItemController';
import * as RegistrationController from './controller/RegistrationController';
const auth = require("./auth");
const router = express.Router();

router.post('/register', RegistrationController.register);
router.post('/login', RegistrationController.login);

router.get('/users', auth, RegistrationController.getAllUsers);
router.put('/users/:id', auth, RegistrationController.updateUser);
router.delete('/users/:id', auth, RegistrationController.deleteUser);


router.post('/organisers', auth, OrganiserController.createOrganiser);
router.get('/organisers', auth, OrganiserController.getAllOrganisers);
router.get('/organisers/:id', auth, OrganiserController.getOrganiserById);
router.put('/organisers/:id', auth, OrganiserController.updateOrganiser);
router.delete('/organisers/:id', auth, OrganiserController.deleteOrganiser);

router.post('/organisers/:id/events', auth, EventController.createEvent);
router.get('/organisers/:id/events', auth, EventController.getAllEvents);
router.get('/organisers/:id/events/:eid', auth, EventController.getEventById);
router.put('/organisers/:id/events/:eid', auth, EventController.updateEvent);
router.delete('/organisers/:id/events/:eid', auth, EventController.deleteEvent);

router.post('/organisers/:id/events/:eid/items', auth, ItemController.createItem);
router.get('/organisers/:id/events/:eid/items', auth, ItemController.getAllItems);
router.get('/organisers/:id/events/:eid/items/:iid', auth, ItemController.getItemById);
router.put('/organisers/:id/events/:eid/items/:iid', auth, ItemController.updateItem);
router.delete('/organisers/:id/events/:eid/items/:iid', auth, ItemController.deleteItem);


export default router;