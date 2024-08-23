import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    //InjectRepository(user) is used to tell the DI Stystem that we need the user repository 
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    create(email: string, password: string) {
        const user = this.repo.create({email, password});

        return this.repo.save(user);
    }

    findOne(id: number)
    {
        return this.repo.findOneBy({id});
    }

    async find(email: string) {
        return this.repo.find({where:{email}});
    }

    async update(id: number, attr:Partial<User>){
        const user = await this.findOne(id);
        if(!user) {
            throw new NotFoundException('user Does not Exist');
        }
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
 