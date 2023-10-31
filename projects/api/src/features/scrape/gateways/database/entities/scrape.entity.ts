import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ScrapeDataDatabaseEntity } from './scrape-data.entity';

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

  @OneToMany(
    (type) => ScrapeDataDatabaseEntity,
    (scrapeData) => scrapeData.scrape,
  )
  scrapeData?: ScrapeDataDatabaseEntity[];
}
