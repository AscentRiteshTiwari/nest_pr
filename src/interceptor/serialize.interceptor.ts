import { 
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors
 } from "@nestjs/common";
 import { Observable } from "rxjs";
 import { map } from "rxjs";
 import { plainToInstance } from "class-transformer";


 //Interceptor intercept the outgoing response and apply classserailizerInterceptor so that instance can beconverted to a plain object

 export function Serialize(dto: any) {
    return  UseInterceptors(new SerializerInterceptor(dto));
 }

 export class SerializerInterceptor implements NestInterceptor{
    constructor(private dto:any){}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        
        //run something before the request is handleby the request handler
        // console.log('I am running before the handler callout', context);
 
        return handler.handle().pipe(
            map((data:any) => {
                //Run something before the response is sent out
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true,
                })
            })
        )
        
    }
 }  