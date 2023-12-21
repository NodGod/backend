import * as express from 'express';
import * as OrganiserController from './controller/OrganiserController';
import * as EventController from './controller/EventController';
import * as ItemController from './controller/ItemController';

const router = express.Router();

router.post('/organisers', OrganiserController.createOrganiser);
router.get('/organisers', OrganiserController.getAllOrganisers);
router.get('/organisers/:id', OrganiserController.getOrganiserById);
router.put('/organisers/:id', OrganiserController.updateOrganiser);
router.delete('/organisers/:id', OrganiserController.deleteOrganiser);

router.post('/organisers/:id/events', EventController.createEvent);
router.get('/organisers/:id/events', EventController.getAllEvents);
router.get('/organisers/:id/events/:eid', EventController.getEventById);
router.put('/organisers/:id/events/:eid', EventController.updateEvent);
router.delete('/organisers/:id/events/:eid', EventController.deleteEvent);

router.post('/organisers/:id/events/:eid/items', ItemController.createItem);
router.get('/organisers/:id/events/:eid/items', ItemController.getAllItems);
router.get('/organisers/:id/events/:eid/items/:iid', ItemController.getItemById);
router.put('/organisers/:id/events/:eid/items/:iid', ItemController.updateItem);
router.delete('/organisers/:id/events/:eid/items/:iid', ItemController.deleteItem);


export default router;