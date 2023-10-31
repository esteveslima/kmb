import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('scrape')
export class ScrapeDatabaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: number;

  @Column()
  pageName: string;

  @Column()
  status: 'pending' | 'success' | 'failure';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
