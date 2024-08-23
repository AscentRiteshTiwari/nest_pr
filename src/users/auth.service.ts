import { Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";

@Injectable()
export class AuthService{
    constructor(private usersservice: UsersService){}

    authsignup(email: string, password: string){
        //See if email is in use

        //Hash the users Password

        //Create a new user and Save it 

        //return the user

    }

    authsignin(){

    }
}