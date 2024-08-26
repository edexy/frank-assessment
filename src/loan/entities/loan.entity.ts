/* eslint-disable prettier/prettier */
import { Vehicle } from 'src/vehicle/entities/vehicle.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


export enum LOAN_STATUS {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

//no indexes for this model

@Entity()
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  vehicle: Vehicle;

  @Column()
  applicantName: string;

  @Column()
  vehicleLoanAmount: number;

  @Column('decimal', { default: 5 })
  interestRate?: number;

  @Column('date')
  applicationDate: Date;

  @Column()
  loanTermMonths: number; // e.g., 36 months

  @Column({ default: LOAN_STATUS.PENDING })
  status: LOAN_STATUS;

  @Column({ nullable: true })
  approvalDate: Date;

  @Column({ nullable: true })
  rejectionReason?: string;
}
