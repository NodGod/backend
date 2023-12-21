import { Request, Response } from 'express';
import { AppDataSource } from "../data-source";
import { Organiser } from '../entity/Organiser';

export class OrganiserController{

}

export const createOrganiser = async (req: Request, res: Response) => {
  try {
    const { name, phoneNumber, email } = req.body;
    if (!name || !phoneNumber || !email) {
      return res.status(400).json({ error: 'Name, phoneNumber, and email are required fields.' });
    }
    const organiserRepository = AppDataSource.getRepository(Organiser);

    const maxIdOrganiser = await organiserRepository.query('SELECT MAX(id) as maxId FROM organiser');
    const newId = (parseInt(maxIdOrganiser[0].maxId) || 0) + 1;
    const organiser = new Organiser();
    organiser.id = newId;
    organiser.name = name;
    organiser.phoneNumber = phoneNumber;
    organiser.email = email;

    await organiserRepository.save(organiser);

    res.status(201).json({ organiser });
  } catch (error) {
    console.error('Error creating organiser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllOrganisers = async (req: Request, res: Response) => {
  try {
    const organiserRepository = AppDataSource.getRepository(Organiser);
    const organisers = await organiserRepository.find();
    res.json({ organisers });
  } catch (error) {
    console.error('Error creating organiser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getOrganiserById = async (req: Request, res: Response) => {
  try {
    const organiserId = parseInt(req.params.id);
    const organiserRepository = AppDataSource.getRepository(Organiser);
    const organiser = await organiserRepository.findOne({
      where: {id: organiserId}
    });

    if (!organiser) {
      return res.status(404).json({ error: 'Organiser not found' });
    }

    res.status(200).json({ organiser });
  } catch (error) {
    console.error('Error getting organiser by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateOrganiser = async (req: Request, res: Response) => {
  try {
    const organiserId = parseInt(req.params.id);
    const { name, phoneNumber, email } = req.body;

    const organiserRepository = AppDataSource.getRepository(Organiser);
    const organiser = await organiserRepository.findOne({
      where: {id: organiserId}
    });

    if (!organiser) {
      return res.status(404).json({ error: 'Organiser not found' });
    }

    organiser.name = name;
    organiser.phoneNumber = phoneNumber;
    organiser.email = email;

    await organiserRepository.save(organiser);

    res.status(200).json({ organiser });
  } catch (error) {
    console.error('Error updating organiser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteOrganiser = async (req: Request, res: Response) => {
  try {
    const organiserId = parseInt(req.params.id);

    const organiserRepository = AppDataSource.getRepository(Organiser);
    const organiser = await organiserRepository.findOne({
      where: {id: organiserId},
    });

    if (!organiser) {
      return res.status(404).json({ error: 'Organiser not found' });
    }

    await organiserRepository.remove(organiser);

    res.status(204).json();
  } catch (error) {
    console.error('Error deleting organiser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
