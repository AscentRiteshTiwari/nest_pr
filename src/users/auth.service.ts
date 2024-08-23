import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";


const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService{
    constructor(private usersservice: UsersService){}

    async authsignup(email: string, password: string){
        //See if email is in use
         const users = await this.usersservice.find(email);
         if(users.length) {
            throw new BadRequestException('email is in use');
         }

        //Hash the users Password
        //Generate the Salt
        const salt = randomBytes(8).toString('hex');
        
        //hash the salt and the Password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //join the hashed result and salt toghether
        const result = salt + '.' + hash.toString('hex');

        //Create a new user and Save it 
        const user = await this.usersservice.create(email, result);

        //return the user
        return user;

    }

    async authsignin(email: string, password: string){
        //See if email is in Database or not
        const [users] = await this.usersservice.find(email);
        if(!users) {
           throw new NotFoundException('user not found');
        }

        //find the user and find the salt and has value of the password
        const [salt, storedHash] = users.password.split('.');

        //hash the salt and the Password together
        const newHash = (await scrypt(password, salt, 32)) as Buffer;

        //compare the New and stored hash
        if(storedHash !== newHash.toString('hex'))
        {
            throw new BadRequestException('bad Password');
        }

        return users;
    }
}