import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ScrapeDatabaseEntity } from './scrape.entity';

@Entity('scrape_data')
export class ScrapeDataDatabaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => ScrapeDatabaseEntity, (scrape) => scrape.id)
  scrape: number;

  @Column()
  link: string;

  @Column()
  linkName: string;
}
