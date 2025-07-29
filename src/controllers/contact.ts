import { Request, Response } from 'express';
import { apiResponse } from '../common';
import { contactModel } from '../database/models/contact';
import { responseMessage } from '../helper';

export const createContact= async(req:Request,res:Response)=>{

    try {
        
        const {fullName,emailOrMobile,message,service} =req.body;

        const contact = new contactModel({
            fullName,
            emailOrMobile,
            service,
            message,
            createdBy:req.user?.id,
            updatedBy:req.user?.id
        })

        await contact.save();

        return res.status(201).json(
            new apiResponse(201,"Contact created successfully",{data:contact},{})
        )

    } catch (error) {
        console.error('Create Contact Error:',error);
        return res.status(500).json(
            new apiResponse(500,'Internal server error',{},error)
        )        
    }
}

// Get all contacts

export const getAllContacts = async(req:Request,res:Response) =>{
    try {
        
        const contacts=await contactModel.find().sort({createdAt : -1});

        return res.status(200).json(
            new apiResponse(200,'Contacts fetched successfully',{data:contacts},{})
        )

    } catch (error) {
        console.error('Get All Contacts Error:',error); 

        return res.status(500).json(
            new apiResponse(500,'Internal server error',{},error)
        )
    }
}