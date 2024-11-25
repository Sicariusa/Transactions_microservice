import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'public' , name: 'users'})
export class Transactions {
    @PrimaryGeneratedColumn('tran_id')
    id: string
}