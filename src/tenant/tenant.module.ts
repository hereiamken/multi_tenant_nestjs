import { BadRequestException, MiddlewareConsumer, Module, Scope } from "@nestjs/common";
import { Connection, createConnection, getConnection } from "typeorm";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from "../entities/tenant.entity";
import { REQUEST } from "@nestjs/core";

export const TENANT_CONNECTION = 'TENANT_CONNECTION';
@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
  ],
  providers: [
    {
      provide: TENANT_CONNECTION,
      inject: [
        REQUEST,
        Connection,
      ],
      scope: Scope.REQUEST,
      useFactory: async (request, connection) => {
        const tenant: Tenant = await connection.getRepository(Tenant).findOne(({ where: { host: request.headers.host } }));
        return getConnection(tenant.name);
      }
    }
  ],
  exports: [
    TENANT_CONNECTION
  ]
})
export class TenantModule {
    constructor(private readonly connection: Connection) {}
    
    configure(consumer: MiddlewareConsumer): void {
        consumer
          .apply(async (req, res, next) => {
    
            const tenant: Tenant = await this.connection.getRepository(Tenant).findOne(({ where: { host: req.headers.host } }));
    
            if (!tenant) {
              throw new BadRequestException(
                'Database Connection Error',
                'There is a Error with the Database!',
              );
            }
    
            try {
              getConnection(tenant.name);
              next();
            } catch (e) {
    
              const createdConnection: Connection = await createConnection({
                name: tenant.name,
                type: "mysql",
                host: "localhost",
                port: 3306,
                username: 'root',
                password: '123456',
                database: tenant.name,
                entities: [ __dirname + "/entities/*.entity{.ts,.js}" ],
                synchronize: true,
                logging: true
              })
    
              if (createdConnection) {
                next();
              } else {
                throw new BadRequestException(
                  'Database Connection Error',
                  'There is a Error with the Database!',
                );
              }
            }
          }).forRoutes('*');
      }
}