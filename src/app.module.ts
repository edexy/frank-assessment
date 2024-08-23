import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleModule } from './vehicle/vehicle.module';
import { LoanModule } from './loan/loan.module';
import { ValuationModule } from './valuation/valuation.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    VehicleModule,
    LoanModule,
    UserModule,
    ValuationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})




export class AppModule {}
