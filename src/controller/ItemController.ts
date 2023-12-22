import { Request, Response } from 'express';
import { AppDataSource } from "../data-source";
import { OrganisedEvent } from '../entity/Event';
import { Item } from '../entity/Item';

export class ItemController{
    
}

export const createItem = async (req: Request, res: Response) => {
  try {
    if(req.headers.role != "1" && req.headers.role != "0"){
      return res.status(401).json({error: "Access denied"})
    }
    const organiserId = parseInt(req.params.id);
    const eventId = parseInt(req.params.eid);
    const { name, quantity, price} = req.body;
    if (!name || !quantity || !price) {
      return res.status(400).json({ error: 'name, quantity, price are required fields.' });
    }
    const eventRepository = AppDataSource.getRepository(OrganisedEvent);
    const itemRepository = AppDataSource.getRepository(Item);
    
    const event = await eventRepository.findOne({
        where: {organiser: {id: organiserId}, id: eventId}
    });
    if(!event){
        return res.status(400).json({error: 'event doesn\'t exist'});
    }
    const maxIdEvent = await itemRepository.query('SELECT MAX(id) as maxId FROM item');
    const newId = (parseInt(maxIdEvent[0].maxId) || 0) + 1;
    const item = new Item();
    item.id = newId;
    item.name = name;
    item.quantity = parseInt(quantity);
    item.price = parseFloat(price);
    item.event = event;

    await itemRepository.save(item);

    res.status(201).json({ item });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    if(req.headers.role != "1" && req.headers.role != "0"){
      return res.status(401).json({error: "Access denied"})
    }
    const organiserId = parseInt(req.params.id);
    const eventId = parseInt(req.params.eid);
    const itemRepository = AppDataSource.getRepository(Item);
    const items = await itemRepository.find({
      where: {event: {organiser: {id: organiserId}, id: eventId}},
      relations: ['event']
    });
    res.json({ items });
  } catch (error) {
    console.error('Error getting item by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    if(req.headers.role != "1" && req.headers.role != "0"){
      return res.status(401).json({error: "Access denied"})
    }
    const organiserId = parseInt(req.params.id);
    const eventId = parseInt(req.params.eid);
    const itemId = parseInt(req.params.iid);
    const itemRepository = AppDataSource.getRepository(Item);
    const item = await itemRepository.findOne({
      where: {id: itemId, event: {id: eventId, organiser: {id: organiserId}}}
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ item });
  } catch (error) {
    console.error('Error getting item by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    if(req.headers.role != "1" && req.headers.role != "0"){
      return res.status(401).json({error: "Access denied"})
    }
    const organiserId = parseInt(req.params.id);
    const eventId = parseInt(req.params.eid);
    const eventRepository = AppDataSource.getRepository(OrganisedEvent);
    const itemRepository = AppDataSource.getRepository(Item);
    const itemId = parseInt(req.params.iid);
    const { name, quantity, price} = req.body;

    const item = await itemRepository.findOne({
      where: {id: itemId, event: {id: eventId}}
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    item.name = name;
    item.quantity = parseInt(quantity);
    item.price = parseFloat(price);

    await itemRepository.save(item);

    res.status(200).json({ item });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    if(req.headers.role != "1" && req.headers.role != "0"){
      return res.status(401).json({error: "Access denied"})
    }
    const organiserId = parseInt(req.params.id);
    const eventId = parseInt(req.params.eid);
    const itemRepository = AppDataSource.getRepository(Item);
    const itemId = parseInt(req.params.iid);
    
    const item = await itemRepository.findOne({
      where: {id: itemId, event: {id: eventId, organiser: {id: organiserId}}}
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await itemRepository.remove(item);

    res.status(204).json();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
