import { Request, Response } from 'express';
import { AppDataSource } from "../data-source";
import { Organiser } from '../entity/Organiser';
import { OrganisedEvent } from '../entity/Event';

export class EventController{
    
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    if(req.headers.role != "1" && req.headers.role != "0"){
      return res.status(401).json({error: "Access denied"})
    }
    const organiserId = parseInt(req.params.id);
    const { name, description, date, address} = req.body;
    if (!name || !description || !date || !address) {
      return res.status(400).json({ error: 'name, description, date, address are required fields.' });
    }
    const organiserRepository = AppDataSource.getRepository(Organiser);
    const eventRepository = AppDataSource.getRepository(OrganisedEvent);
    
    const organiser = await organiserRepository.findOne({
        where: {id: organiserId}
    });
    if(!organiser){
        return res.status(400).json({error: 'organiser doesn\'t exist'});
    }
    const maxIdEvent = await eventRepository.query('SELECT MAX(id) as maxId FROM organised_event');
    const newId = (parseInt(maxIdEvent[0].maxId) || 0) + 1;
    const event = new OrganisedEvent();
    event.id = newId;
    event.name = name;
    event.description = description;
    event.date = new Date(date);
    event.address = address;
    event.organiser = organiser;

    await eventRepository.save(event);

    res.status(201).json({ event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    if(req.headers.role != "1" && req.headers.role != "0"){
      return res.status(401).json({error: "Access denied"})
    }
    const organiserId = parseInt(req.params.id);
    const eventRepository = AppDataSource.getRepository(OrganisedEvent);
    const events = await eventRepository.find({
      where: {organiser: {id: organiserId}},
      relations: ['organiser']
    });
    if (!events) {
      return res.status(404).json({ error: 'Events not found' });
    }
    res.json({ events });
  } catch (error) {
    console.error('Error getting event by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    if(req.headers.role != "1" && req.headers.role != "0"){
      return res.status(401).json({error: "Access denied"})
    }
    const organiserId = parseInt(req.params.id);
    const eventId = parseInt(req.params.eid);
    const eventRepository = AppDataSource.getRepository(OrganisedEvent);
    const event = await eventRepository.findOne({
      where: {organiser: {id: organiserId}, id: eventId}
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error('Error getting event by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    if(req.headers.role != "1" && req.headers.role != "0"){
      return res.status(401).json({error: "Access denied"})
    }
    const organiserId = parseInt(req.params.id);
    const organiserRepository = AppDataSource.getRepository(Organiser);
    const eventRepository = AppDataSource.getRepository(OrganisedEvent);
    const eventId = parseInt(req.params.eid);
    const { name, description, date, address} = req.body;

    const event = await eventRepository.findOne({
      where: {organiser: {id: organiserId}, id: eventId}
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    event.name = name;
    event.description = description;
    event.date = new Date(date);
    event.address = address;

    await eventRepository.save(event);

    res.status(200).json({ event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    if(req.headers.role != "1" && req.headers.role != "0"){
      return res.status(401).json({error: "Access denied"})
    }
    const organiserId = parseInt(req.params.id);
    const eventRepository = AppDataSource.getRepository(OrganisedEvent);
    const eventId = parseInt(req.params.eid);
    
    const event = await eventRepository.findOne({
      where: {organiser: {id: organiserId}, id: eventId}
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await eventRepository.remove(event);

    res.status(204).json();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
