import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { UserService } from "../../user/user.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly userService: UserService) {
        super();
    }

    serializeUser(user: any, done: (err: Error, user: any) => void): any {
        done(null, {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    }

    async deserializeUser(payload: any, done: (err: Error, user: any) => void): Promise<any> {
        const user = await this.userService.getUserById(payload.id);
        done(null, user);
    }
}
