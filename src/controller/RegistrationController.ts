import { Request, Response } from 'express';
import { AppDataSource } from "../data-source";
import { Organiser } from '../entity/Organiser';
import { User } from '../entity/User';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
export class RegistrationController{

}

export const register = async (req: Request, res: Response) => {
    try {
        const { name, surname, email, password, organisationId } = req.body;
        if (!(name && surname && email && password && organisationId)) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const userRepository = AppDataSource.getRepository(User);
        const organiserRepository = AppDataSource.getRepository(Organiser);
    
        const maxIdUser = await userRepository.query('SELECT MAX(id) as maxId FROM user');
        const newId = (parseInt(maxIdUser[0].maxId) || 0) + 1;

        const oldUser = await userRepository.findOne({relations:["organisation"],where: {email: email}});

        if (oldUser) {
            return res.status(409).json({error: "User Already Exist. Please Login"});
        }

        const organisation = await organiserRepository.findOne({where: {id: organisationId}})

        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = new User();
        user.id = newId;
        user.name = name;
        user.surname = surname;
        user.email = email.toLowerCase();
        user.password = encryptedPassword;
        user.organisation = organisation;
        user.approved = false;
        user.type = 0;
        const token = jwt.sign(
            { 
                user_id: user.id,
                name: user.name,
                role: user.type,
                organisationId: user.organisation.id,
                approved: user.approved
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        user.token = token;
        await userRepository.save(user);
    
        res.status(201).json({ user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const login = async (req: Request, res: Response) => {
    try {
        const { email, password} = req.body;
        if (!(email && password)) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({relations:["organisation"], where: {email: email.toLowerCase()}});

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
              { 
                user_id: user.id,
                name: user.name,
                role: user.type,
                organisationId: user.organisation.id,
                approved: user.approved
               },
              process.env.TOKEN_KEY,
              {
                expiresIn: "2h",
              }
            );
            user.token = token;
            res.status(200).json({user});
          }
          else{
              res.status(400).json({error: "Invalid Credentials"});
          }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const deleteUser = async (req: Request, res: Response) => {
    try {
        if(req.headers.role != "1"){
            return res.status(401).json({error: "Access denied"})
        }
        const id = parseInt(req.params.id);
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({where: {id: id}});

        if (user) {
            userRepository.remove(user);
            res.status(204).json();
        }
        else{
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const updateUser = async (req: Request, res: Response) => {
    try {
        if(req.headers.role != "1"){
            return res.status(401).json({error: "Access denied"})
        }
      const id = parseInt(req.params.id);
      const { role, approved } = req.body;
  
      const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({where: {id: id}});
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.type = parseInt(role);
      user.approved = parseInt(approved) == 1;
  
      await userRepository.save(user);
  
      res.status(200).json({ user: {name: user.name, type: role, approved: approved} });
    } catch (error) {
      console.error('Error updating User:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const getAllUsers = async (req: Request, res: Response) => {
    try {
        if(req.headers.role != "1"){
            throw new Error("Access denied")
        }
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find({relations: ['organisation']});
        res.json({users});
      } catch (error) {
        console.error('Error creating organiser:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  };



  