import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    //InjectRepository(user) This decorator is used to tell NestJS’s Dependency Injection (DI) system 
    //that it should provide an instance of a Repository for the specified entity (in this case, User).
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    create(email: string, password: string) {
        const user = this.repo.create({email, password});

        return this.repo.save(user);
    }

    findOne(id: number)
    {
        if(!id)
        {
            throw new NotFoundException('No user is logged in');
        } 
        return this.repo.findOneBy({id});
    }

    async find(email: string) {
        return this.repo.find({where:{email}});
    }

    //Partial<User> is a TypeScript utility type that makes all properties of 
    //User optional.This allows you to provide only the attributes that need to be 
    //updated, rather than requiring a complete User object.'

    async update(id: number, attr:Partial<User>){
        const user = await this.findOne(id);
        if(!user) {
            throw new NotFoundException('user Does not Exist');
        }

        //Object.assign(target, source): This method copies the properties from the source object (attr) to the target object (user).
        Object.assign(user, attr); 
        return this.repo.save(user);
    }

    async remove(id: number){
        const user = await this.findOne(id);
        if(!user) {
            throw new NotFoundException('user Does not Exist');
        }

        return this.repo.remove(user);
    }
}