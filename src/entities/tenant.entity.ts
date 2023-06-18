import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['host'])
export class Tenant {
    
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @PrimaryColumn()
  host: string;

  @Column()
  name: string;
}
