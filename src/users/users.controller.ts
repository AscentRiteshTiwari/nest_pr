import { 
    Body, 
    Controller, 
    Post, 
    Get , 
    Patch, 
    Param, 
    Query, 
    Delete,
    Session,
    NotFoundException,
    UseInterceptors, 
    UseGuards} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize, SerializerInterceptor } from 'src/interceptor/serialize.interceptor';
import { AuthService } from './auth.service';
import { currentUser } from './decorator/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-cuser.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';


@Controller('auth')

//Appling custom Interceptors on whole controller
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
//to apply the useInterceptor see on users.module.ts


export class UsersController {
    constructor(
        private userservice: UsersService,
        private authservice:AuthService){}

    //simplyfing the Sessions Propety (simple world)

// @Get('/colors/:color')
// setColor(@Param('color') color:string, @Session() session:any)
// {
//     session.color = color;
// }

// @Get('/colors')
// getColor(@Session() session: any) {
//     return session.color;
// }

    @Post('/signup')
    async createUser(@Body() body:CreateUserDto, @Session() session:any){
        const user = await this.authservice.authsignup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session:any)
    {
        const user = await this.authservice.authsignin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    //Session Management current signinUser(using Interceptor+ decorator)
    @Get('/WhoAmI')
    @UseGuards(AuthGuard)
    whoAmI(@currentUser() user: User)
    {
        return user;
    }

    //signout
    @Post('/signout')
    signout(@Session() session: any) {
        session.userId = null;
    }

    //Interceptor intercept the outgoing response and apply classserailizerInterceptor so that instance can beconverted to a plain object
    @UseInterceptors(new SerializerInterceptor(UserDto))
    @Get('/:id')
    async findUser(@Param('id') id: string){
        console.log('Running the main route handler')
        const user = await this.userservice.findOne(parseInt(id));
        if(!user)
        {
            throw new NotFoundException("User Not Found")
        }
        return user;
    }

    //Interceptor intercept the outgoing response and apply classserailizerInterceptor so that instance can beconverted to a plain object
    //@UseInterceptors(new ClassSerializerInterceptor(userDto))
    // @Serialize(xyzDto) 
    @Get()
    async findAllUsers(@Query('email') email:string){
        const user = await this.userservice.find(email);
        //it return a empty array of string if it didn't find the user with email , to throw the 
        //exception whe have check for length not (!user)
        if(user.length === 0){
            throw new NotFoundException('user Not found');
        }
        return user;

    }

    //@Serialize(cutomDto)
    @Delete('/:id')
    removeuser(@Param('id' )id: string){
        return this.userservice.remove(parseInt(id));
    }


    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body:UpdateUserDto)
    {
        return this.userservice.update(parseInt(id), body);
    }

}
