import { PassportSerializer } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AdminService } from "../../admin/admin.service"; 

@Injectable()
export class AdminSerializer extends PassportSerializer {
    constructor(private readonly adminService: AdminService) {
        super();
    }

    serializeUser(admin: any, done: (err: Error, admin: any) => void): any {
        done(null, {
            username: admin.username,
        });
    }

    async deserializeUser(payload: any, done: (err: Error, admin: any) => void): Promise<any> {
        const admin = await this.adminService.findAdminByUsername(payload.username);
        done(null, admin);
    }
}
