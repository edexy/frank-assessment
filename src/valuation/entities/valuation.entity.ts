/* eslint-disable prettier/prettier */
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


@Entity()
export class Valuation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vehicle)
  vehicle: Vehicle;

  @Column()
  class: number;

  @Column()
  model: number;

  @Column()
  manufacturer: string;

  @Column()
  country: string;

  @Column()
  wmi: string;

  @Column()
  vis: string;

  @Column()
  vds: string;

  @Column()
  valuationDate: Date;
}
